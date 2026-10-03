import { keepLastWords } from "../../../lib/text";
import Image from "next/image";
import Reveal from "../Reveal";
import Eyebrow from "../Eyebrow";

// Cristina's "why", short form. The full story belongs on /about once she has
// approved it in her own words; until then `needs` marks it for her review.
export interface StoryTeaserProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  needs?: string;
  photoNeeds?: { label: string; detail: string };
  /** A real photo for the slot; when set it replaces the marked placeholder. */
  photo?: { src: string; alt: string; caption?: string };
}

export default function StoryTeaser({ id, eyebrow, heading, paragraphs, needs, photoNeeds, photo }: StoryTeaserProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="min-w-0" {...(needs ? { "data-needs": "Cristina to approve her story", "data-needs-detail": needs } : {})}>
          {eyebrow && <Eyebrow tone="signal">{eyebrow}</Eyebrow>}
          <h2 className="font-display mt-5 text-balance text-5xl leading-[0.98] text-ink sm:text-6xl">{heading}</h2>
          <div className="mt-8 flex max-w-[60ch] flex-col gap-5 text-lg leading-relaxed text-ink">
            {paragraphs.map((p) => (
              <p key={p}>{keepLastWords(p)}</p>
            ))}
          </div>
        </div>
        {photo ? (
          <Reveal className="w-full max-w-sm md:ml-auto">
            {/* Same framing as the shoot-photo slider: 4:5, rounded, ringed. */}
            <div className="photo-rings relative aspect-[4/5] w-full overflow-hidden rounded-[1.25rem] bg-blush">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 24rem, 90vw" className="object-cover" />
            </div>
            {photo.caption && (
              <p className="font-mono-label mt-5 text-center text-[0.68rem] text-slate">{photo.caption}</p>
            )}
          </Reveal>
        ) : photoNeeds && (
          <Reveal>
            <div
              className="photo-slot aspect-square w-full max-w-sm md:ml-auto"
              data-needs={photoNeeds.label}
              data-needs-detail={photoNeeds.detail}
            >
              <span>Photo of Cristina</span>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
