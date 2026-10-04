/**
 * ────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the ONE place to brand a new site.
 *  Change these values when you spin up a site from this template. Everything
 *  else (metadata, JSON-LD, sitemap, feed, nav, footer) reads from here.
 * ────────────────────────────────────────────────────────────────────────────
 */

/** Site / brand name — used in titles, JSON-LD, the feed, and the footer. */
export const SITE_NAME = "Root & Reach Creative";

/** Production origin — single source of truth for absolute URLs (sitemap, robots, metadataBase). */
/* TODO(OPEN-ITEM 2): the domain isn't decided yet, so this is the Vercel
   preview Cristina reviews. It was example.com, which made every og:image
   point at a dead host — iMessage then grabbed the transparent portrait and
   showed it on black. Switch to the real domain before launch. */
export const SITE_URL = "https://root-and-reach-website.vercel.app";

/* ---------------------------------------------------------------------------
 * Review chrome — TEMPORARY, for the client-review phase only
 * -------------------------------------------------------------------------
 * While a site is being reviewed, a small eye nub floats on the edge of every
 * page. Behind it: a walkthrough video, a home-page version switch, a feedback
 * widget that emails notes and records approval, a page-speed badge, and an
 * outline mode showing every spot still waiting on the client.
 *
 * Everything is off until the reviewer switches it on, and each widget's code
 * is only downloaded at that point — a cold visit, and Lighthouse, get the nub
 * and nothing else.
 *
 * AT LAUNCH: set PREVIEW_CHROME to false, then delete PreviewChrome, ReviewMenu,
 * ReviewIcons, NotesWidget, Walkthrough, VariantToggle, SpeedBadge, useEdgeDock,
 * previewPrefs, /api/feedback, any variant routes, and this block.
 * ------------------------------------------------------------------------- */

/** The master switch. False ships the site with no review chrome at all. */
export const PREVIEW_CHROME = true;

/**
 * The walkthrough video: whoever built the site explaining what this preview is
 * and what feedback is wanted. Put an mp4 at public/preview/walkthrough.mp4 and
 * point here, or use a YouTube embed URL. A Loom URL works but loses the speed
 * and fullscreen controls. Empty — the default — makes the widget say it's coming.
 */
/* NOTE THE /embed/ — a Loom share link is NOT an embed link. The widget drops
   this straight into an iframe, and `loom.com/share/<id>` renders Loom's own
   page rather than the bare player. Same id either way. */
export const PREVIEW_WALKTHROUGH_URL: string =
  "https://www.loom.com/embed/25775138e553425c847e8669aa0ce2dc";

/** Where feedback goes when no FEEDBACK_WEBHOOK_URL is set. Your address, not the client's. */
export const PREVIEW_FEEDBACK_EMAIL = "ed@realiiz.com";

/** The URL the speed badge offers to test — usually the preview deployment. */
/* The preview deployment Cristina is reviewing — NOT SITE_URL, which isn't
   live. Assumes Vercel's default name for this repo; correct it once deployed. */
export const PREVIEW_TEST_URL = "https://root-and-reach-website.vercel.app";

/** What the walkthrough's "open this on your phone" QR points to. Ed's tracked
 *  short link (redirects to the preview). Empty falls back to PREVIEW_TEST_URL. */
export const PREVIEW_QR_URL: string = "https://link.sendlink.co/qr/MyFRHmFo6xH_";

/**
 * Home-page versions to offer the reviewer, when a build is showing more than
 * one. Empty hides the switch entirely. Each `href` needs a real route.
 */
export const PREVIEW_VARIANTS: { href: string; label: string }[] = [
  { href: "/", label: "Animated portrait" },
  { href: "/still", label: "Still portrait" },
];

/** Last PageSpeed Insights snapshot, filled in by hand after a run. */
export const PREVIEW_SCORES = {
  measured: "",
  desktop: { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 },
  mobile: { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 },
};

/**
 * The time zone event dates and times are read in when an event doesn't name
 * its own. CHANGE THIS to the site's home zone — an IANA name such as
 * "America/Chicago", "America/Los_Angeles" or "Europe/London".
 */
export const SITE_TIMEZONE = "America/New_York";

/** One-line description used as the default meta description + OG description. */
export const SITE_DESCRIPTION =
  "Photo and video content for small businesses, made easy and fun. Cristina Vann is your creative partner: strategy with style, content with heart.";

/** Legal entity behind the trade name (compliance / footer). */
export const LEGAL_ENTITY = "Root & Reach Creative Agency LLC";

/** Default social share image (1200×630) at /public/og/…  — replace with your own. */
export const OG_IMAGE_PATH = "/og/default.png";

/** Contact essentials shown in the footer. Leave blank to hide. */
/* OPEN-ITEM 7: contact details not received yet. Blank hides them. */
export const CONTACT_EMAIL = "";
export const PHONE_DISPLAY = "";
export const PHONE_TEL = "";
export const LOCATION = "";

/** Off-site profiles — used for JSON-LD sameAs + footer links. Add/remove as needed. */
export const SOCIAL_LINKS: { label: string; url: string }[] = [
  { label: "Instagram", url: "https://www.instagram.com/cristina_creative_/" },
  { label: "TikTok", url: "https://www.tiktok.com/@cristina_creative_" },
  { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61550975440320" },
];

/**
 * The main navigation — ONE list that every nav surface reads (header, mobile
 * menu, and any future footer nav). Add a page here and it appears everywhere;
 * there is no second list to keep in sync.
 */
export const NAV_LINKS: { href: string; label: string }[] = [
  /* Home-page anchors until /how-it-works, /network and /about are built
     (SITE-STRUCTURE-BRIEF §2). Events is dropped from the nav. */
  { href: "/#four-cs", label: "How it works" },
  { href: "/#network", label: "The network" },
  { href: "/#story", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/book", label: "Book a call" },
];

/**
 * Stable JSON-LD identity for the Organization (rendered once in layout.tsx).
 * Anything that ever needs to REFER to the organization (a post's publisher, an
 * event's organizer) points at this @id instead of restating the fields and
 * drifting into a second, conflicting Organization entity.
 */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Cristina's HighLevel booking calendar ("Discovery Call with Cristina", 30 min),
 *  embedded on /book. Not a secret: it's the public widget ID. */
export const BOOKING_CALENDAR_ID = "tfOdsZC17XafWKGNKiar";
