import Link from "next/link";
import LensSwirl from "../LensSwirl";
import ForwardArrow from "../ForwardArrow";

// The closing band on every page: one ask, one button.
export interface BookCallBandProps {
  id?: string;
  heading: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function BookCallBand({ id, heading, body, ctaLabel, ctaHref }: BookCallBandProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
      <div className="on-color group relative overflow-hidden rounded-[1.75rem] border-[1.5px] border-ink bg-seafoam px-7 py-14 sm:px-12">
        {/* Centred just inside the card's corner, so the swirl covers the
            corner (no outline running into it) and shows about a third. */}
        <div className="pointer-events-none absolute -right-24 -top-24 w-64 opacity-90 sm:-right-40 sm:-top-40 sm:w-[26rem]" aria-hidden="true">
          <LensSwirl shape="circle" spin />
        </div>
        <div className="relative max-w-xl">
          <h2 className="font-display text-balance text-5xl leading-[0.98] text-ink sm:text-6xl">{heading}</h2>
          {body && <p className="wrap-balance mt-5 text-lg leading-relaxed text-ink">{body}</p>}
          <div className="mt-8">
            <Link href={ctaHref} className="btn-primary group">
              {ctaLabel}
              <ForwardArrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
