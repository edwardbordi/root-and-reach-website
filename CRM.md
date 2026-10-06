# Connecting your forms to GoHighLevel

Your site can send what people type into it — a newsletter signup, a contact form, a long
application — straight into the client's GoHighLevel as a tagged contact. **The code is
already written and tested.** Setting it up is a handful of decisions, some clicks in
GoHighLevel and Vercel, and one Claude Code session.

> **Always follow the newest copy of this guide.** After Step 1, read it any time with
> `git show template/main:CRM.md`.

---

## Who does what

**Claude Code writes and tests the code.** You do everything that needs a login it doesn't
have, and you make the decisions only you can make.

| Step | Who |
|---|---|
| 1 · Add the integration files to the site | **You** — 5 minutes |
| 2 · Get the token and Location ID from GoHighLevel | **You** — 5 minutes |
| 3 · Start the failure-alert workflow in GoHighLevel | **You** — 5 minutes |
| 4 · Wire up the forms | **Claude Code**, asking you questions |
| 5 · Build the workflows and emails | **You**, from its list |
| 6 · Put it on a preview site | **You**, in Vercel |
| 7 · Prove it works | **Claude Code and you** together |
| 8 · Publish and clean up | **You** |

Read the steps below. Everything after **"For Claude Code"** is its working reference —
you don't need it.

---

## Before you start

- **GitHub access.** You have read access to `github.com/realiiz-labs/site-starter-pro`,
  and git on your computer is signed in as that same GitHub account. If you've never signed
  git in, install the [GitHub CLI](https://cli.github.com) and run `gh auth login`.
- **A clean, up-to-date site.** In the site's folder, `git checkout main` and `git pull`,
  then `git status` must say `nothing to commit, working tree clean`. Commit any work first.
- **Claude Code** installed, and Node 22 or newer (`node -v`).

**Collect these answers before Step 4** — Claude Code will ask, and some come from the
client:

- Which forms should reach GoHighLevel (footer signup, contact form, an application…), and
  what each one collects.
- What to call the tags. Pick carefully: **renaming a tag later empties every list and
  automation built on it.**
- Does a person read every submission, or will automations act on the answers?
- Will anyone ever text these contacts? If so, you need the client's **registered legal
  business name** — the one on their EIN, not the trading name. SMS consent wording must
  name it.
- Should test submissions from preview sites go into the client's real GoHighLevel, or a
  separate sub-account?

---

## Step 1 · Add the integration files · **YOU**

In a terminal, in the site's folder, paste this whole block. It connects the site to the
template and sets up the `git template-update` command:

```
cd "$(git rev-parse --show-toplevel)"
git remote add template https://github.com/realiiz-labs/site-starter-pro.git 2>/dev/null
git fetch --no-tags template main && git show template/main:scripts/template-update.sh > .git/template-update.sh && git config alias.template-update '!bash "$(git rev-parse --git-dir)/template-update.sh"' && git template-update status
```

**Ignore whatever it says about releases** — updating the whole site is a separate job
(`UPDATING.md`), and you don't need it for this. If it fails, its message says why: usually
GitHub access, from "Before you start".

Then add the integration:

```
git template-update add crm
```

It puts everything on a new branch, `chore/add-crm`, so the live site isn't touched. Code
files your site already has are **never replaced** — it lists them instead. (This guide and
Claude Code's instructions are always refreshed to the newest.)

```
npm run build
git template-update commit "Add the GoHighLevel integration files"
```

> **If the build fails**, commit anyway and give Claude Code the error at the start of
> Step 4. That's expected in particular when `add crm` warned that your site has its own
> `src/lib/highlevel/client.ts` — Claude Code has to fit the integration around it.

---

## Step 2 · Get two values from GoHighLevel · **YOU**

In the client's **sub-account** — not your agency account:

1. **Settings → Private Integrations → Create new integration.** Name it after the website.
   Give it permission to **view and edit contacts** — and to **add notes** if offered.
   **Copy the token straight away.** GoHighLevel shows it once; if you lose it, create
   another.
2. **The Location ID.** It's in the sub-account's settings (Business Profile), and also in
   the browser's address bar while you're in the sub-account — the part after `/location/`.

> **No "Private Integrations" in Settings?** It has to be enabled for the sub-account from
> your agency account.

Put both in a file called `.env.local` in the site's top folder (create it if needed):

```
HIGHLEVEL_TOKEN=paste-the-token-here
HIGHLEVEL_LOCATION_ID=paste-the-location-id-here
```

> That token can read and change every contact the client has. **Never paste it into Claude
> Code, a chat, an email, a ticket or a commit.** `.env.local` is already kept out of git,
> and Claude Code doesn't need to see the value — only that it's there.

---

## Step 3 · Start the failure-alert workflow · **YOU**

If a submission ever fails to save, the site sends it to this workflow, which emails it to
you — otherwise that lead is gone and the visitor was told it worked.

1. In the sub-account: **Automation → Workflows → Create Workflow → Start from scratch.**
   Name it **"ALERT · Website submission failed to save"**.
2. Add the trigger **Inbound Webhook**. Copy the webhook URL it shows.
   *(It's a premium trigger. If it's locked, premium triggers need enabling for the account.)*
3. **Save, but don't finish it yet.** GoHighLevel can't show you the fields to use until a
   real test arrives, which happens in Step 7.

Add the URL to `.env.local`:

```
LEAD_ALERT_WEBHOOK_URL=paste-the-webhook-url-here
```

---

## Step 4 · Wire up the forms · **CLAUDE CODE, WITH YOU**

Open Claude Code in the site's folder and give it this:

```
Read skills/crm-connect/SKILL.md and CRM.md, then connect this site's
forms to GoHighLevel. .env.local already has the token, location ID and
alert webhook URL — don't ask me for their values. Interview me for
anything you can't work out from the code.
```

Answer its questions from the list you collected. When it's done, it gives you a list of
workflows to build. **Don't let it open a pull request yet** — that waits until Step 7
passes.

---

## Step 5 · Build the workflows · **YOU**

Build everything on Claude Code's list. It names each trigger exactly.

- **Publish every workflow.** New workflows start as Drafts, and a Draft never runs.
- **Every calendar must be listed on every booking workflow.** One left off takes bookings
  that reach nobody, and nothing says so.
- **"Tag Added" also fires when you import contacts or add a tag by hand.** Import a list
  with the tag on, and the welcome email goes to all of them at once.

The alert workflow from Step 3 stays unfinished until Step 7.

---

## Step 6 · Put it on a preview site · **YOU**

1. **In Vercel**, open the project → **Settings → Environment Variables**. Add
   `HIGHLEVEL_TOKEN`, `HIGHLEVEL_LOCATION_ID` and `LEAD_ALERT_WEBHOOK_URL`, with the same
   values as `.env.local`. Tick **both Production and Preview** — Vercel doesn't copy one to
   the other.
2. **Push the branch.** In the site's folder:
   ```
   git push -u origin HEAD
   ```
   Vercel builds a preview of it. When it's ready, copy its address from the project's
   **Deployments** page.
3. **Let the test past Vercel's login.** Previews are behind a Vercel login by default, so
   an automated test only sees the login page. In **Settings → Deployment Protection**,
   create a **Protection Bypass for Automation** secret, and copy it.

> Adding variables doesn't change a deployment that already exists. The push in 2 builds a
> fresh preview that has them. If you ever add or change a variable later, redeploy.

---

## Step 7 · Prove it works · **CLAUDE CODE AND YOU**

Give Claude Code:

```
Read skills/crm-verify/SKILL.md and run the full check, locally and
against the preview at <preview address>. The Vercel protection bypass
secret is <secret>. Tell me each thing you need me to do.
```

It submits a test of every form path and reports what the site did. **Some of the checking
is yours**, because it can't log in to GoHighLevel or Vercel:

- **Open each `ZZTest` contact in GoHighLevel.** One copy each, the right tags, and every
  answer in the note.
- **Fill in each form yourself, in a browser,** on the preview, down every branch.
- **The failure drill.** When it asks, break the token — locally, add two characters to
  `HIGHLEVEL_TOKEN` in `.env.local`; on the preview, edit it in Vercel and redeploy. It
  sends a test, and the visitor should still see success. Then **finish the alert
  workflow from Step 3**:
  1. Open it, click the trigger, and fetch the sample request that just arrived.
  2. Add the action **Send Internal Notification** → email. Choose **yourself, by name**, as
     the recipient — not "Assigned User". This workflow has no contact attached, so
     "Assigned User" means nobody and the email silently never sends.
  3. Put the field **`noteHtml`** in the email body — it's the submission with its line
     breaks kept. Publish.
  4. Have Claude Code send the test again, and **check your inbox.**
- **Put the token back** and redeploy, and have it confirm submissions save again.

**Until you've seen that alert email arrive, assume you have no alert.** If Internal
Notification won't send, use **Send Email** instead, with unsubscribe handling turned off.
A normal marketing email adds an unsubscribe link, and one stray click silences the alarm
for good. Also know its one limit: if GoHighLevel itself is down, this alert is down with
it.

**Don't treat the integration as working until the report says it is.**

---

## Step 8 · Publish and clean up · **YOU**

1. Open the pull request from the branch on GitHub and merge it. Vercel deploys it to the
   live site.
2. Ask Claude Code to run the smoke test once more against the **live** address.
3. **Delete every `ZZTest` contact** from GoHighLevel. A test contact left in the CRM counts
   as a lead and may receive your nurture emails.

---

## If something looks wrong

Tell Claude Code what you see, not what you think the cause is — "the welcome email says
'Hi ,'", "nothing arrived in GoHighLevel", "two contacts for the same person". Each of
those has a known cause in the reference below, and it will find it.

---

# For Claude Code

Everything below is the working reference for the agent doing Steps 3 and 6. A person
setting up the integration doesn't need it.

## The principle this all rests on

**GoHighLevel is usually the only storage.** There is no database behind it. So every
decision below is really about one question: *if this write fails, does anyone find out?*

A form that silently loses a submission is worse than a form that visibly breaks, because
the visitor is told it worked and goes away satisfied. Build so that failure is loud.

---

## Phase 1 — Credentials

The person does these (Steps 2, 3 and 6). Confirm they're present — never ask for the
values or print them. You can't do any of these yourself.

**1.1** `HIGHLEVEL_TOKEN` (a sub-account Private Integration token, contacts read + write)
and `HIGHLEVEL_LOCATION_ID` are in `.env.local`, and `.env*` is gitignored.

**1.2** On Vercel they're set for **Preview and Production separately** — Vercel doesn't
inherit between them, and a missing variable in Preview means every PR deploy silently runs
in log-only mode.

> ⚠️ **Adding variables doesn't restart the running deployment.** Without a redeploy the
> environment stays empty, every submission comes back `log-only`, and it looks like a bad
> token. If verification shows `log-only` on the deployed site, ask whether they redeployed
> before anything else.

**1.3** Ask whether Preview should point at the same GHL location as Production. Same
location is simpler, and test contacts land in the client's real CRM — fine with strict
naming, messy if the client is watching their contact list. A separate sub-account is
cleaner, and one more account to maintain. Record the answer.

---

## Phase 2 — The rules the code already follows

These are constraints on everything you write in the phases that follow. Breaking any of
them produces code that compiles, passes review, and is wrong. The first one publishes the
client's CRM credentials to the public internet.

`src/lib/highlevel/client.ts` is the file that talks to GoHighLevel. It ships with the
template, it's already correct, and it shouldn't need changing.

> **If the site already had its own `client.ts` at that path** (`git template-update add
> crm` warns about this), don't replace it. Add the functions the template's routes need —
> `subscribeToMailingList`, `pushLeadToHighLevel` — to the site's file, following the rules
> below, and keep everything the site's file already does.

### The one rule: this file stays on the server

Your site runs in two places. Some code runs on **your server**, which nobody can see
inside. Other code is sent to the **visitor's browser**, where anyone can read it — right
click, View Source, and it is all there.

This file holds your GoHighLevel token: the password that can read and write every contact
in the client's CRM. It must only ever run on the server.

**So: only API routes may use this file.** A form in the browser never talks to
GoHighLevel directly. It sends what the visitor typed to your own API route, and the route
— on the server — talks to the CRM. The token never leaves your server.

> ⚠️ If this file were ever pulled into code that runs in the browser, the token would be
> printed inside the JavaScript your site sends to every visitor. Anyone could copy it and
> take the client's entire contact list. If that happens the token must be replaced
> immediately, and everything using it stops working until it is.
>
> To check you are safe, run this in the project folder:
>
> ```
> grep -rl '"use client"' src | xargs grep -l "lib/highlevel"
> ```
>
> It should print nothing. Anything it prints is a file that needs fixing.

### Five things it does deliberately

**It only looks for the token when a form is actually submitted** — not when the site is
built. Otherwise the site cannot be built at all on any machine that does not have the
password, which includes the automated checks and a fresh copy of the code.

**It reports problems instead of crashing.** It answers "saved", "skipped" or "failed", and
lets the form decide what to tell the visitor. A crash would throw away what they typed.

**It gives up after 10 seconds.** If GoHighLevel is slow, the attempt is abandoned rather
than left hanging. This matters more than it sounds: hosting kills anything that runs too
long, and if that happens the site never gets the chance to record the lost submission.

> ⚠️ **Don't lower it to 5.** GoHighLevel can be merely slow under load rather than down,
> and a submission that would have saved fine then lands on the manual-recovery pile for
> nothing.

**It saves the contact, then applies the tags in a second step.** GoHighLevel does not
reliably add tags to a contact that already exists. Without that second step, the people
most likely to come back — the ones already in the CRM — are the ones least likely to be
tagged, so they fall out of every list and automation.

**A "duplicate" answer means success.** It means GoHighLevel recognized the email and
updated the person already there instead of creating a second copy of them. That is what
you want.

---

## Phase 3 — The route

`src/app/api/subscribe/route.ts` ships with the template and is the reference. It handles a
single-field form end to end. For a branching survey, keep its shape — origin check,
honeypot, server-side validation, upsert, tags — and replace the payload. Its header
comment explains what changes for a form whose submissions matter more than a newsletter
signup.

**3.1 Origin check.** Compare the request's own `Host` to the `Origin`/`Referer`. That is
the most direct measure of same-origin and it holds everywhere the site runs — dev server,
preview deploy, production — without a `NODE_ENV` special case that makes the rule
different in the environment where it gets tested.

**3.2 Honeypot.** A field a human never sees. **Return 200** so the bot believes it worked
and does not come back with a different shape.

> A one-field form in a footer, on every page, is the most-scraped shape on the web. Skip
> this and the client's list fills with rubbish they then have to clean before mailing it.

**3.3 Validate on the server, never trust the client's object.** For a survey, rebuild the
answers from the step definitions: anything that is not a declared field of a step this
branch actually produces gets dropped.

> ⚠️ **Decide what happens to an unrecognized value.** If the rebuild simply drops a select
> answer that isn't one of its own options, the submission saves with an answer missing and
> still returns 200 — so **a 200 doesn't prove every answer arrived.** Reject unknown values
> the way missing required fields are rejected, or accept it knowingly and test by counting.

**3.4 Check the email is deliverable.** Catch typo'd domains before they become hard
bounces that age the sending domain. On a long survey, offer an override — the person is
fifteen questions in and a lookalike test is a guess. On a footer field, do not; there is
no room for that conversation.

**3.5 Decide the tag taxonomy BEFORE writing any code.**

- One **provenance** tag every submission carries (`applied-via-site`). Workflows trigger
  on tags, not on the native `source` field, which is not dependable as a trigger.
- One **outcome** tag per branch (`mailing-list`, `contact-enquiry`, `quote-requested`) —
  one per thing the person actually asked for, not one per form.
- Renaming a live tag silently empties every segment and workflow built on it. Don't,
  without migrating the contacts already carrying it.

**3.6 Decide note vs custom fields.** A note is prose a human reads — right when someone
reads every submission. It is useless for automation: you cannot segment on "unsure about
money" when it is inside note text.

> ⚠️ **Custom fields are additive but NOT retroactive.** Contacts created before the fields
> exist have them empty, so any workflow built on one silently excludes every earlier
> submission. If fields are likely later, decide WHICH answers become fields now, even if
> the build waits — it shrinks the backfill.

---

## Phase 4 — Make failure visible

**This is the step everyone skips and it is the most important one.**

**4.1** On a failed CRM write, log the complete payload under a greppable prefix:
`[form][LEAD-FALLBACK]`. Enough to recreate the contact by hand.

**4.2 Then tell a human.** A log is not a notification.

> ⚠️ In production the log goes to Vercel runtime logs: short retention, no alert, and you
> have to already know to look. Nobody opens Vercel on a Tuesday. A submission lost at 2am
> is found in a month, if ever.

Add `LEAD_ALERT_WEBHOOK_URL` — a GHL inbound webhook whose workflow emails the client and
the agency the whole payload. If it is unset, say so in the log, in those words.

**4.3 Two things to get right about that alert:**

- **It must not be a marketing email.** GHL's *Send Email* action attaches an unsubscribe
  link; one stray click and the alarm is silent forever, with no indication. Use **Send
  Internal Notification**. (Known issue: internal notifications are largely contact-scoped,
  and an inbound-webhook workflow has no contact attached — so this may not fire. Test it.
  If it will not work, Send Email must at least be exempt from unsubscribe handling.)
- **Newlines collapse.** GHL renders the body as HTML, so a note's `\n` vanish and a
  13-answer submission arrives as one run-on paragraph. Send a second pre-formatted field
  (`noteHtml`, same text with `<br>`) and map that instead.

**4.4 The weakness you cannot engineer away:** this alert travels through GHL to report
that GHL failed. Inbound webhooks and the public API are separate subsystems, so it covers
a bad token, a revoked scope or a slow call — but a total outage takes the alarm down with
the thing it is watching. If that matters, the second channel must not be GHL. Record the
decision either way.

**4.5 Decide what the alert workflow DOES.** Notifying only is cleanest. If it also creates
the contact, it creates a PARTIAL one — no tags, no note — which will not trigger the
normal workflows and looks identical to a healthy contact in the list. If you do that, the
notification must say loudly that this one needs manual attention.

---

## Phase 5 — Consent and privacy

**5.1 SMS consent must meet A2P 10DLC.** Carriers check mechanically for: the business
**named**, the **message types**, the **frequency**, **HELP** alongside **STOP**, and
privacy + terms reachable from the point of consent.

> Template: *"I agree to receive appointment confirmations, reminders, and related text
> messages from [BRAND] — a [LEGAL ENTITY] brand — at the phone number provided. Message
> frequency varies. Message & data rates may apply. Reply STOP to opt out or HELP for help.
> Privacy Policy: [url] · Terms: [url]"*

A campaign missing any element can be rejected or the number filtered, and **that failure
is silent** — messages simply stop arriving. You will hear about it from a customer.

The consent text on the site and in every GHL form must be **identical**. A stored consent
record that does not match what the person saw is not proof of consent.

**5.2 Unchecked by default, and never required to submit.** Consent that is a condition of
service is not consent. Nor is a pre-ticked box.

**5.3 Email consent is lighter but not nothing.** One line: what arrives, roughly how
often, and that they can unsubscribe.

**5.4 NEVER put contact details in a page URL.** If you prefill a booking widget from a
previous step, carry the values in `sessionStorage`, not query parameters.

> ⚠️ These templates report `page_location: window.location.href` to GA4 on every page
> view. An email in the address bar is an email in Google Analytics — PII in analytics,
> against GA4's terms. URLs also persist in browser history on shared machines and ride
> along in referrers.
>
> Read the stored values ONCE and delete them. A family computer is the normal case, and
> leaving someone's details for the next person to find is a small avoidable leak.

**5.5 Prefill is worth doing anyway** — not for convenience but for data integrity. A
retyped email with a typo at a booking step creates a SECOND contact with the booking on it
and the original submission orphaned on the first.

---

## Phase 6 — Workflows in GHL

**6.1 Trigger on tags, not on the native source field.**

**6.2 One workflow with an If/Else beats two workflows** when several outcomes share an
entry point — the notification, sender and signature are defined once and cannot drift.

**6.3 ⚠️ MIND THE RACE.** If the route writes tags in two calls, there is a window where
the provenance tag has landed and the outcome tag has not. An If/Else evaluated in that
window takes the wrong branch and the person gets the wrong email. Either:

- add a **2-minute Wait** before the condition, or
- **trigger on the outcome tags themselves** (several triggers, one workflow), so the tag
  that fired it is the tag being tested. Better engineering; slightly more setup.

**6.4 Put a notification on the final Else.** If nothing should ever reach it, anything
that does means a submission nobody is answering.

**6.5 ⚠️ Tag Added fires on manual adds and imports.** Import a list and apply the tag, and
a welcome sequence goes to all of them at once. If that would be bad, trigger on *Contact
Created* with a tag condition.

**6.6 ⚠️ EVERY CALENDAR MUST BE LISTED ON EVERY BOOKING WORKFLOW.** One left off takes
bookings that reach nobody, and nothing anywhere says so.

---

## Phase 7 — Test

**7.1 Write a smoke script.** `scripts/crm-smoke.sh` ships with the template; add one case
per branch your form produces. One submission per branch plus the
honeypot, reporting what the server did with each. It runs in a minute and is the thing to
re-run after any token rotation or any change to the form definitions.

- **Pace it.** Two seconds between submissions. Eight in two seconds is load no real user
  produces, and a timeout under manufactured load teaches nothing.
- **Make it refuse the wrong site.** Check the response is JSON. A domain still pointing at
  the client's old site answers 200 with a page of HTML for every case, which reads like a
  broken integration. A wrong address should say so in one line.
- **Pin the site's dev port** (`next dev -p 3001` in `package.json`) if several sites live on
  one machine. Otherwise whichever started first gets port 3000, and the smoke test can run
  against a different site entirely.

**7.2 The script proves the API, not the form.** It builds payloads from the step
definitions; only a real walk-through proves the COMPONENT and the SERVER agree about every
field name — and a disagreement is silent. Walk every branch by hand.

**7.3 Count the answers** in the resulting note against the questions you answered.

**7.4 Drill the failure path.** Break the token, submit, confirm: the user still sees
success, the fallback log has the complete payload, the alert arrives. **Then restore it
and confirm recovery** — the drill is only half done until you have seen it come back.

**7.5 Test on the deployed URL too**, not just localhost. Different environment, different
variables, HTTPS, and it is the path a real person takes.

**7.6 Name every test contact identically** — `ZZTest <Scenario>` — and use plus-addressing
(`you+t1@example.com`) so anything that auto-replies reaches a real inbox. **Delete them
afterwards.** A test contact left in place counts as a lead and may enter a nurture
sequence.

---

## The checklist

```
☐ Private Integration token + Location ID, sub-account level
☐ Both in .env.local; .env* gitignored
☐ Both in Vercel — Preview AND Production — then REDEPLOY
☐ Server-only client: lazy config, returns not throws, ~10s timeout
☐ Route: origin check, honeypot (200), server-side validation
☐ Tag taxonomy decided and written down
☐ Note vs custom fields decided
☐ Fallback log with the full payload
☐ LEAD_ALERT_WEBHOOK_URL → internal notification, not marketing email
☐ noteHtml sent alongside note
☐ A2P consent text identical on site and in GHL forms, unchecked by default
☐ No PII in page URLs — sessionStorage, read once, deleted
☐ Workflows trigger on tags; race closed by Wait or outcome triggers
☐ Every calendar on every booking workflow
☐ Smoke script: paced, wrong-site guard, every branch, honeypot
☐ Every branch walked by hand in a browser
☐ Failure drill run AND recovery confirmed
☐ Test contacts deleted
```
