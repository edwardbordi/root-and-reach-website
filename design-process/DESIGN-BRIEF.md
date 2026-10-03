# Design brief — Root & Reach Creative

The spec the theme and components are built from. Structure is `SITE-STRUCTURE-BRIEF.md`; what's
true is `CLIENT-FACTS.md`; who it's for is `../AUDIENCE.md`. Draft, 2026-10-02: the palette and type
are proposals from the logo, not yet seen by Cristina.

---

## Feeling

- **Four words (from the meeting):** fun, creative, exciting, interesting.
- **What the visitor should feel in five seconds:** "this would actually be fun, and she'd make me
  look good." Relief, not pressure.
- **Avoid:** stock photography of any kind; agency polish that feels cold; influencer hype; anything
  that makes a nervous owner feel behind.

**The idea in one sentence: the world, seen through Cristina's lens.** Her logo is a line drawing of
her face, and one lens of her glasses holds a 70s swirl in orange, seafoam and sand. The site works
the same way: clean, warm and hand-drawn most of the time, with the retro swirl appearing where her
eye is on something (the hero, the 4 Cs, hover states). That keeps the 70s idea in play without
committing the whole site to a costume (`CLIENT-FACTS`: retro is an idea, not a decision).

If Cristina wants to lean further into retro, the review kit can show a second home version with the
swirl carried into full-width bands and rounder, groovier type.

---

## Color system

Every color is taken from the logo. The logo's colors are all light, so each family also gets a
darker version for anything people read or click. Ratios are WCAG contrast against the ground named.

| Token | Value | From the logo | Used for | Contrast |
|---|---|---|---|---|
| `ink` | `#1C1A18` | Line art, wordmark | Body text; ground of dark bands | 15.81 on paper ✓ |
| `muted` | `#5F5850` | — (ink, softened) | Captions, secondary text | 6.38 on paper ✓ |
| `paper` | `#F7F4EE` | Logo background, warmed | Page background | — |
| `rust` | `#A4501F` | Lens swirl (orange), deepened | **Every action:** buttons, links | 5.11 on paper ✓ · paper on rust 5.11 ✓ |
| `rust-strong` | `#843F17` | — | Hover and pressed | 7.07 on paper ✓ |
| `teal-deep` | `#2F6B63` | Lens swirl and eye (seafoam), deepened | Eyebrows, secondary labels | 5.62 on paper ✓ |
| `olive` | `#5E5C3A` | Leaf (sage), deepened | Small print, tags | 6.24 on paper ✓ |
| `orange` | `#D5844F` | Lens swirl | Swirl graphic, fills; text only on `ink` | 5.98 on ink ✓ · 2.64 on paper ✗ |
| `seafoam` | `#B3DFD3` | Lens swirl, eye | Bands, swirl graphic | ink on it 11.91 ✓ |
| `sand` | `#DED1A4` | Lens swirl | Bands, cards | ink on it 11.37 ✓ |
| `blush` | `#E9BFAC` | Flowers, lips | Highlights, testimonial cards | ink on it 10.34 ✓ |
| `sage` | `#C1BD92` | Leaf | Dividers, small fills | decorative |
| `line-strong` | `#8F857A` | — | Form borders, anything a user must see | 3.3 on paper ✓ |

**The rule:** the logo colors (`orange`, `seafoam`, `sand`, `blush`, `sage`) are **surfaces and
graphics**, never text on the light page. Actions are always `rust`. On light bands (blush, seafoam,
sand) text is `ink`; `rust` on blush is only 3.34, so buttons on blush use the `ink` style.

**Mode: light only to start.** The logo lives on off-white; dark bands (`ink`) are compositional, for
the 4 Cs and the footer. Revisit a dark mode after review.

**Contrast target:** WCAG AA throughout. Accessibility audit 100.

---

## Type

Matched to the logo's two lettering styles, plus a warmer face for reading. All on Google Fonts.

- **Display: Bebas Neue.** Tall, condensed, bold capitals: the same family of letter as "ROOT&REACH".
  Used big and sparingly: H1s, the 4 Cs numerals-as-letters, the hero line. Never for paragraphs.
- **Labels: Josefin Sans, 300, uppercase, wide tracking (~0.3em).** Echoes the thin, spaced
  "CREATIVE" subline. Eyebrows, nav, small labels.
- **Body: Figtree, 400 and 600.** Friendly and round without being childish; reads well at 17px.
  Body 17px / 1.6 at a 65-character measure.
- **Hand-drawn touch:** the logo is line art, so underlines, arrows and dividers are drawn as
  single-weight ink lines, slightly imperfect, not geometric rules.

*To confirm with Cristina:* whether she knows the logo's actual fonts (match them exactly if so).

---

## Layout, shape and motion

- **Density:** airy. Big type, generous space, one idea per section.
- **Corners:** soft (8–12px) on cards and buttons; the logo is all curves, nothing sharp.
- **Imagery:** her own photos and video only (no stock). Until they arrive, slots show a designed
  placeholder in a logo color with a `data-needs` label, never a stock stand-in.
- **The swirl:** redrawn as SVG from the lens (needs the vector logo, OPEN-ITEM 11; a traced version
  until then). Used in the hero, behind the 4 Cs, and as the hover state on cards.
- **Motion:** subtle and playful. The swirl turns slowly on hover, sections rise in gently. Respect
  `prefers-reduced-motion`.

---

## Voice

First person, Cristina speaking. Warm, encouraging, plain about price and process. Full do/don't in
`../AUDIENCE.md`. She uses "Strategy with style, content with heart" and the 4 Cs; both appear in
her own words, not paraphrased.

---

## Required on the home page

Hero with Cristina and one clear call to book · the 4 Cs · what a month with her looks like ·
testimonials · the creative network · her story · social feed · book a call.
