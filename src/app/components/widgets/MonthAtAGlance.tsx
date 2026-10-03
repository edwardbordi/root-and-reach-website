import Link from "next/link";
import Reveal from "../Reveal";
import Eyebrow from "../Eyebrow";
import ForwardArrow from "../ForwardArrow";
import PhotoSlider, { type SlidePhoto } from "../PhotoSlider";

// "What a month with me looks like": a short list of what the client gets,
// beside a slider of real shoot photos (or a marked photo slot while there
// are none). Props-driven.
export interface MonthItem {
  title: string;
  body: React.ReactNode;
}

export interface MonthAtAGlanceProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  items: MonthItem[];
  note?: string;
  photoNeeds?: { label: string; detail: string };
  photos?: SlidePhoto[];
  ctaLabel?: string;
  ctaHref?: string;
}

export default function MonthAtAGlance({ id, eyebrow, heading, items, note, photoNeeds, photos, ctaLabel, ctaHref }: MonthAtAGlanceProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        {photos && photos.length > 0 ? (
          <Reveal className="order-last w-full max-w-md md:order-first">
            <PhotoSlider photos={photos} />
          </Reveal>
        ) : photoNeeds && (
          <Reveal className="order-last md:order-first">
            <div
              className="photo-slot aspect-[4/5] w-full max-w-md"
              data-needs={photoNeeds.label}
              data-needs-detail={photoNeeds.detail}
            >
              <span>Photo from one of Cristina&apos;s shoots</span>
            </div>
          </Reveal>
        )}
        <div className="min-w-0">
          {eyebrow && <Eyebrow tone="signal">{eyebrow}</Eyebrow>}
          <h2 className="font-display mt-5 text-balance text-5xl leading-[0.98] text-ink sm:text-6xl">{heading}</h2>
          <dl className="mt-10 flex flex-col">
            {items.map((it, i) => (
              <Reveal key={it.title} delay={i * 60}>
                <div className="grid gap-1 border-t border-line py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="font-mono-label whitespace-nowrap text-[0.78rem] text-signal-2">{it.title}</dt>
                  <dd className="wrap-balance leading-relaxed text-ink">{it.body}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
          {note && <p className="wrap-balance mt-6 border-t border-line pt-5 text-sm text-slate">{note}</p>}
          {ctaLabel && ctaHref && (
            <div className="mt-8">
              <Link href={ctaHref} className="btn-primary group">
                {ctaLabel}
                <ForwardArrow />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
