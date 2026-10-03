"use client";

import { useEffect, useRef, useState } from "react";

export type RailSection = { id: string; label: string };

/**
 * Vertical section-navigation rail — a column of small dots down the right
 * edge of the homepage, with no container: quiet by default, the active dot is
 * rust, and hovering a dot grows it and reveals the section label. With no
 * container the dots sit straight on the page, so the rail checks the
 * background behind it as you scroll and switches to light dots over dark
 * sections. Scroll-spy via IntersectionObserver. Desktop only (lg+).
 *
 * Built on real anchor links so it works without JS and is keyboard-navigable.
 * Smooth scroll + reduced-motion are handled by the global CSS on <html>.
 */
export default function SectionRail({ sections }: { sections: RailSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const [onDark, setOnDark] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Over dark sections, flip the resting dots to light. Reads the first
  // non-transparent background under the rail's middle, on scroll/resize.
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const nav = navRef.current;
      if (!nav) return;
      const r = nav.getBoundingClientRect();
      const under = document
        .elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        .find((el) => !nav.contains(el));
      let el: Element | null = under ?? null;
      while (el) {
        const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
        if (m && (m.length < 4 || Number(m[3]) > 0.5)) {
          const [R, G, B] = m.map(Number);
          setOnDark(0.2126 * R + 0.7152 * G + 0.0722 * B < 110);
          return;
        }
        el = el.parentElement;
      }
      setOnDark(false);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    // A zero-height band at the vertical center of the viewport: a section is
    // "active" when it crosses the center line.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      ref={navRef}
      aria-label="Section navigation"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col items-end gap-1">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-label={s.label}
                aria-current={isActive ? "true" : undefined}
                className="group relative flex min-h-6 min-w-6 items-center justify-center px-1 py-1.5"
              >
                <span className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md bg-bone/95 px-2.5 py-1 text-xs font-medium text-ink opacity-0 shadow-sm ring-1 ring-line backdrop-blur-sm transition-all duration-150 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                  {s.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`rounded-full transition-all duration-150 ease-out ${
                    isActive
                      ? "h-2 w-2 bg-signal"
                      : onDark
                        ? "h-[5px] w-[5px] bg-bone/30 group-hover:h-2 group-hover:w-2 group-hover:bg-bone/70 group-focus-visible:h-2 group-focus-visible:w-2 group-focus-visible:bg-bone/70"
                        : "h-[5px] w-[5px] bg-ink/20 group-hover:h-2 group-hover:w-2 group-hover:bg-ink/55 group-focus-visible:h-2 group-focus-visible:w-2 group-focus-visible:bg-ink/55"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
