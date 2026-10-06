import { z } from "zod";
import { pushLeadToHighLevel } from "../../../lib/highlevel/client";
import { checkEmail } from "../../../lib/email";
import { SITE_URL } from "../../../lib/site-config";
import { CONTACT_TAGS, LIMITS, SMS_CONSENT_TEXT } from "../../../lib/contact";

/**
 * The Contact Cristina form → a contact in Cristina's GoHighLevel.
 *
 * Built on the template's reference route (api/subscribe) and CRM.md, in the
 * same order:
 *
 *   origin check → honeypot (200) → server-side validation → email
 *   deliverability → upsert + tags + note → loud fallback
 *
 * Tags: `via-website` (provenance) + `contact-enquiry` (outcome). A workflow
 * on `contact-enquiry` emails and texts Cristina. Everything she reads is in
 * one note, because a person reads every one of these (CRM.md § 3.6).
 *
 * ── WHY THIS ONE HAS A FALLBACK (the subscribe route does not) ───────────────
 * An enquiry is a customer she wanted, and GoHighLevel is the only storage. On
 * a failed or unconfigured write the full submission is logged under
 * [contact][LEAD-FALLBACK] AND posted to LEAD_ALERT_WEBHOOK_URL so a human is
 * told, and the visitor still gets the thank-you: their message IS recoverable,
 * and telling them it failed would be the wrong lie.
 *
 * Email: lib/email.ts (MX + did-you-mean), same as realiiz.com. The form can
 * re-send with `emailTypoConfirmed` after the visitor says "No, keep mine"; that
 * skips only the lookalike guess, never the MX check.
 */

export const runtime = "nodejs";

const digits = (v: string) => v.replace(/\D/g, "");

const schema = z.object({
  firstName: z.string().trim().min(1).max(LIMITS.firstName),
  lastName: z.string().trim().min(1).max(LIMITS.lastName),
  email: z.string().trim().min(3).max(LIMITS.email),
  // Same rule as realiiz.com's server: at least 7 digits once formatting is
  // stripped (the form itself asks for a full 10-digit US number).
  phone: z
    .string()
    .trim()
    .max(LIMITS.phone)
    .refine((v) => digits(v).length >= 7, "invalid phone number"),
  business: z.string().trim().min(1).max(LIMITS.business),
  website: z.string().trim().max(LIMITS.website).optional().default(""),
  socials: z.array(z.string().trim().min(1).max(LIMITS.social)).max(8).optional().default([]),
  message: z.string().trim().min(1).max(LIMITS.message),
  smsConsent: z.boolean(),
  // The live website check: they said "Yes, that's my site" / we found it live
  // but they didn't answer / we couldn't reach it / no check ran.
  websiteCheck: z.enum(["confirmed", "found", "not-reached", ""]).optional().default(""),
  emailTypoConfirmed: z.boolean().optional(),
  pageUrl: z.string().max(500).optional().default(""),
  submittedAt: z.string().max(50).optional().default(""),
});

function allowedOrigins(): string[] {
  const origins = [SITE_URL];
  try {
    const u = new URL(SITE_URL);
    origins.push(`${u.protocol}//www.${u.host}`);
  } catch {
    /* SITE_URL is a constant; ignore */
  }
  if (process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`);
  return origins;
}

/** Same-origin by the request's own Host (template rule, CRM.md § 3.1). */
function isAllowedOrigin(request: Request): boolean {
  const header = request.headers.get("origin") ?? request.headers.get("referer");
  if (!header) return false;
  let origin: URL;
  try {
    origin = new URL(header);
  } catch {
    return false;
  }
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (host && origin.host === host) return true;
  return allowedOrigins().includes(origin.origin);
}

/** Best-effort client IP for the A2P consent record. */
function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** "instagram.com/x" → "https://instagram.com/x"; anything URL-ish gets a scheme. */
function normalizeUrl(v: string): string {
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return /\.[a-z]{2,}/i.test(v) && !/\s/.test(v) ? `https://${v}` : v;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return Response.json({ ok: false, detail: "unauthorized" }, { status: 401 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, detail: "invalid json" }, { status: 400 });
  }

  // The trap: a "fax" field no human sees. 200 so the bot thinks it worked.
  if (typeof raw.fax === "string" && raw.fax.trim()) {
    return Response.json({ ok: true, stored: "discarded" });
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, detail: "invalid submission", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const b = parsed.data;
  const email = b.email.toLowerCase();

  // THEIR bad address is the one case we block on (a typo'd email is a lead
  // Cristina silently never reaches). Our own DNS trouble fails open.
  const check = await checkEmail(email, { typoConfirmed: b.emailTypoConfirmed ?? false });
  if (!check.ok) {
    return Response.json(
      check.reason === "likely-typo"
        ? { ok: false, error: "email", reason: check.reason, suggestion: check.suggestion }
        : { ok: false, error: "email", reason: check.reason },
      { status: 400 },
    );
  }

  const website = normalizeUrl(b.website);
  const tags = [CONTACT_TAGS.provenance, CONTACT_TAGS.outcome, b.smsConsent ? "sms-consent-yes" : "sms-consent-no"];
  const ip = clientIp(request);

  const note =
    `New enquiry from the website (Contact Cristina form)\n\n` +
    `What they're looking for:\n${b.message}\n\n` +
    `Name: ${b.firstName} ${b.lastName}\n` +
    `Business: ${b.business}\n` +
    `Email: ${email}\n` +
    `Phone: ${b.phone}\n` +
    `Website: ${website || "—"}${
      website
        ? {
            confirmed: " (they confirmed it's their site)",
            found: " (live; they didn't confirm)",
            "not-reached": " (we couldn't reach it, check the address)",
            "": "",
          }[b.websiteCheck]
        : ""
    }\n` +
    `Social media: ${b.socials.length ? "\n" + b.socials.map((x) => `  • ${x}`).join("\n") : "—"}\n\n` +
    `A2P SMS proof of consent:\n` +
    `Consent checkbox: ${b.smsConsent ? "CHECKED" : "NOT checked"} (unchecked by default; not required to submit)\n` +
    `Timestamp: ${b.submittedAt || new Date().toISOString()}\n` +
    `Page URL: ${b.pageUrl || "—"}\n` +
    `IP address: ${ip}\n` +
    `Consent language shown: "${SMS_CONSENT_TEXT}"`;

  const result = await pushLeadToHighLevel({
    firstName: b.firstName,
    lastName: b.lastName,
    email,
    phone: b.phone,
    companyName: b.business,
    website: website || undefined,
    tags,
    source: `${SITE_URL} contact form`,
    note,
  });

  if (result.status !== "ok") {
    // Loud fallback (CRM.md § Phase 4): the full submission in the log...
    const payload = { reason: `${result.status}: ${result.detail}`, tags, note, at: new Date().toISOString() };
    console.error("[contact][LEAD-FALLBACK]", JSON.stringify(payload));
    // ...and a human told, if the alert webhook is set.
    const alertUrl = process.env.LEAD_ALERT_WEBHOOK_URL;
    if (alertUrl) {
      try {
        await fetch(alertUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            source: "Contact Cristina form",
            name: `${b.firstName} ${b.lastName}`,
            firstName: b.firstName,
            lastName: b.lastName,
            email,
            phone: b.phone,
            business: b.business,
            website: b.website || "",
            socials: b.socials.join("\n"),
            message: b.message,
            smsConsent: b.smsConsent ? "yes" : "no",
            noteHtml: esc(note).replace(/\n/g, "<br>"),
          }),
          signal: AbortSignal.timeout(8000),
        });
      } catch (err) {
        console.error("[contact][LEAD-FALLBACK] alert webhook failed too", err);
      }
    } else {
      console.error("[contact][LEAD-FALLBACK] LEAD_ALERT_WEBHOOK_URL is not set — nobody has been told about this submission");
    }
  }

  return Response.json({ ok: true });
}
