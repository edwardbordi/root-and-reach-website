"use client";

import { keepLastWords } from "../../../lib/text";
import { useState } from "react";
import Eyebrow from "../Eyebrow";
import OutboundArrow from "../OutboundArrow";
import type { Review } from "../../../lib/reviews";

// Her Google reviews, sorted by what each one praises, with a row of filters
// so a visitor can jump straight to what they care about ("will I be
// comfortable on camera?", "does it get results?"). Data and themes live in
// lib/reviews.ts; this only renders them. Quotes are never edited here.
export interface ReviewWallProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  themes: readonly { id: string; label: string }[];
  reviews: Review[];
  rating: number;
  url: string;
  /** How many show before "Show all" when no filter is on. */
  initial?: number;
}

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`flex gap-0.5 text-signal ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-[1em] w-[1em]" fill="currentColor">
          <path d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.5l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewWall({
  id,
  eyebrow,
  heading,
  themes,
  reviews,
  rating,
  url,
  initial = 6,
}: ReviewWallProps) {
  const [theme, setTheme] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const matches = theme ? reviews.filter((r) => (r.themes as string[]).includes(theme)) : reviews;
  const shown = theme || expanded ? matches : matches.slice(0, initial);
  const activeLabel = themes.find((t) => t.id === theme)?.label;

  const chip =
    "rounded-full border px-4 py-1.5 text-[0.92rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-strong";
  const chipOff = "border-ink/25 text-ink hover:border-ink";
  const chipOn = "border-signal-strong bg-signal-strong text-bone";

  return (
    <section id={id} className="bg-blush on-color">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        {eyebrow && <Eyebrow tone="signal-strong">{eyebrow}</Eyebrow>}
        <h2 className="font-display mt-5 max-w-3xl text-balance text-5xl leading-[0.98] text-ink sm:text-6xl">
          {heading}
        </h2>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-1 text-ink"
        >
          {/* Rating as a badge: big stars, then the score in the display face. */}
          <Stars className="text-[1.55rem]" />
          <span className="font-display inline-flex items-center gap-2 whitespace-nowrap text-[1.65rem] leading-none">
            {rating.toFixed(1)} on Google
            <span className="text-[0.7em]">
              <OutboundArrow />
            </span>
          </span>
        </a>

        {/* Filters: what do you want to hear about? */}
        <div role="group" aria-label="Show reviews about" className="mt-10 flex flex-wrap gap-2">
          <button type="button" aria-pressed={theme === null} onClick={() => setTheme(null)} className={`${chip} ${theme === null ? chipOn : chipOff}`}>
            All
          </button>
          {themes.map((t) => {
            const n = reviews.filter((r) => (r.themes as string[]).includes(t.id)).length;
            if (!n) return null;
            const on = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => setTheme(on ? null : t.id)}
                className={`${chip} ${on ? chipOn : chipOff}`}
              >
                {t.label} <span className={on ? "text-bone/85" : "text-ink/75"}>{n}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-ink/70" aria-live="polite">
          {activeLabel
            ? `${matches.length} reviews that mention ${activeLabel.toLowerCase()}`
            : shown.length < matches.length
              ? `Showing ${shown.length} of ${matches.length}`
              : ""}
        </p>

        {/* Cards are dealt into columns in reading order (1, 2, 3 across the
            top), so the order holds and "Show all" only adds cards below.
            Each breakpoint gets its own set of columns; the two not in use
            are display:none, so screen readers hear each review once. */}
        {[
          { n: 1, cls: "grid sm:hidden" },
          { n: 2, cls: "hidden sm:grid lg:hidden sm:grid-cols-2" },
          { n: 3, cls: "hidden lg:grid lg:grid-cols-3" },
        ].map(({ n, cls }) => (
          <div key={n} className={`mt-8 gap-5 ${cls}`}>
            {Array.from({ length: n }, (_, col) => (
              <div key={col} className="flex flex-col gap-5">
                {shown
                  .filter((_, i) => i % n === col)
                  .map((r) => (
                    <figure key={r.name} className="review-card rounded-2xl bg-[color-mix(in_srgb,var(--color-blush)_35%,var(--color-bone))] p-6">
                      <Stars className="text-[1.15rem]" />
                      <blockquote className={`mt-4 leading-relaxed text-ink ${r.quote.length <= 230 ? "wrap-balance" : ""}`}>“{r.quote.length <= 230 ? r.quote : keepLastWords(r.quote)}”</blockquote>
                      <figcaption className="font-mono-label mt-5 text-[0.68rem] text-slate">
                        {r.name}
                        {r.role ? <span className="text-slate"> · {r.role}</span> : null}
                      </figcaption>
                    </figure>
                  ))}
              </div>
            ))}
          </div>
        ))}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {!theme && matches.length > initial && (
            <button
              type="button"
              onClick={() => {
                if (expanded) document.getElementById(id ?? "")?.scrollIntoView({ block: "start" });
                setExpanded(!expanded);
              }}
              className="btn-ghost"
            >
              {expanded ? "Show fewer" : "Show all reviews"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
