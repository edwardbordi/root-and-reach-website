---
name: crm-connect
description: Connect this site's forms and surveys to GoHighLevel — footer signup, contact form, or a long branching application. Interviews the builder for the decisions that cannot be guessed, then wires the route, the tags and the failure alert. Use when a form needs to reach a CRM, or when someone says leads/contacts/newsletter/bookings should go to GoHighLevel.
---

# crm-connect

Wire a form on this site to GoHighLevel, properly, in one session.

**The code already exists and is tested.** `src/lib/highlevel/client.ts` and
`src/app/api/subscribe/route.ts` ship with the template. Your job is not to invent an
integration — it is to ask the handful of questions that cannot be guessed, then connect
what is already there.

**If those files are missing**, the person hasn't done `CRM.md` Step 1. Stop and ask them to
run `git template-update add crm` (after `UPDATING.md` Step 1 if the site isn't connected to
the template yet). Don't recreate the files from memory or copy them from another site.

**If the site already had its own `src/lib/highlevel/client.ts`** — `add crm` keeps it and
says so — don't replace it. Add the functions the template's routes import to the site's
file, following `CRM.md` § "Phase 2", and keep everything that file already does.

Read `CRM.md` at the repo root for the full reasoning behind each decision. This skill is
the doing; that document is the why.

---

## Before you start — check the human has done their part

Check `.env.local` has all three keys set — **check that they're present, never read the
values out, print them, or ask the person to paste them.** The token can read and change
every contact the client has, and a chat transcript is not a safe place for it.

1. **`HIGHLEVEL_TOKEN`** — `CRM.md` Step 2.
2. **`HIGHLEVEL_LOCATION_ID`** — `CRM.md` Step 2.
3. **`LEAD_ALERT_WEBHOOK_URL`** — `CRM.md` Step 3.

A safe way to check without revealing anything:

```
for k in HIGHLEVEL_TOKEN HIGHLEVEL_LOCATION_ID LEAD_ALERT_WEBHOOK_URL; do grep -q "^$k=." .env.local && echo "$k set" || echo "$k MISSING"; done
```

Also confirm `.env*` is gitignored. If any key is missing, stop and point them to the
`CRM.md` step that names it. You cannot obtain these; only they can.

---

## The interview

Ask these one at a time. Do not batch them, and do not guess an answer — every one of them
changes what you build, and a wrong guess is discovered weeks later by a client.

### 1. Which forms?

"Which forms on this site should reach GoHighLevel?" Expect one or more of: a footer
mailing-list signup, a contact form, a booking enquiry, a long application survey.

For each, establish **what it collects**. An email alone, or name and phone too? This
decides whether a welcome email can greet someone by name — a form that collects only an
email cannot, and `{{contact.first_name}}` will render "Hi ," for every single person.

### 2. What tag marks each one?

Two kinds, and you need both:

- **One provenance tag** every submission from this site carries — e.g. `applied-via-site`.
  Workflows trigger on tags, not on GoHighLevel's native `source` field, which is not
  dependable as a trigger.
- **One outcome tag per path** — `mailing-list`, `contact-enquiry`, or one per branch of a
  survey.

Say out loud: "Renaming a live tag later silently empties every list and automation built
on it." Get the names right now.

### 3. Does a human read every submission, or do automations fire off the answers?

This is the note-versus-custom-fields decision and it is the one people regret.

- **A human reads them** → put every answer in one readable note, in the order asked. Right
  for low volume and a real person replying.
- **Automations segment on answers** → custom fields in GoHighLevel, mapped from the form.

⚠️ Tell them plainly: **custom fields are additive but not retroactive.** Contacts created
before a field exists have it empty, so any segment built on it silently excludes everyone
who came earlier. If fields are likely later, decide *which answers* become fields now,
even if the build waits — it shrinks the backfill from "all of them" to "a few".

### 4. Where does a failed submission go?

**Do not let this one pass with a shrug.** GoHighLevel is usually the only storage this
site has. If a write fails and nobody is told, the submission is gone and the visitor was
told it worked.

`LEAD_ALERT_WEBHOOK_URL` should already be in `.env.local` — `CRM.md` Step 3 had them start
the alert workflow. Wire every route whose submissions matter to post its full payload
there on a failed write. The workflow can't be finished until a real request has arrived,
which happens during `crm-verify`'s failure drill (`CRM.md` Step 7) — say so, so they don't
think they've done it wrong.

Then ask the remaining decisions `CRM.md` § Phase 4 raises: does a GoHighLevel outage need
a second, non-GoHighLevel alert channel (4.4), and should the alert workflow only notify,
or also create the contact (4.5 — notify-only is the safe default).

### 5. Is SMS involved?

If the form collects a phone number and anyone will ever text it, the consent checkbox must
meet A2P 10DLC. You need the **registered legal entity name** — not the trading name — and
they may not have it. See `CRM.md` § "Phase 5" for the exact wording.

---

## Build it

Work through `CRM.md` phases 3 to 5. In short:

1. **Copy `src/app/api/subscribe/route.ts`** as the shape for any new route. Keep its
   order: origin check → honeypot (returns 200) → server-side validation → upsert → tags.
2. **Never import `src/lib/highlevel/client.ts` into a client component.** Forms `fetch`
   your own API route; the route talks to the CRM. The token must never reach a browser
   bundle — `CRM.md` § "Phase 2" explains what happens if it does.
3. **Never put contact details in a page URL.** This template reports `page_location` to
   GA4 on every view, so an email in the address bar is an email in Google Analytics. If
   one step must hand details to the next, use `sessionStorage`, read once, then delete it.
4. **Add the env vars to `.env.example`** with a comment saying what breaks without them.
5. **Wire the failure alert** — log the full payload under a greppable prefix AND post it
   to `LEAD_ALERT_WEBHOOK_URL`. Send a `noteHtml` field alongside any `note`: GoHighLevel
   renders email bodies as HTML and collapses newlines, so a long submission arrives as one
   unreadable paragraph otherwise.

## Then tell them what to do in GoHighLevel

You cannot build these. Write them a short list naming the exact triggers:

- A workflow per outcome tag, or one workflow with an If/Else on the outcome tag.
- ⚠️ **If the route writes tags in two calls, warn them about the race:** there is a window
  where the provenance tag has landed and the outcome tag has not, and an If/Else evaluated
  in that window sends the wrong email. Fix with a 2-minute Wait before the condition, or by
  triggering on the outcome tags themselves.
- ⚠️ **Tag Added also fires on manual adds and imports.** If they ever import a list and
  apply the tag, the welcome sequence goes to all of them at once.
- The alert workflow should **notify only**. If it also creates the contact it creates a
  partial one — no tags, no note — which will not trigger the normal workflows and looks
  identical to a healthy contact in the list.
- ⚠️ **In the alert's notification action, choose a specific person as the recipient**, not
  "Assigned User". An inbound-webhook workflow has no contact attached, so there is nobody
  assigned and the notification silently goes nowhere. Tell them the failure drill in
  `crm-verify` is what proves it arrives — until they've seen it in their inbox, assume it
  doesn't.

---

## Finish

1. Run `npx tsc --noEmit` and `npm run lint`.
2. Confirm the token cannot leak:
   ```
   grep -rl '"use client"' src | xargs grep -l "lib/highlevel"
   ```
   This must print nothing.
3. **Do not declare it working.** It is proven by `skills/crm-verify/SKILL.md` against the
   real CRM, in `CRM.md` Step 7. A build that compiles has not been tested.
4. Commit on the branch (`git template-update commit "…"`). **Do not open a pull request**
   — that waits until verification passes (`CRM.md` Step 8). Never commit to `main`.
5. Hand them the workflow list, and tell them their next steps are `CRM.md` Steps 5 and 6:
   build and **publish** the workflows, set the variables in Vercel, push the branch for a
   preview.
