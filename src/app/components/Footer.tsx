import Link from "next/link";
import {
  LEGAL_ENTITY,
  CONTACT_EMAIL,
  PHONE_DISPLAY,
  PHONE_TEL,
  LOCATION,
  SOCIAL_LINKS,
  NAV_LINKS,
} from "../../lib/site-config";
import { Wordmark } from "./Nav";
import OutboundArrow from "./OutboundArrow";
import ForwardArrow from "./ForwardArrow";
import LensSwirl from "./LensSwirl";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

// The closing frame of every page. Premium by detail, not by adding stuff:
// a 70s stripe in the lens colors where it starts, her mark beside the
// wordmark (as in the header), labelled link columns, "Book a call" as the one real button,
// and a quiet way back to the top.
export default function Footer() {
  const bookLink = NAV_LINKS.find((l) => l.href === "/book");
  const explore = NAV_LINKS.filter((l) => l.href !== "/book");
  return (
    <footer className="site-footer mt-auto bg-ink text-bone">
      {/* Orange, sand, seafoam: the same order as the button and photo rings. */}
      <div aria-hidden="true" className="flex flex-col">
        <span className="h-[5px] bg-orange" />
        <span className="h-[5px] bg-sand" />
        <span className="h-[5px] bg-seafoam" />
      </div>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link href="/" aria-label="Root & Reach Creative, home" className="group inline-flex items-center gap-3 rounded-md">
              <LensSwirl className="w-11 -rotate-6 transition-transform duration-300 group-hover:rotate-0" spin onDark />
              <Wordmark tone="bone" />
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-bone/75">Strategy with style, content with heart.</p>
            {LOCATION && <p className="mt-4 text-sm text-bone/75">{LOCATION}</p>}
            <div className="mt-3 flex flex-col gap-1 text-sm">
              {CONTACT_EMAIL && (
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-bone/75 transition-colors hover:text-bone">
                  {CONTACT_EMAIL}
                </a>
              )}
              {PHONE_DISPLAY && (
                <a href={`tel:${PHONE_TEL}`} className="text-bone/75 transition-colors hover:text-bone">
                  {PHONE_DISPLAY}
                </a>
              )}
            </div>
            {bookLink && (
              <div className="mt-8">
                <Link href={bookLink.href} className="btn-primary group">
                  {bookLink.label}
                  <ForwardArrow />
                </Link>
              </div>
            )}
          </div>
          <div className="flex gap-14">
            <nav aria-labelledby="footer-explore" className="flex flex-col gap-2.5 font-mono-label text-[0.78rem]">
              <p id="footer-explore" className="mb-2 text-[0.68rem] text-signal-light">Explore</p>
              {explore.map((l) => (
                <Link key={l.href} href={l.href} className="text-bone/75 transition-colors hover:text-signal-light">
                  {l.label}
                </Link>
              ))}
            </nav>
            {SOCIAL_LINKS.length > 0 && (
              <div className="flex flex-col gap-2.5 font-mono-label text-[0.78rem]">
                <p className="mb-2 text-[0.68rem] text-signal-light">Follow</p>
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-bone/75 transition-colors hover:text-signal-light"
                  >
                    {s.label}
                    <OutboundArrow />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-bone/15 pt-6 text-xs text-bone/60 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {LEGAL_ENTITY}. All rights reserved.
          </span>
          <span className="flex items-center gap-5">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-bone">
                {l.label}
              </Link>
            ))}
            {/* Back to the top of whatever page this is. */}
            <a href="#" className="group inline-flex items-center gap-1 transition-colors hover:text-bone">
              Back to top
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.2em] w-[1.2em] transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
