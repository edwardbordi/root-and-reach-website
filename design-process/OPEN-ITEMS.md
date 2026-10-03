# OPEN-ITEMS — Root & Reach Creative

What's missing, who owes it, and what it blocks. Anything uncertain lives here, never in
`CLIENT-FACTS.md`.

Last updated 2026-10-03.

---

## Blocking — the site can't say this until it's answered

### 1. The public brand name
**Owed by:** Cristina · **Asked:** not yet
The LLC and the logo say **Root & Reach Creative**; her Instagram and TikTok handles say
**cristina_creative_**. The site name, page titles and Organization schema need one answer. Working
assumption until then: **Root & Reach Creative**, with Cristina as the face of it.

### 2. Domain
**Owed by:** Cristina / Ed · **Asked:** not yet
Does she own a domain? Blocks `SITE_URL`, the canonical URLs and the email address on the site.

### 3. Her 4 Cs process, written by her
**Owed by:** Cristina · **Asked:** 2026-10-02 (she agreed to document it)
One step per C, from the first call on, including what clients worry about at each step. The process
section is a placeholder until this arrives. Nothing gets invented for it.

### 4. Testimonials: mostly answered by her Google reviews
**Owed by:** Cristina · **Updated:** 2026-10-03
Her Google Business Profile has 21 five-star reviews, now on the site as a filterable reviews
section (`src/lib/reviews.ts`). They're public reviews, quoted word for word with short names, so
they don't need separate sign-off, but **tell Cristina they're on the site** and let her flag any she'd
rather not feature. One question for her: **one review is from Julian Vann.** If he's family, it's
left off the site (a relative's review needs that connection disclosed to be shown as a
testimonial); it still counts in Google's 5.0 rating. Currently left off.

### 5. Her creative network — who gets named
**Owed by:** Cristina · **Asked:** not yet
For each person: name, what they do, a link, and whether they're happy to be named. Until then the
network section describes roles (videographer, web, graphic design, models, venues) without names.

### 6. Photos and video of her and her work
**Owed by:** Cristina · **Asked:** 2026-10-02 (she's shooting video)
No stock images, so every image slot is waiting on her. Each will be marked `data-needs` in the
build so "Show what we still need" in the review kit lists them.

---

## Needed before launch

### 7. Contact details and booking
**Booking: done 2026-10-03.** /book embeds her HighLevel calendar ("Discovery Call with Cristina", 30
min, ID in `site-config.ts`). Still open: email, phone, where she's based, whether she travels.
How people reach her: email, phone, a booking calendar, or a form. Also where she's based and
whether she travels to clients.

### 8. Does pricing go on the site?
$400 per half-day shoot is confirmed (CLIENT-FACTS). Showing it filters for paid clients, which she
wants; leaving it for the call is the alternative. Her decision.

### 9. Which social channel to feature
She's on Facebook, Instagram and TikTok. Which does she post to most consistently? That one gets
featured; the other two get links.

### 10. The social feed's access
An auto-updating Instagram or TikTok feed needs an access token from her account. A Facebook Page can
use Facebook's own embed with no token. Decided once item 9 is answered.

### 11. Vector logo
The logo is a JPEG. An SVG, AI or PDF from whoever drew it gives a sharp header and lets the lens
swirl be reused as a pattern.

### 12. Italy: lived or visited
Her story says she spent time there as a small child and has been back several times. Keep the
wording vague unless she says otherwise.

### 13. Her Google review link
The reviews section links to a Google search for her business. Her profile's own "share" link (from
the Google Business Profile dashboard, or Google Maps → Share) goes straight to her reviews and is
sturdier. Ask Cristina, or copy it from Maps.

### 14. "I" or "we"
The site speaks as Cristina ("I"). Several reviews say "Cristina and her team". Fine as is if the team
is her network; worth a quick yes from her.

### 15. Where she's based
A review places one shoot at The SoundPlex in Pennsauken, NJ. Her service area is still OPEN-ITEM 7;
don't put a location on the site from a review alone.

### 16. Styling and wardrobe
A model's review says she styled the shoot and supplied wardrobe. If that's a regular part of what
she offers, it could go in the network/services copy. Ask before adding.

### 17. Shoot photos in the "What you get" slider
Seven preview photos Ed picked from Cristina's Facebook (originals in `client-assets/photos/`, web
copies in `public/work/`, all cropped to 4:5). Captions say what each photo captures and were written
without details of the shoots. Before launch: Cristina's OK to use them, any client or model who
should be asked, and her own choice of photos and captions if she has favorites.

### 18. Hands-on social media help: open door or no?
At kickoff Cristina said she doesn't do social media management and doesn't want to (CLIENT-FACTS).
Ed's call (2026-10-03): the site shouldn't read as a flat no. "Your accounts" now says accounts stay
the client's, she'll show them how to get more out of them, and more hands-on help is something to
talk through. Confirm Cristina is happy to have that conversation with clients.

### 19. The photo in "Why small business"
Preview: Cristina with two women from one of her shoots (sent by Ed 2026-10-03, from her socials;
web copy `public/work/cristina-with-crew.webp`). Before launch: Cristina's OK, and the two women's.
Later idea (Ed): a short slider here, from her, to her in action on set, ending on a finished photo
for a small business. Needs behind-the-scenes shots of her working.

### 20. Legal pages: her details
Privacy and Terms were rebuilt from realiiz.com's (2026-10-03). Before launch:
- **Business address** for the contact block (currently "United States" only).
- **Email** (`CONTACT_EMAIL` in site-config.ts); until it's set, the pages point to /book.
- **Home state of the LLC.** Terms assume New Jersey for governing law; change if it's elsewhere.
- **Texts:** both pages describe appointment texts (confirmations, reminders) because the booking
  calendar is HighLevel. If her calendar doesn't send texts, the SMS sections can come out; if it
  does, they're what carriers look for in A2P registration.
- A lawyer's read is always worth it; these are a sensible baseline, not legal advice.

---

## Decided

- **Spelling:** Cristina Vann (no "h"). 2026-10-02.
- **Legal entity:** Root & Reach Creative Agency LLC. 2026-10-02.
- **Price:** $400 for a 4-hour half-day shoot, once a month per client; editing extra, approved first. 2026-10-02.
- **Retro / 70s:** an idea to play with, not a decision. 2026-10-02.
