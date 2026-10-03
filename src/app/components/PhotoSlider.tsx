"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * A slow crossfading photo slider for real shoot photos. Every photo is the
 * same 4:5 crop (see public/work/), so nothing jumps as it changes.
 *
 * - Advances on its own every few seconds, only while it's on screen, and
 *   pauses while hovered or focused. Visitors who turn off animation get no
 *   auto-advance (arrows, dots and swipe still work).
 * - Swipe on touch, arrows and dots everywhere, keyboard-reachable.
 * - Each photo carries a short caption: what the photo captures, not who it
 *   was for. Swap photos and captions freely in the page.
 */
export interface SlidePhoto {
  src: string;
  alt: string;
  caption: string;
}

const INTERVAL = 5200;

export default function PhotoSlider({ photos, label }: { photos: SlidePhoto[]; label?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const n = photos.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % n), INTERVAL);
    return () => window.clearTimeout(t);
  }, [i, paused, inView, n]);

  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full bg-bone/85 text-ink backdrop-blur-sm transition-colors hover:bg-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone";

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={label ?? "Photos from real shoots"}
      className="photo-rings relative aspect-[4/5] w-full overflow-hidden rounded-[1.25rem] bg-blush"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {photos.map((p, k) => (
        <div
          key={p.src}
          role="group"
          aria-roledescription="slide"
          aria-label={`${k + 1} of ${n}`}
          aria-hidden={k !== i}
          className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${k === i ? "opacity-100" : "opacity-0"}`}
        >
          <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 28rem, 90vw" className="object-cover" loading={k === 0 ? "eager" : "lazy"} />
        </div>
      ))}

      {/* Caption, bottom-left; a soft shade keeps it readable on any photo. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/65 via-ink/25 to-transparent" />
      <p className="font-display absolute bottom-[4.5rem] left-5 right-5 text-[1.9rem] leading-none text-bone" aria-live="off">
        {photos[i].caption}
      </p>

      <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
        <div className="flex gap-1.5">
          {photos.map((p, k) => (
            <button
              key={p.src}
              type="button"
              aria-label={`Show photo ${k + 1}`}
              aria-current={k === i ? "true" : undefined}
              onClick={() => setI(k)}
              className="group flex h-6 items-center"
            >
              <span className={`block h-1.5 rounded-full transition-all ${k === i ? "w-5 bg-bone" : "w-1.5 bg-bone/55 group-hover:bg-bone/80"}`} />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={btn}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          </button>
          <button type="button" aria-label="Next photo" onClick={() => go(1)} className={btn}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
