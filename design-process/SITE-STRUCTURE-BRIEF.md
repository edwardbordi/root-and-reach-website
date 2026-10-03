# Site-structure brief — Root & Reach Creative

Skeleton of the site: what exists and how it's composed. How it looks is `DESIGN-BRIEF.md`; what's
true is `CLIENT-FACTS.md`; who it's for is `../AUDIENCE.md`. Draft, 2026-10-02.

## 1. Site + goal

- **Business / site name:** Root & Reach Creative (working assumption; OPEN-ITEM 1)
- **What the site is for:** turn a small business owner who's nervous about content into a paid
  monthly client, by making the whole thing feel clear, comfortable and easy before the first call.
- **Primary call to action:** **Book a call** with Cristina.
- **Primary audience:** small, independent business owners who need photo and video content and
  dread making it (`AUDIENCE.md`).

## 2. Pages

| Route | Purpose | Focus keyword / intent (draft) |
| --- | --- | --- |
| `/` | Home: the promise, the 4 Cs, proof, book a call | content creation for small business |
| `/how-it-works` | The 4 Cs, one step at a time, worries answered at each; what a month looks like | small business content shoot |
| `/network` | Her creative network and how she brings it together | creative team for small business |
| `/about` | Cristina, her why, her Italian small-business roots | *(brand query: Cristina Vann)* |
| `/book` | Book a call (template route, kept) | book a content shoot |
| `/blog` | Built-in blog | blog |
| `/privacy`, `/terms` | Template legal pages | — |

Focus keywords get a location added once we know her service area (OPEN-ITEM 7).
**Events** (`/events`) ships with the template and isn't needed; remove it unless Ed wants it.
**Pricing** lives on `/how-it-works` if she agrees to show it (OPEN-ITEM 8); no separate page.

## 3. Layouts

- **Home:** hero (Cristina + the promise, one CTA) → the shift from scary to easy → the 4 Cs teaser →
  what a month with her looks like → testimonials → network teaser → her story teaser → social feed →
  book a call.
- **Internal pages:** page header (eyebrow, H1, one line) → content → book-a-call band.
- **Blog post:** the template's post layout, unchanged except the theme.

## 4. Component plan

- **Site chrome:** `Nav`, `MobileMenu`, `Footer` (footer carries the three social links and the LLC name).
- **Widgets (`components/widgets/`):**
  - `Hero` (home)
  - `FourCs`: the four steps, compact on home, full on `/how-it-works`
  - `MonthAtAGlance`: one shoot, the content, optional editing (home, `/how-it-works`)
  - `Testimonials` (home, `/how-it-works`) — waits on OPEN-ITEM 4
  - `NetworkGrid`: roles now, named people later (home teaser, `/network`)
  - `StoryTeaser` (home)
  - `SocialFeed` (home) — see section 6
  - `BookCallBand` (every page's foot)
  - `PageHeader` (internal pages)
- **Primitives:** `Eyebrow`, `Reveal`, the arrows (template); a `LensSwirl` graphic drawn from the logo.

## 5. Navigation

- **Header:** How it works · The network · About · Blog · **Book a call** (button)
- **Footer:** the same links, Facebook / Instagram / TikTok, Privacy, Terms,
  "Root & Reach Creative Agency LLC".

## 6. Content sources

- **Blog:** in-repo MDX. Cadence to agree with Cristina.
- **Network and testimonials:** small data files in the repo (`src/data/`), changed by PR like
  everything else.
- **Social feed:** depends on OPEN-ITEMS 9 and 10. Whatever we build reads its token lazily inside
  the request handler (BUILD-ENV law), caches the result, and falls back to a static "follow me on…"
  block when the token is missing or expired, so the site always builds and never shows a broken feed.

## 7. Review

- Turn the review kit on for the preview (`PREVIEW_CHROME = true`, feedback to ed@realiiz.com).
- Every image slot carries `data-needs` so "Show what we still need" becomes Cristina's shot list.
- If the retro direction gets explored, `PREVIEW_VARIANTS` can show a retro and a cleaner home side by
  side for her to react to.

## 8. Out of scope / later

- Social media management features of any kind (she doesn't offer it).
- Online payment or client portal.
- Events.
