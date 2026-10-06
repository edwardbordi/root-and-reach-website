import { SOCIAL_LINKS } from "../../lib/site-config";

/**
 * Cristina's social accounts as small icon links, read from SOCIAL_LINKS in
 * lib/site-config.ts (the same list as the footer and JSON-LD sameAs), so an
 * account added there shows up everywhere. For someone who sells online
 * presence, these sit where people look: the sticky header (wide screens),
 * the mobile menu, and a "Follow along" line under the hero buttons.
 *
 * The glyphs are simple drawn marks in currentColor, so they take the
 * surrounding text color and hover state.
 */

const PATHS: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </>
  ),
  TikTok: (
    <path
      fill="currentColor"
      d="M16.6 3c.32 2.02 1.62 3.38 3.6 3.55v3.08a7.2 7.2 0 0 1-3.6-1.05v6.1a5.45 5.45 0 1 1-5.45-5.45c.3 0 .6.02.9.07v3.15a2.35 2.35 0 1 0 1.45 2.17V3h3.1Z"
    />
  ),
  Facebook: (
    <path
      fill="currentColor"
      d="M13.4 21v-7.6h2.55l.4-3h-2.95V8.5c0-.86.25-1.45 1.48-1.45h1.57V4.37A21 21 0 0 0 14.16 4.2c-2.27 0-3.82 1.39-3.82 3.93v2.27H7.78v3h2.56V21h3.06Z"
    />
  ),
};

export function SocialIcon({ label, className = "h-[1.15rem] w-[1.15rem]" }: { label: string; className?: string }) {
  const glyph = PATHS[label];
  if (!glyph) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {glyph}
    </svg>
  );
}

/** A row of icon links. `linkClassName` styles each round hit area. */
export default function SocialLinks({
  className = "",
  linkClassName = "",
  iconClassName,
}: {
  className?: string;
  linkClassName?: string;
  iconClassName?: string;
}) {
  if (SOCIAL_LINKS.length === 0) return null;
  return (
    <ul className={`flex items-center ${className}`}>
      {SOCIAL_LINKS.filter((s) => PATHS[s.label]).map((s) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Cristina on ${s.label} (opens in a new tab)`}
            title={s.label}
            className={`flex items-center justify-center rounded-full transition-colors ${linkClassName}`}
          >
            <SocialIcon label={s.label} className={iconClassName} />
          </a>
        </li>
      ))}
    </ul>
  );
}
