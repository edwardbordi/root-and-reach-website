import Reveal from "../Reveal";
import Eyebrow from "../Eyebrow";

// "The usual way" vs. working with Cristina, as before / after rows: each old
// way sits beside its fix, so the section reads as a swap. The old way gets
// crossed out with the same tapered rust line as the hero's "scary" (drawn in
// as the card scrolls into view), then her side gets a rust check, row by row.
// Props-driven; the copy lives in the page. Keep each line short enough to
// sit on one line at desktop width.
export interface ScaryToEasyProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  beforeLabel: string;
  afterLabel: string;
  rows: { before: string; after: string }[];
  /** Closing line under the rows, e.g. "And it's actually fun. Really." */
  closing?: string;
  /** A word in the closing line that gets the hero's seafoam highlighter. */
  closingHighlight?: string;
}

/** An open circle ringed in the button's hover colors; its rust check draws
 *  in right after that row's cross-out (see .check-box in globals.css). */
function CheckBox() {
  return (
    <span aria-hidden="true" className="check-box">
      <svg viewBox="0 0 20 20" focusable="false">
        <path d="M5.4 10.4 L8.6 13.4 L14.8 7" pathLength={1} />
      </svg>
    </span>
  );
}

function Closing({ text, highlight }: { text: string; highlight?: string }) {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="scribble">{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
}

export default function ScaryToEasy({
  id,
  eyebrow,
  heading,
  beforeLabel,
  afterLabel,
  rows,
  closing,
  closingHighlight,
}: ScaryToEasyProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 md:py-24">
      {eyebrow && <Eyebrow tone="signal">{eyebrow}</Eyebrow>}
      <h2 className="font-display mt-5 max-w-3xl text-balance text-5xl leading-[0.98] text-ink sm:text-6xl">{heading}</h2>

      <Reveal className="mt-12">
        <div className="swap-card rounded-2xl bg-bone-2 px-6 py-7 md:px-10 md:py-9">
          {/* Column labels (desktop); on phones each row labels itself by order. */}
          <div className="hidden grid-cols-2 items-center gap-10 pb-4 md:grid">
            <p className="font-mono-label text-[0.72rem] text-slate">{beforeLabel}</p>
            <p className="font-mono-label text-[0.72rem] text-ink">{afterLabel}</p>
          </div>
          <ul>
            {rows.map((r, i) => (
              <li
                key={r.before}
                className="grid gap-2 border-t border-line py-4 text-[1.05rem] md:grid-cols-2 md:items-center md:gap-10 md:text-[1.1rem]"
                style={{ "--row": i } as React.CSSProperties}
              >
                <span className="text-slate">
                  <span className="sr-only">{beforeLabel}: </span>
                  <span className="strike">{r.before}</span>
                </span>
                <span className="flex items-center gap-3.5 text-ink">
                  <CheckBox />
                  <span>
                    <span className="sr-only">{afterLabel}: </span>
                    {r.after}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {closing && (
            <p className="border-t border-line pt-5 text-[1.05rem] font-medium text-ink md:text-[1.1rem]">
              <Closing text={closing} highlight={closingHighlight} />
            </p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
