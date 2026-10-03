import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

export type LegalBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "contact"; name: string; lines: string[] };

// Bare domains/URLs are left as plain text (not auto-linked); write
// [text](/path) for a real link.
/** Inline formatting for legal copy: **bold** and [link text](/path).
 *  Internal paths use next/link; anything else opens as a normal link. */
function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(<strong key={`${keyBase}-b${i}`}>{m[1]}</strong>);
    } else if (m[3].startsWith("/")) {
      out.push(
        <Link key={`${keyBase}-l${i}`} href={m[3]} className="text-signal underline underline-offset-4 hover:text-signal-strong">
          {m[2]}
        </Link>,
      );
    } else {
      out.push(
        <a key={`${keyBase}-l${i}`} href={m[3]} className="text-signal underline underline-offset-4 hover:text-signal-strong">
          {m[2]}
        </a>,
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function BlockView({ block, idx }: { block: LegalBlock; idx: number }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "p":
      return <p>{renderInline(block.text, `p${idx}`)}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item, `p${idx}-li${i}`)}</li>
          ))}
        </ul>
      );
    case "contact":
      return (
        <p>
          <strong>{block.name}</strong>
          {block.lines.map((line, i) => (
            <Fragment key={i}>
              <br />
              {line}
            </Fragment>
          ))}
        </p>
      );
  }
}

export default function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  blocks,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  blocks: LegalBlock[];
}) {
  return (
    <>
      <Nav />
      <main id="main" className="flex-1">
        <article className="mx-auto max-w-[680px] px-6 pb-24 pt-16 sm:pt-24">
          <header className="border-b border-line pb-10">
            <div className="eyebrow flex items-center gap-2.5 text-signal">
              <span
                className="h-px w-6 bg-current opacity-50"
                aria-hidden="true"
              />
              {eyebrow}
            </div>
            <h1 className="font-display mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {title}
            </h1>
            <p className="font-mono-label mt-5 text-sm text-slate">
              Last updated: {lastUpdated}
            </p>
          </header>

          <div className="legal-prose mt-12">
            {blocks.map((block, idx) => (
              <BlockView key={idx} block={block} idx={idx} />
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
