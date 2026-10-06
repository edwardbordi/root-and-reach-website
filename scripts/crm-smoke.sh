#!/bin/bash
# Submit to every CRM endpoint this site has and report what the server says it
# did with each. This is how a GoHighLevel integration is verified — before
# launch, after a token rotation, and after any change to a form or to
# src/lib/highlevel/client.ts.
#
#   bash scripts/crm-smoke.sh                           # against localhost
#   BASE=https://your-site.vercel.app bash scripts/crm-smoke.sh
#
#   Testing a Vercel PREVIEW? Previews are behind a Vercel login by default, and
#   this script would get the login page instead of the site. Create a bypass
#   secret (Vercel → Settings → Deployment Protection → Protection Bypass for
#   Automation) and pass it:
#
#   BASE=https://… VERCEL_BYPASS=<secret> bash scripts/crm-smoke.sh
#
# Out of the box it covers /api/subscribe, the one CRM route the template ships.
# ADD A CASE PER PATH YOUR OWN FORMS PRODUCE — see "Extending this" at the
# bottom. A one-route pass does not mean the site is tested.
#
# ── PIN THIS SITE'S DEV PORT ─────────────────────────────────────────────────
# Set `next dev -p <something>` in package.json and change BASE below to match.
# Several sites on one machine all asking for 3000 means whichever starts first
# wins and the rest land wherever Next can find a socket. A smoke test has been
# run against an entirely different client's site this way, and the 404 page was
# the only clue. Give every site its own port and the address is never a
# question.
#
# ── WHAT "PASS" LOOKS LIKE ───────────────────────────────────────────────────
#   ok=true             the contact reached GoHighLevel. The only pass.
#   ok=false, 502       the route worked, the CRM write did NOT. Read the server
#                       log: "[subscribe] signup not stored" names the reason.
#                       Usually a bad, expired or unscoped token, or env vars
#                       added to the host without a redeploy.
#   ok=false, 400       the payload was rejected before the CRM. Expected for
#                       the deliberately-bad cases below; anywhere else it is a
#                       bug in THIS script or a change to the form.
#   401 unauthorized    the Origin header did not match the host. Set BASE to
#                       the exact origin you are hitting, scheme included.
#
# ── THE TEST CONTACTS ────────────────────────────────────────────────────────
# Plus-addressed, so every one still reaches a real inbox and anything that
# auto-replies is visible rather than silently lost. Set TEST_EMAIL to an
# address you can actually read.
#
# DELETE THEM FROM GOHIGHLEVEL when the run is reviewed. A test contact left in
# place is counted as a lead and may walk into a nurture sequence.
set -uo pipefail
cd "$(dirname "$0")/.."

BASE="${BASE:-http://localhost:3001}"
TEST_EMAIL="${TEST_EMAIL:-you@example.com}"
PASS=0; FAIL=0

# Sent on every request when VERCEL_BYPASS is set. The ${X[@]+...} form keeps an
# EMPTY array safe under `set -u` in bash 3.2, which is what macOS ships.
BYPASS=()
[ -n "${VERCEL_BYPASS:-}" ] && BYPASS=(-H "x-vercel-protection-bypass: $VERCEL_BYPASS")

say () { printf '\n\033[1m%s\033[0m\n' "$1"; }

# Seconds between submissions. NOT politeness — accuracy.
#
# A full run of eight submissions in about two seconds, each making up to three
# sequential GoHighLevel calls, produced a timeout. GoHighLevel was not down; it
# was slow under a burst that no real visitor produces, and the red line taught
# us nothing about the integration. A test that manufactures load it is not
# trying to measure reports faults that do not exist.
#
# Set PACE=0 to run flat out — right if you ever ARE testing behavior under
# load, wrong for a correctness check.
PACE="${PACE:-2}"

# plus-address helper: you@example.com + "s1" → you+s1@example.com
tagged () { printf '%s' "$TEST_EMAIL" | sed "s/@/+$1@/"; }

# $1 label   $2 path   $3 json   $4 expected: "ok" | "reject"
post () {
  local label="$1" path="$2" body="$3" want="$4" out code ok
  [ "$PACE" != "0" ] && sleep "$PACE"
  out=$(curl -s ${BYPASS[@]+"${BYPASS[@]}"} -w '\n%{http_code}' -X POST "$BASE$path" \
        -H 'Content-Type: application/json' -H "Origin: $BASE" -d "$body")
  code=$(printf '%s' "$out" | tail -1)
  out=$(printf '%s' "$out" | sed '$d')

  # ── IS THIS EVEN OUR APP? ───────────────────────────────────────────────
  # These routes always answer JSON — including their refusals. Anything else
  # means the request never reached the route, and the likeliest reason is that
  # BASE points somewhere else entirely.
  #
  # This has cost real time: a production run aimed at a domain still serving
  # the client's OLD site came back 200 on every case with a page of HTML, the
  # script reported a screenful of ordinary-looking failures, and the obvious
  # reading was "the CRM integration is broken in production". It was not. A
  # wrong address should say so in one line, not impersonate a bug.
  case "$out" in
    '{'*) ;;
    *)
      printf '\n  \033[31m✗\033[0m %s\n' "$label"
      printf '     \033[1mThat is not this site.\033[0m %s%s answered http=%s with\n' "$BASE" "$path" "$code"
      printf '     something other than JSON — almost certainly a different server.\n\n'
      printf '     First 120 characters of what came back:\n       %.120s\n\n' "$out"
      printf '     Check BASE. The live domain may still point at the old site;\n'
      printf '     the deployment is at its hosting address until DNS moves.\n'
      printf '     A Vercel PREVIEW answering with a login page needs VERCEL_BYPASS\n'
      printf '     (see the top of this script).\n'
      exit 2 ;;
  esac

  ok=$(printf '%s' "$out" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("ok"))' 2>/dev/null || echo "?")

  if [ "$want" = "ok" ]; then
    if [ "$code" = "200" ] && [ "$ok" = "True" ]; then
      printf '  \033[32m✓\033[0m %-30s saved\n' "$label"; PASS=$((PASS+1)); return
    fi
  else
    # A rejection is a PASS for the deliberately-bad cases: the point is that
    # junk is stopped before it reaches the client's contact list.
    if [ "$ok" = "False" ]; then
      printf '  \033[32m✓\033[0m %-30s rejected: %s\n' "$label" "$out"; PASS=$((PASS+1)); return
    fi
  fi
  printf '  \033[31m✗\033[0m %-30s http=%s %s\n' "$label" "$code" "$out"; FAIL=$((FAIL+1))
}

say "CRM smoke test → $BASE"

# ── /api/contact (the Contact Cristina form) ────────────────────────────────

# contact <email> [extra json fields] → a full valid payload
contact () {
  printf '{"firstName":"ZZTest","lastName":"%s","email":"%s","phone":"(555) 555-0123","business":"ZZTest Bakery","website":"zztest.example","socials":["@zztest","facebook.com/zztest"],"message":"Smoke test, please delete.","smsConsent":%s%s}' \
    "$1" "$2" "$3" "${4:-}"
}

# 1 ── The real thing, consent unticked. MUST reach the CRM with via-website +
#      contact-enquiry + sms-consent-no, and the note.
post "contact · valid" /api/contact "$(contact Valid "$(tagged c1)" false)" ok

# 2 ── Consent ticked: same, but sms-consent-yes and "CHECKED" in the note.
post "contact · valid + sms" /api/contact "$(contact Sms "$(tagged c2)" true)" ok

# 3 ── A typo'd common domain. Rejected with a "did you mean" suggestion.
post "contact · typo domain" /api/contact "$(contact Typo someone@gmial.com false)" reject

# 4 ── A domain with no MX records. Rejected.
post "contact · dead domain" /api/contact \
  "$(contact Dead someone@this-domain-does-not-exist-9z8y7x.com false)" reject

# 5 ── A required field missing (no message). Rejected.
post "contact · missing field" /api/contact \
  '{"firstName":"ZZTest","lastName":"Missing","email":"a@example.com","phone":"5555550123","business":"x","smsConsent":false}' reject

# 6 ── The honeypot. MUST return stored=discarded and MUST NOT reach the CRM.
[ "$PACE" != "0" ] && sleep "$PACE"
hp=$(curl -s ${BYPASS[@]+"${BYPASS[@]}"} -X POST "$BASE/api/contact" \
     -H 'Content-Type: application/json' -H "Origin: $BASE" \
     -d "$(contact Honeypot "$(tagged c6)" false ',"fax":"spam"')")
if printf '%s' "$hp" | grep -q '"stored":"discarded"'; then
  printf '  \033[32m✓\033[0m %-30s discarded (not sent to CRM)\n' "contact · honeypot"
  PASS=$((PASS+1))
else
  printf '  \033[31m✗\033[0m %-30s %s\n' "contact · honeypot" "$hp"; FAIL=$((FAIL+1))
fi

# 7 ── Cross-origin gets 401.
[ "$PACE" != "0" ] && sleep "$PACE"
xo=$(curl -s ${BYPASS[@]+"${BYPASS[@]}"} -o /dev/null -w '%{http_code}' -X POST "$BASE/api/contact" \
     -H 'Content-Type: application/json' -H 'Origin: https://evil.example' \
     -d "$(contact Foreign "$(tagged c7)" false)")
if [ "$xo" = "401" ]; then
  printf '  \033[32m✓\033[0m %-30s 401\n' "contact · foreign origin"; PASS=$((PASS+1))
else
  printf '  \033[31m✗\033[0m %-30s expected 401, got %s\n' "contact · foreign origin" "$xo"
  FAIL=$((FAIL+1))
fi

say "$PASS passed, $FAIL failed"

cat <<EXPECT

Now go and look in GoHighLevel. Expected:

  $(tagged c1)   ONE contact "ZZTest Valid": via-website, contact-enquiry, sms-consent-no, note
  $(tagged c2)   ONE contact "ZZTest Sms": same but sms-consent-yes, note says CHECKED
  $(tagged c6)   MUST NOT EXIST  (the honeypot)
  $(tagged c7)   MUST NOT EXIST  (foreign origin)

  NOTE: with HIGHLEVEL_TOKEN unset, cases 1-2 still answer ok (the form never
  turns a visitor away) but nothing reaches GoHighLevel — look for
  [contact][LEAD-FALLBACK] in the server log. Saved means seen in GHL.

Check it is there ONCE, not twice. A second contact for the same address means
the upsert is not deduplicating.

A green run proves the API answered. It does not prove the FORM works: the
script builds its own payloads, so it cannot detect the component and the server
disagreeing about a field name — which is dropped silently, with a 200. Submit
the real form in a real browser as well.

DELETE THE TEST CONTACTS when you have checked them.
EXPECT

# ── Extending this ───────────────────────────────────────────────────────────
#
# For each form you add, add one case per path it can produce — not one case per
# form. A branch that is never submitted is a branch that was never tested, and
# the branches that add fields rather than swapping them are exactly where a
# name mismatch hides.
#
# For a route that rebuilds answers from step definitions, every REQUIRED step
# of the branch must be present and every select must answer with one of its
# OWN option values. Expect to get this wrong a few times while writing the
# cases; that friction is the route refusing to trust the client, which is the
# behavior you want.
#
# And check the resulting NOTE, not just the status: count its answers against
# the questions the branch asks. A select answered with a value that is not one
# of its options can be dropped silently, so the submission saves with an answer
# missing and still returns 200. Counting is the only thing that catches it.
#
# Two things this script cannot test, and which must be said out loud rather
# than left as a gap in a report:
#   • payments, if the CRM is wired to a live processor with no sandbox — test
#     card numbers are correctly rejected by a live connection;
#   • anything on the production domain, while DNS still points at an old site.
#
# The failure drill is not here either, because it needs a human to break and
# restore a token. Run it: skills/crm-verify/SKILL.md § 4.

[ "$FAIL" -eq 0 ]
