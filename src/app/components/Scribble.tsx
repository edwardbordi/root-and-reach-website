/**
 * The seafoam highlighter swipe behind a highlighted word (styles: `.scribble`
 * in globals.css). Trailing punctuation sits outside the highlight, so "scary."
 * is highlighted behind SCARY and the period stays plain.
 *
 * `swap` adds the hover easter egg: hovering the headline (any ancestor with
 * `.swap-trigger`) draws a pencil line through the word that runs on toward
 * the swap word, which writes itself in. Desktop pointers only; both pieces are
 * aria-hidden, so the headline still reads as written.
 */
export default function Scribble({
  text,
  swap,
  swapNote,
  auto,
}: {
  /** The swap plays once on load and stays (the headline then reads as the swap). */
  auto?: boolean;
  text: string;
  swap?: string;
  /** Small handwritten words above the swap, so the sentence still reads right
   *  ("doesn't have to be ~~scary~~. should be fun!"). */
  swapNote?: string;
}) {
  const m = text.match(/^(.*?)([.,!?;:]*)$/);
  const word = m ? m[1] : text;
  const punct = m ? m[2] : "";
  return (
    <>
      <span className="scribble">
        {auto && swap ? <span aria-hidden="true">{word}</span> : word}
        {swap && (
          <>
            <span className="x-arrow" aria-hidden="true" />
            <span className="x-fun" aria-hidden={auto ? undefined : true}>
              {swapNote && <span className="x-note">{swapNote}</span>}
              {swap}
            </span>
          </>
        )}
      </span>
      {punct}
    </>
  );
}
