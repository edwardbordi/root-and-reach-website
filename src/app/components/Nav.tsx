import Link from "next/link";
import { NAV_LINKS } from "../../lib/site-config";
import MobileMenu from "./MobileMenu";
import LensSwirl from "./LensSwirl";
import ForwardArrow from "./ForwardArrow";
import HeaderScroll from "./HeaderScroll";
import SocialLinks from "./SocialLinks";

/** The wordmark: espresso ROOT & REACH in the site's headline face with a
 *  condensed Oswald ampersand in the same color, over a
 *  thin, wide-spaced teal CREATIVE. Real text, so it's crisp and readable to
 *  search. On the ink footer the name turns bone and CREATIVE seafoam. */
export function Wordmark({ tone = "ink" }: { tone?: "ink" | "bone" }) {
  const name = tone === "bone" ? "text-bone" : "text-espresso";
  const sub = tone === "bone" ? "text-seafoam" : "text-signal-2";
  return (
    <span className="flex flex-col items-start leading-none">
      <span className={`wm-name font-display flex items-baseline text-[1.9rem] tracking-[0.02em] ${name}`}>
        Root
        <span className="amp mx-[0.08em]" aria-hidden="true">
          &amp;
        </span>
        <span className="sr-only">and</span>
        Reach
      </span>
      <span className={`wm-sub font-mono-label mt-0.5 pl-0.5 text-[0.62rem] font-light tracking-[0.55em] ${sub}`}>Creative</span>
    </span>
  );
}

/**
 * The site header. Links come from NAV_LINKS in lib/site-config.ts — one list
 * the desktop nav, the mobile menu and the footer all read. "Contact Cristina" is
 * the one action, so it renders as the rust button.
 */
export default function Nav() {
  // The header line is a neutral grey hairline (line-dark softened into
  // bone): the warm --color-line read faintly pink against the hero.
  // The inline links need ~1000px, so below lg the hamburger takes over.
  // Sticky: once the page scrolls it shrinks to a tight bar (HeaderScroll
  // sets data-scrolled; the sizes live in .site-header in globals.css).
  return (
    <header className="site-header sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--color-line-dark)_25%,var(--color-bone))]">
      <HeaderScroll />
      <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between px-6">
        {/* The lens from her logo sits beside the wordmark, small and tilted
            like a sticker; it turns slowly when the logo is hovered. */}
        <Link href="/" aria-label="Root & Reach Creative, home" className="group flex items-center gap-3 rounded-md">
          <LensSwirl className="header-lens w-12 -translate-y-[3px] -rotate-6 transition-transform duration-300 group-hover:rotate-0" spin />
          <Wordmark />
        </Link>
        <div className="hidden items-center gap-7 whitespace-nowrap font-mono-label text-[0.8rem] text-slate lg:flex">
          {NAV_LINKS.map((l) =>
            l.href === "/contact" ? (
              <span key={l.href} className="flex items-center gap-4">
                {/* Her socials, one tap away on every page (xl+: below that the
                    inline nav has no room, and the mobile menu carries them). */}
                <SocialLinks
                  className="hidden gap-0.5 border-l border-[color-mix(in_srgb,var(--color-line-dark)_30%,var(--color-bone))] pl-3 xl:flex"
                  linkClassName="h-9 w-9 text-slate hover:bg-bone-2 hover:text-signal"
                />
              <Link href={l.href} className="btn-primary group">
                {l.label}
                <ForwardArrow />
              </Link>
              </span>
            ) : (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            ),
          )}
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
