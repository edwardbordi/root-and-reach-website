/**
 * GoHighLevel (LeadConnector) contact push — SERVER-ONLY.
 *
 * Two functions, because sites need two shapes and they are not the same job:
 *   subscribeToMailingList()  — one email, one tag. The footer signup.
 *   pushLeadToHighLevel()     — a named contact with a note. Contact forms,
 *                               enquiries, long branching applications.
 *
 * Reads HIGHLEVEL_TOKEN / HIGHLEVEL_LOCATION_ID from server env and must NEVER
 * be imported into a client component — only API routes use it, so the token
 * stays out of the browser bundle. CRM.md § "Phase 2" explains what happens if
 * it is, and gives the one-line grep that proves it is not.
 *
 * That grep looks for this file's own path inside any client component, so do
 * not quote either string in a comment anywhere under src/ — a check that
 * reports itself is a check people learn to ignore.
 *
 * ── Why config is read lazily ──────────────────────────────────────────────
 * `getConfig()` is called inside the request handler, never at module scope.
 * CI and preview builds run env-naked, so a module-scope read would make
 * `next build` fail without secrets present. (BUILD-ENV Law, AGENTS.md.)
 *
 * ── Why it is safe to ship before the CRM exists ───────────────────────────
 * With no token set these return `{status: "skipped"}` rather than throwing,
 * and the calling route decides what to tell the visitor. So a form can be
 * genuinely live before the CRM is connected — provided the route writes the
 * submission somewhere a human will look. Switching the CRM on is then two
 * environment variables and a redeploy, with no code change.
 *
 * ── Why this FAILS LOUD ────────────────────────────────────────────────────
 * On most sites built from this template, GoHighLevel IS the storage — there is
 * no database behind it. A swallowed failure means a submission that no longer
 * exists anywhere, and the visitor was told it worked. Every non-2xx returns a
 * status the route can act on; nothing here decides on its own to be quiet.
 */

const BASE = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";

/**
 * Every call is bounded. One submission makes up to three sequential calls, and
 * with no timeout a degraded GoHighLevel blows past the serverless function
 * limit — the process is KILLED, which means the fallback log, the only thing
 * that recovers a submission when the CRM write fails, never runs.
 *
 * ── 10s, not 5s, and the reason matters ───────────────────────────────────
 * 5s looks defensible: "slower than that means it is down, and we want the
 * fallback rather than the wait." A full scenario run disproved it. GoHighLevel
 * answered seven submissions normally and took longer than 5s on the eighth,
 * mid-burst. It was slow, not down, and that submission fell to the fallback
 * log for nothing.
 *
 * The fallback is not free. Nothing is lost — the payload is written to the log
 * and can be rebuilt by hand — but only if somebody READS the log, and nobody
 * watches runtime logs on an ordinary Tuesday. A timeout that fires on
 * transient slowness converts a working write into silent manual work.
 *
 * Safety still holds at 10s: worst case 30s against a route's `maxDuration`.
 * Do not raise this past ~15s without raising maxDuration with it.
 */
const HL_TIMEOUT_MS = 10_000;

/**
 * One submission from a form that collects a name.
 *
 * First and last name are separate fields rather than split from a single
 * input. Splitting on whitespace guesses wrong constantly — compound surnames,
 * particles like "van der", people who type one word — and on a site where a
 * real person replies to these, a mangled name is a real cost.
 */
export type HLLead = {
  firstName: string;
  lastName: string;
  email: string;
  /** Optional. GoHighLevel dedupes on email AND phone, so it improves matching. */
  phone?: string;
  /** Optional. Written to GoHighLevel's native Business Name field. */
  companyName?: string;
  /** Optional. Written to GoHighLevel's native Website field. */
  website?: string;
  /** CRM tags: the always-on provenance tag plus whatever this path means. */
  tags: string[];
  /** Written to GoHighLevel's native source field. */
  source: string;
  /**
   * The prose answers, as one note on the contact.
   *
   * Tags can hold "asked about the enterprise plan"; they cannot hold "we tried
   * this two years ago and it went badly, so I need to know X before I can sell
   * it internally." That answer is usually the most useful thing in the whole
   * submission, so it goes in a note rather than being flattened into tags.
   *
   * Note vs custom fields is a real decision, not a default — CRM.md § 3.6.
   */
  note?: string;
};

export type HLResult =
  | { status: "ok"; contactId: string }
  | { status: "skipped"; detail: string }
  | { status: "error"; detail: string };

type HLConfig = { token: string; locationId: string };

export function getConfig(): HLConfig | null {
  const token = process.env.HIGHLEVEL_TOKEN;
  const locationId = process.env.HIGHLEVEL_LOCATION_ID;
  if (!token || !locationId) return null;
  return { token, locationId };
}

/** Returns instead of throwing, always. */
export async function hlFetch(
  cfg: HLConfig,
  path: string,
  init: RequestInit,
): Promise<{ ok: boolean; status: number; json: Record<string, unknown> }> {
  const res = await fetch(BASE + path, {
    ...init,
    signal: AbortSignal.timeout(HL_TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Version: API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let json: Record<string, unknown> = {};
  try {
    json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

/**
 * The tag IS the mailing list.
 *
 * There is nothing else to join. A smart list in GoHighLevel built on this tag
 * is the list, and a welcome sequence triggers on the tag being added. Renaming
 * it therefore silently empties both — don't, without migrating the contacts
 * already carrying it.
 */
export const MAILING_LIST_TAG = "mailing-list";

/**
 * The footer mailing-list signup. One field, no name, no note.
 *
 * ── WHY THIS DOES NOT REUSE pushLeadToHighLevel ───────────────────────────
 * It would need a firstName it does not have and a note it does not want, and
 * the two have different failure appetites: a lost enquiry is a customer who
 * went elsewhere, while a lost signup is someone who can type their address
 * again. Sharing the function would mean sharing the escalation, and this one
 * does not deserve it.
 *
 * ── WHY AN UPSERT RATHER THAN A CREATE ────────────────────────────────────
 * The person may already be in the CRM — a past enquiry, a booking, someone the
 * client added by hand. GoHighLevel dedupes on email, so an upsert adds the tag
 * to whoever is already there instead of making a second contact with the same
 * address. That is the whole reason this needs no inbound webhook: the API does
 * the "existing or not" part itself.
 */
export async function subscribeToMailingList(
  email: string,
  source: string,
): Promise<HLResult> {
  const cfg = getConfig();
  if (!cfg) {
    console.error("[highlevel] not configured — cannot store signup", { email });
    return { status: "skipped", detail: "not configured" };
  }

  try {
    const up = await hlFetch(cfg, "/contacts/upsert", {
      method: "POST",
      body: JSON.stringify({
        locationId: cfg.locationId,
        email,
        tags: [MAILING_LIST_TAG],
        source,
      }),
    });

    const contact = (up.json.contact as Record<string, string>) ?? up.json;
    const contactId = contact?.id as string | undefined;
    const isDuplicate = /duplicate/i.test(JSON.stringify(up.json));

    if (!up.ok && !isDuplicate) {
      console.error("[highlevel] signup upsert failed", up.status, up.json);
      return { status: "error", detail: `upsert ${up.status}` };
    }
    if (!contactId) {
      console.error("[highlevel] signup returned no contact id", up.json);
      return { status: "error", detail: "no contact id" };
    }

    /* Second call, same as the lead path and for the same reason: an upsert
       against an EXISTING contact does not reliably merge tags, and an existing
       contact is the common case here. Without this, the people most likely to
       subscribe — ones who already know the business — are the ones least
       likely to end up on the list. Idempotent. */
    const tagRes = await hlFetch(cfg, `/contacts/${contactId}/tags`, {
      method: "POST",
      body: JSON.stringify({ tags: [MAILING_LIST_TAG] }),
    });
    if (!tagRes.ok) {
      console.error("[highlevel] signup tag failed", tagRes.status, tagRes.json, {
        contactId,
      });
      /* Fatal HERE, unlike on a lead. The tag IS the subscription — a contact
         without it has not joined anything, so reporting success would be a lie
         the person finds out about by never hearing from the business. */
      return { status: "error", detail: `tag ${tagRes.status}` };
    }

    return { status: "ok", contactId };
  } catch (err) {
    console.error("[highlevel] signup threw", err);
    return {
      status: "error",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Upsert the contact (GHL dedupes on email), then apply tags, then the note.
 *
 * Tags go on the upsert body AND are re-applied on the tag endpoint, because an
 * upsert against an EXISTING contact does not reliably merge tags — someone who
 * enquires about one service and later applies for another must end up with
 * both. The second call is idempotent.
 */
export async function pushLeadToHighLevel(lead: HLLead): Promise<HLResult> {
  const cfg = getConfig();
  if (!cfg) {
    console.error(
      "[highlevel] HIGHLEVEL_TOKEN / HIGHLEVEL_LOCATION_ID not set — cannot store submission",
    );
    return { status: "skipped", detail: "not configured" };
  }

  try {
    const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(" ");

    const up = await hlFetch(cfg, "/contacts/upsert", {
      method: "POST",
      body: JSON.stringify({
        locationId: cfg.locationId,
        name: fullName,
        firstName: lead.firstName,
        ...(lead.lastName ? { lastName: lead.lastName } : {}),
        email: lead.email,
        ...(lead.phone ? { phone: lead.phone } : {}),
        ...(lead.companyName ? { companyName: lead.companyName } : {}),
        ...(lead.website ? { website: lead.website } : {}),
        tags: lead.tags,
        source: lead.source,
      }),
    });

    const contact = (up.json.contact as Record<string, string>) ?? up.json;
    const contactId = contact?.id as string | undefined;

    // A "duplicate" response is success — GHL matched an existing contact.
    const isDuplicate = /duplicate/i.test(JSON.stringify(up.json));
    if (!up.ok && !isDuplicate) {
      console.error("[highlevel] upsert failed", up.status, up.json);
      return { status: "error", detail: `upsert ${up.status}` };
    }
    if (!contactId) {
      console.error("[highlevel] upsert returned no contact id", up.json);
      return { status: "error", detail: "no contact id" };
    }

    // Non-fatal: the contact existing is the thing that matters. Logged,
    // because a missing tag breaks segmentation silently — and the tag is what
    // tells an automation whether this was an enquiry or an application.
    if (lead.tags.length) {
      const tagRes = await hlFetch(cfg, `/contacts/${contactId}/tags`, {
        method: "POST",
        body: JSON.stringify({ tags: lead.tags }),
      });
      if (!tagRes.ok) {
        console.error("[highlevel] tag failed", tagRes.status, tagRes.json, {
          contactId,
          tags: lead.tags,
        });
      }
    }

    // Also non-fatal, and also logged. A lost note must never turn a saved
    // submission into a failed one — but the note is the part a human reads, so
    // losing it silently would be its own quiet failure.
    if (lead.note) {
      const noteRes = await hlFetch(cfg, `/contacts/${contactId}/notes`, {
        method: "POST",
        body: JSON.stringify({ body: lead.note }),
      });
      if (!noteRes.ok) {
        console.error("[highlevel] note failed", noteRes.status, noteRes.json, {
          contactId,
        });
      }
    }

    return { status: "ok", contactId };
  } catch (err) {
    console.error("[highlevel] push threw", err);
    return {
      status: "error",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}
