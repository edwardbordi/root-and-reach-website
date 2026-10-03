import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  LEGAL_ENTITY,
  OG_IMAGE_PATH,
  CONTACT_EMAIL,
  PHONE_TEL,
  SOCIAL_LINKS,
  ORGANIZATION_ID,
} from "../lib/site-config";
import JsonLd from "./components/JsonLd";
import AnalyticsBeacon from "./components/AnalyticsBeacon";
import { StudioBar } from "@realiizlabs/admin/bar";
import PreviewChrome from "./components/PreviewChrome";
import SmoothAnchors from "./components/SmoothAnchors";
import { STUDIO_ROUTES } from "../lib/admin/content-types";
import localFont from "next/font/local";
import "./globals.css";

/* Brand type (design-process/DESIGN-BRIEF.md → Type). Bebas Neue matches the
   tall condensed "ROOT&REACH" wordmark; Josefin Sans light matches the thin,
   wide-spaced "CREATIVE"; Figtree carries the reading. Self-hosted from
   src/app/fonts (SIL Open Font License, copies alongside) so the build needs
   no network and the site loads nothing from Google (Ownership Law). The
   variables feed the --font-* tokens in globals.css. */
const bebas = localFont({
  src: "./fonts/bebas-neue-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});
const figtree = localFont({
  src: [
    { path: "./fonts/figtree-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/figtree-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-figtree",
  display: "swap",
});
/* One glyph only: the Oswald SemiBold ampersand in the wordmark, a classic
   condensed "&" that belongs with Bebas. Subset to "&" (under 1 KB). */
const ampersand = localFont({
  src: "./fonts/oswald-ampersand-600.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-amp",
  display: "swap",
});
/* Handwriting (Gochi Hand), subset to just the glyphs used: the headline's
   "fun!" / "should be" easter egg and Cristina's signature under her tagline. */
const fun = localFont({
  src: "./fonts/gochi-hand-fun-400.woff2",
  weight: "400",
  variable: "--font-fun",
  display: "swap",
});
const josefin = localFont({
  src: [
    { path: "./fonts/josefin-sans-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/josefin-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-josefin",
  display: "swap",
});

// Default social-share image (1200×630) — used for any page that doesn't set its own.
const OG_IMAGE = `${SITE_URL}${OG_IMAGE_PATH}`;

/* Sitewide Organization structured data, rendered once on every page.
 *
 * ⚠️ THIS IS THE ONLY ORGANIZATION BLOCK ON THE SITE. Do not add a second one
 * on an individual page — a crawler finding two Organization entities at one
 * URL, with different fields, has to pick one and may pick the thinner one.
 * The `@id` (lib/site-config.ts) is a stable name for the organization, so
 * anything that needs to REFER to it points at the id instead of restating
 * the fields and drifting.
 *
 * Edit for your business type — e.g. LocalBusiness for a physical location,
 * with address/geo/openingHours.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  legalName: LEGAL_ENTITY,
  url: SITE_URL,
  image: OG_IMAGE,
  description: SITE_DESCRIPTION,
  ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
  ...(PHONE_TEL ? { telephone: PHONE_TEL } : {}),
  ...(SOCIAL_LINKS.length ? { sameAs: SOCIAL_LINKS.map((s) => s.url) } : {}),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — ${SITE_DESCRIPTION}`,
  description: SITE_DESCRIPTION,
  icons: {
    /* The lens swirl from Cristina's logo. SVG for modern browsers, PNG
       fallbacks for the rest; iOS needs a PNG for the home-screen icon. */
    icon: [
      { url: "/logos/favicon.svg", type: "image/svg+xml" },
      { url: "/logos/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/logos/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/logos/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${bebas.variable} ${figtree.variable} ${josefin.variable} ${ampersand.variable} ${fun.variable}`}>
      {/* Light only (DESIGN-BRIEF → Mode). The template's dark-mode bootstrap
          is removed: her palette lives on off-white, and dark bands are
          composed into the page rather than switched by the visitor. */}
      <body id="theme-scope" className="min-h-full flex flex-col">
        <JsonLd data={organizationJsonLd} />
        {/* First-party analytics beacon — no-ops entirely until
            GA4_MEASUREMENT_ID + GA4_API_SECRET are set (see .env.example
            and api/t/route.ts). Zero third-party JS either way. */}
        <AnalyticsBeacon />
        {/* Skip link — without it a keyboard user tabs through the whole
            header on every page before reaching anything. Each page's <main>
            carries id="main". Visually hidden until focused; see .skip-link
            in globals.css. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        {/* Studio pill: shows only in a browser that has signed in to /admin (marker cookie); anonymous visitors see nothing. */}
        <StudioBar routes={STUDIO_ROUTES} />
        {/* TEMPORARY: the client-review kit. Renders nothing at all unless
            PREVIEW_CHROME is on in site-config, and each widget's code is only
            fetched once a reviewer switches that widget on. Delete at launch. */}
        <SmoothAnchors />
        <PreviewChrome />
      </body>
    </html>
  );
}
