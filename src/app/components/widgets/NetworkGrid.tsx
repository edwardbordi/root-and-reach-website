"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "../Reveal";
import Eyebrow from "../Eyebrow";

// Cristina's creative network, with her in the middle of it: her photo in a
// ringed circle at the centre, the roles around her, each joined to her by a
// thin line that draws out from her as the section scrolls in. It makes the
// closing line ("one person you trust in the middle of it") something you see.
//
// Desktop: three roles either side of her. Smaller screens: her portrait on
// top, roles in a grid below, no lines. Lists roles until people agree to be
// named (OPEN-ITEM 5); `people` can replace roles later without changing the
// layout.
export type NetworkIcon = "strategy" | "venues" | "models" | "video" | "web" | "graphics";

export interface NetworkRole {
  role: string;
  body: string;
  icon: NetworkIcon;
}

export interface NetworkGridProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  intro: string;
  roles: NetworkRole[];
  closing?: React.ReactNode;
  /** A client's words backing it up, e.g. from her Google reviews. */
  quote?: { text: string; name: string };
  needs?: string;
}

const FILLS = ["bg-sand", "bg-seafoam", "bg-blush", "bg-sage", "bg-sand", "bg-seafoam"];

/** Simple line icons (lucide-style), drawn in ink inside each role's circle. */
function RoleIcon({ icon }: { icon: NetworkIcon }) {
  const paths: Record<NetworkIcon, React.ReactNode> = {
    strategy: (
      <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
      </>
    ),
    venues: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    models: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
      </>
    ),
    video: (
      <>
        <rect x="2" y="6" width="14" height="12" rx="2" />
        <path d="m22 8-6 4 6 4V8Z" />
      </>
    ),
    web: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 9h20" />
        <path d="M6 6.5h.01M9 6.5h.01" />
      </>
    ),
    graphics: (
      <>
        <path d="m12 19 7-7 3 3-7 7-3-3z" />
        <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="m2 2 7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-[1.2rem] w-[1.2rem]">
      {paths[icon]}
    </svg>
  );
}

function RoleCard({ r, i, cardRef }: { r: NetworkRole; i: number; cardRef?: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={cardRef} className="relative flex h-full items-start gap-4 rounded-2xl border border-line bg-bone p-5">
      <span aria-hidden="true" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink ${FILLS[i % FILLS.length]}`}>
        <RoleIcon icon={r.icon} />
      </span>
      <div className="min-w-0">
        <h3 className="font-display text-3xl leading-none text-ink">{r.role}</h3>
        <p className="wrap-balance mt-2 text-sm leading-relaxed text-slate">{r.body}</p>
      </div>
    </div>
  );
}

function Hub({ hubRef, className = "" }: { hubRef?: (el: HTMLDivElement | null) => void; className?: string }) {
  return (
    <div ref={hubRef} className={`network-hub relative aspect-square overflow-hidden rounded-full bg-bone ${className}`}>
      {/* Her headshot (cropped from client-assets/photos/Cristina.jpg; the
          frame and logo badge removed). Swap the file to change it. */}
      <Image
        src="/logos/cristina-headshot.webp"
        alt="Cristina Vann, smiling, at the centre of her creative network"
        fill
        sizes="16rem"
        className="object-cover"
      />
    </div>
  );
}

export default function NetworkGrid({ id, eyebrow, heading, intro, roles, closing, quote, needs }: NetworkGridProps) {
  const half = Math.ceil(roles.length / 2);
  const left = roles.slice(0, half);
  const right = roles.slice(half);

  // Lines from her (hub centre) to each card's inner edge, measured from the
  // real layout so they always meet the cards, whatever the copy does.
  const wrap = useRef<HTMLDivElement>(null);
  const hub = useRef<HTMLDivElement | null>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const measure = () => {
      const w = wrap.current;
      const h = hub.current;
      if (!w || !h || !h.offsetParent) return setLines([]);
      const W = w.getBoundingClientRect();
      const H = h.getBoundingClientRect();
      const cx = H.left + H.width / 2 - W.left;
      const cy = H.top + H.height / 2 - W.top;
      setBox({ w: W.width, h: W.height });
      setLines(
        cards.current.flatMap((c, k) => {
          if (!c) return [];
          const r = c.getBoundingClientRect();
          const onLeft = k < half;
          return [{ x1: cx, y1: cy, x2: (onLeft ? r.right : r.left) - W.left, y2: r.top + r.height / 2 - W.top }];
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [half]);

  return (
    <section id={id} className="border-y border-line bg-bone-2">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {eyebrow && <Eyebrow tone="signal">{eyebrow}</Eyebrow>}
        <h2 className="font-display mt-5 max-w-3xl text-balance text-5xl leading-[0.98] text-ink sm:text-6xl">{heading}</h2>
        <p className="wrap-balance mt-6 max-w-2xl text-lg leading-relaxed text-slate">{intro}</p>

        <Reveal className="mt-14">
          {/* Desktop: roles either side of her, joined by drawn lines. */}
          <div
            ref={wrap}
            className="relative hidden grid-cols-[1fr_15rem_1fr] items-center gap-x-14 lg:grid"
            {...(needs ? { "data-needs": "Who in the network can be named", "data-needs-detail": needs } : {})}
          >
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}>
              {lines.map((l, k) => (
                <path
                  key={k}
                  d={`M${l.x1} ${l.y1} L${l.x2} ${l.y2}`}
                  pathLength={1}
                  className="hub-line"
                  style={{ "--line-delay": `${300 + k * 140}ms` } as React.CSSProperties}
                />
              ))}
            </svg>
            <ul className="relative flex flex-col gap-4">
              {left.map((r, i) => (
                <li key={r.role}>
                  <RoleCard r={r} i={i} cardRef={(el) => { cards.current[i] = el; }} />
                </li>
              ))}
            </ul>
            <Hub hubRef={(el) => { hub.current = el; }} />
            <ul className="relative flex flex-col gap-4">
              {right.map((r, i) => (
                <li key={r.role}>
                  <RoleCard r={r} i={i + half} cardRef={(el) => { cards.current[i + half] = el; }} />
                </li>
              ))}
            </ul>
          </div>

          {/* Smaller screens: her on top, the roles below. */}
          <div className="lg:hidden">
            <Hub className="mx-auto w-48" />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {roles.map((r, i) => (
                <li key={r.role}>
                  <RoleCard r={r} i={i} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {closing && <p className="font-display mt-14 text-balance text-3xl leading-tight text-ink sm:text-4xl">{closing}</p>}
        {quote && (
          <figure className="mt-6 max-w-2xl">
            <blockquote className="wrap-balance text-lg leading-relaxed text-ink">“{quote.text}”</blockquote>
            <figcaption className="font-mono-label mt-3 text-[0.68rem] text-slate">{quote.name}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
