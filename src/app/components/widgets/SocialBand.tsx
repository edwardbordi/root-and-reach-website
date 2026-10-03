import Eyebrow from "../Eyebrow";
import OutboundArrow from "../OutboundArrow";

// "Follow along" — links to her channels. This is the planned fallback for the
// auto-updating feed (SITE-STRUCTURE-BRIEF §6), so it ships first and the live
// feed, if built, renders above it and falls back to it.
export interface SocialBandProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  body?: string;
  links: { label: string; url: string; handle?: string }[];
}

export default function SocialBand({ id, eyebrow, heading, body, links }: SocialBandProps) {
  if (!links.length) return null;
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
        <div className="min-w-0">
          {eyebrow && <Eyebrow tone="signal">{eyebrow}</Eyebrow>}
          <h2 className="font-display mt-5 text-balance text-5xl leading-[0.98] text-ink sm:text-6xl">{heading}</h2>
          {body && <p className="wrap-balance mt-5 max-w-md text-lg leading-relaxed text-slate">{body}</p>}
        </div>
        <ul className="flex flex-col">
          {links.map((l) => (
            <li key={l.url} className="border-t border-line last:border-b">
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between gap-4 py-4 text-ink"
              >
                <span className="font-display flex items-center gap-1 text-4xl leading-none transition-colors group-hover:text-signal">
                  {l.label}
                  <span className="text-[0.55em]">
                    <OutboundArrow />
                  </span>
                </span>
                {l.handle && <span className="font-mono-label truncate text-[0.72rem] text-slate">{l.handle}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
