import Link from "next/link";
import Image from "next/image";
import Reveal from "../Reveal";
import Eyebrow from "../Eyebrow";
import ForwardArrow from "../ForwardArrow";
import Scribble from "../Scribble";

// Home hero: Cristina's line-drawn portrait beside the promise. Props-driven —
// the copy lives in the page. The portrait is her own logo illustration, so
// there's no stock image here; her real photo slot sits in the section below.
// Kept deliberately calm: color lives only in the underline, the button and
// her portrait. Everything else is espresso or neutral.
export interface HeroProps {
  id?: string;
  eyebrow?: string;
  /** Plain text before the highlighted words */
  titleLead: string;
  /** The words that get the hand-drawn underline */
  titleHighlight: string;
  titleTail?: string;
  /** Hover easter egg: crosses out the highlighted word and writes this in. */
  titleSwap?: string;
  /** Small handwritten note above the swap word. */
  titleSwapNote?: string;
  subtitle?: React.ReactNode;
  tagline?: string;
  /** Handwritten sign-off under the tagline (her first name). */
  taglineSign?: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function Hero({
  id,
  eyebrow,
  titleLead,
  titleHighlight,
  titleTail,
  titleSwap,
  titleSwapNote,
  subtitle,
  tagline,
  taglineSign,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: HeroProps) {
  // Two rows on desktop so the buttons and her tagline share one line:
  // row 1 = words | portrait, row 2 = buttons | tagline. On phones it stacks
  // words, buttons, portrait, tagline.
  return (
    <section id={id} className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-8 px-6 pb-16 pt-14 md:grid-cols-[1.15fr_0.85fr] md:pb-24 md:pt-20">
        <div className="min-w-0 md:col-start-1 md:row-start-1 md:self-center">
          {eyebrow && (
            <Reveal eager>
              <Eyebrow tone="slate">{eyebrow}</Eyebrow>
            </Reveal>
          )}
          <Reveal eager delay={80}>
            <h1 className="swap-trigger font-display mt-6 w-fit text-balance text-[3.4rem] leading-[0.95] text-espresso sm:text-7xl lg:text-[5.6rem]">
              {titleLead} <Scribble text={titleHighlight} swap={titleSwap} swapNote={titleSwapNote} />
              {titleTail ? ` ${titleTail}` : null}
            </h1>
          </Reveal>
          {subtitle && (
            <Reveal eager delay={140}>
              <p className="wrap-balance mt-7 max-w-xl text-lg leading-relaxed text-slate">{subtitle}</p>
            </Reveal>
          )}
        </div>

        <Reveal eager delay={200} className="md:col-start-1 md:row-start-2 md:self-center">
          <div className="flex flex-wrap items-center gap-3">
            <Link href={ctaHref} className="btn-primary group">
              {ctaLabel}
              <ForwardArrow />
            </Link>
            {secondaryLabel && secondaryHref && (
              <Link href={secondaryHref} className="btn-ghost group">
                {secondaryLabel}
                <ForwardArrow />
              </Link>
            )}
          </div>
        </Reveal>

        {/* Her portrait, with a soft fill cut to the shape of her face baked
            into the image (cristina-portrait-face.webp) so her colors lead. */}
        <Reveal eager delay={120} className="relative mx-auto w-full max-w-[26rem] md:col-start-2 md:row-start-1 md:self-center">
          <Image
            src="/logos/cristina-portrait-face.webp"
            alt="Line drawing of Cristina Vann in black glasses, one lens filled with a 70s swirl, flowers in her hair"
            width={900}
            height={900}
            priority
            sizes="(min-width: 768px) 26rem, 80vw"
            className="h-auto w-full"
          />
        </Reveal>

        {/* Her own line, signed under her portrait like a caption, on the
            same line as the buttons. */}
        {tagline && (
          <Reveal eager delay={260} className="mx-auto w-full max-w-[26rem] md:col-start-2 md:row-start-2 md:self-center">
            <div className="pr-[26%] text-center">
              <div>
                <p className="font-mono-label whitespace-pre-line text-[0.6rem] leading-relaxed text-slate">
                  {tagline.replace(/,\s*/, ",\n")}
                </p>
                {taglineSign && (
                  <p className="signature -mt-0.5" aria-label={`— ${taglineSign}`}>
                    <span aria-hidden="true">
                      &mdash;&nbsp;<span className="signature-cap">{taglineSign.charAt(0)}</span>
                      {taglineSign.slice(1)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
