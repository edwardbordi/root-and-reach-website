---
name: crm-verify
description: Prove a GoHighLevel form integration actually works — every path reaches the CRM with the right tags, bots are rejected, and a failed write is reported to a human. Use after crm-connect, after rotating a token, after changing a form, and before launch. Never declare a CRM integration working without running this.
---

# crm-verify

Prove the integration works against the real CRM. Not that it compiles — that it works.

**A build that compiles has not been tested.** The failures that matter here are all
silent: a form that returns 200 while dropping an answer, a tag that never lands, an alert
nobody receives. None of them show up in a type check.

Read `CRM.md` § "Phase 7" for the reasoning. This skill is the procedure.

---

## Before you start

Ask the builder for:

- **The base URL** to test — a local dev server, or the deployed preview URL.
- **The Vercel protection bypass secret**, when testing a preview (`CRM.md` Step 6). Vercel
  puts previews behind a login by default; without it, every request gets the login page.
  Pass it as `VERCEL_BYPASS=… bash scripts/crm-smoke.sh`.
- **A real inbox** they can check, for the alert test.

**You can't log in to GoHighLevel or Vercel.** Several checks below are therefore the
builder's to do, not yours: looking at the contacts that arrive, filling in the forms in a
browser, and changing the token on the preview. Tell them exactly what to do and when, and
wait for their answer. Never report a check as passed that only they could confirm and
haven't.

Agree a **test naming convention** and use it without exception: surname `ZZTest`, and
plus-addressed emails (`them+t1@example.com`). The surname sorts every test contact
together for deletion; the plus-address still reaches a real inbox, so anything that
auto-replies is visible rather than silently lost.

---

## 1 · The automated sweep

Run `scripts/crm-smoke.sh` — or write it, if this site does not have one yet. One
submission per path the forms can produce, plus the honeypot, reporting what the server did
with each.

Three things it must do, each learned the hard way:

- **Pace itself.** Two seconds between submissions. A dozen in two seconds is load no real
  visitor produces, and a timeout caused by manufactured load teaches nothing and wastes an
  afternoon.
- **Refuse the wrong site.** Check the response is JSON before judging it. Pointed at a
  domain still serving an old site, every case returns 200 with a page of HTML, and the
  script reports a screenful of ordinary-looking failures. A wrong address should say so in
  one line, not impersonate a bug.
- **Treat only "saved to CRM" as a pass.** "Logged instead" is a failure wearing a 200.

## 2 · Then look in GoHighLevel

The script proves the server answered. Only the CRM proves the contact exists.

For each test contact, confirm:

- ☐ It is there, once — not twice. A second contact for the same email means an upsert is
  not deduplicating.
- ☐ Every expected tag is present, provenance and outcome.
- ☐ **Count the answers in the note against the questions the form asked.** A missing line
  means the form and the server disagree about a field name, which is dropped silently with
  a 200. This check is the only thing that catches it.
- ☐ The honeypot contact does **not** exist. This is the one where success looks like
  nothing happening.

## 3 · Walk every path by hand in a browser

**The script proves the API, not the form.** It builds its payloads from the same
definitions the server validates against, so it cannot detect the two disagreeing. Only a
real submission through the real interface can.

- ☐ Every branch, including the ones that add fields rather than swapping them — those are
  where a name mismatch hides.
- ☐ A deliberate typo in an email domain is caught.
- ☐ Any consent checkbox is **unchecked by default** and the form submits without it.
- ☐ If one step hands details to another, confirm they arrive — and confirm they are gone
  after a refresh, if they are meant to be read once.

## 4 · The failure drill

The most important test, and the one most often skipped.

1. ☐ Break `HIGHLEVEL_TOKEN` — add two characters. Locally that's `.env.local`, then restart
   the dev server; on the preview the builder edits it in Vercel and redeploys.
2. ☐ Submit one form whose route posts to `LEAD_ALERT_WEBHOOK_URL`.
3. ☐ **The visitor still sees success**, for a route with a fallback. Their submission is
   recoverable, so telling them it failed would be the wrong lie. (The newsletter route
   has no fallback and correctly reports the failure instead.)
4. ☐ The server log holds the complete payload under its greppable prefix.
5. ☐ **Now the builder finishes the alert workflow** — `CRM.md` Step 7 walks them through
   it: fetch the sample request that just arrived, add **Send Internal Notification** to a
   **named user** (not "Assigned User" — this workflow has no contact, so that means
   nobody), put `noteHtml` in the body, publish. Then submit again.
6. ☐ **The alert email actually arrives in their inbox**, and the submission in it is
   readable — not one run-on paragraph. If it's run-on, `noteHtml` isn't mapped. If
   nothing arrives, check the recipient first, then fall back to Send Email with
   unsubscribe handling off (`CRM.md` § Phase 4.3).
7. ☐ Restore the token (restart / redeploy), submit again, confirm it saves.

> **The drill is only half done until you have seen it recover.** Plenty of outages get
> "fixed" with nobody confirming, and the next failure then looks identical to the last.

## 5 · Check the token cannot leak

```
grep -rl '"use client"' src | xargs grep -l "lib/highlevel"
```

Must print nothing. Anything it prints is a file that would publish the CRM token to every
visitor.

---

## What you cannot test, and must say so

Be explicit in your report rather than leaving a gap:

- **Payments**, if the CRM is connected to a live payment processor with no sandbox. Test
  card numbers are correctly rejected by a live connection. Say this is untested.
- **Anything on the production domain**, if DNS still points at an old site.

---

## Report

Give the builder a plain list: what passed, what failed, what could not be tested and why.
**Do not round up.** "Everything works except the alert email" is useful; "all good" when
the alert was never seen is how a lost submission becomes a lost client.

Finish by reminding them to **delete every test contact** — in the CRM a test contact
counts as a lead and may walk into a nurture sequence — and to remove any saved payment
details from them.
