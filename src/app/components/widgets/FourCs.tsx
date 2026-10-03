import type { ReactNode } from "react";
import Reveal from "../Reveal";
import Eyebrow from "../Eyebrow";

// Cristina's 4 Cs as a journey: Connect, Collab, Create, Consistently. Each
// step gets a numbered circle in one of her palette colors, joined by a line
// that draws left to right as the band scrolls in, so it reads as steps in
// order. Copy lives in the page; `needs`
// marks the band while her own write-up is outstanding (OPEN-ITEM 3).
export interface FourCsStep {
  word: string;
  body: React.ReactNode;
}

export interface FourCsProps {
  id?: string;
  eyebrow?: ReactNode;
  heading: string;
  intro?: string;
  steps: FourCsStep[];
  needs?: string;
}

const STEP_FILLS = ["bg-orange", "bg-sand", "bg-seafoam", "bg-blush"];

/** How long one segment takes to draw, and the gap between one starting and
 *  the next. Computed into custom properties so the stagger stays in step if a
 *  step is ever added. Whole line lands in about 1.3s. */
const DRAW = 520;
const STEP = 380;

export default function FourCs({ id, eyebrow, heading, intro, steps, needs }: FourCsProps) {
  return (
    <section id={id} className="bg-ink text-bone">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {eyebrow && <Eyebrow tone="signal">{eyebrow}</Eyebrow>}
        <h2 className="font-display mt-5 max-w-2xl text-balance text-5xl leading-[0.98] sm:text-7xl">{heading}</h2>
        {intro && <p className="wrap-balance mt-6 max-w-xl text-lg leading-relaxed text-bone/80">{intro}</p>}

        {/* The timeline draws itself (same idea as the Neoteric lineage): the
            line extends circle to circle, one segment after another, each
            numbered circle arriving as the line reaches it, and the last one
            pulsing once the line has landed. Drawn per step, so it stops at 04
            instead of running past it. The default state is FINISHED: without
            JS (no .is-visible) or with reduced motion it's simply drawn. */}
        <Reveal className="mt-14">
          <ol
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            {...(needs ? { "data-needs": "Cristina's 4 Cs, in her words", "data-needs-detail": needs } : {})}
          >
            {steps.map((s, i) => {
              const isLast = i === steps.length - 1;
              const segDelay = i * STEP;
              const dotDelay = i === 0 ? 0 : (i - 1) * STEP + DRAW;
              const pulseDelay = (steps.length - 2) * STEP + DRAW + 200;
              return (
                <li key={s.word} className="relative flex h-full flex-col">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      style={{ "--draw": `${DRAW}ms`, "--draw-delay": `${segDelay}ms` } as React.CSSProperties}
                      className="cs-seg absolute top-[calc(1.75rem-0.75px)] left-[3.25rem] right-[-4.5rem] hidden h-[1.5px] bg-bone/35 lg:block"
                    />
                  )}
                  <div className="relative flex items-center gap-3 pl-6">
                    <span
                      aria-hidden="true"
                      style={{ "--dot-delay": `${dotDelay}ms`, "--pulse-delay": `${pulseDelay}ms` } as React.CSSProperties}
                      className={`cs-dot font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-3xl leading-none text-ink ${STEP_FILLS[i % STEP_FILLS.length]} ${isLast ? "cs-dot--last" : ""}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-5 flex flex-1 flex-col rounded-2xl border-[1.5px] border-bone/20 p-6 transition-colors hover:border-signal-light">
                    <h3 className="font-display text-4xl leading-none">
                      <span className="sr-only">Step {i + 1}: </span>
                      {s.word}
                    </h3>
                    <p className="wrap-balance mt-4 leading-relaxed text-bone/80">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
