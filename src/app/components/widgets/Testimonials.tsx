import Reveal from "../Reveal";

// Client words. Renders real testimonials when there are any; until then, in
// the review build only, a marked placeholder so the gap is visible to
// Cristina instead of silently missing (OPEN-ITEM 4). Never invent quotes.
export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

export default function Testimonials({
  id,
  heading = "What clients say",
  items,
  placeholder,
}: {
  id?: string;
  heading?: string;
  items: Testimonial[];
  /** Shown only when there are no items — the ask, in plain words. */
  placeholder?: string;
}) {
  if (!items.length && !placeholder) return null;
  return (
    <section id={id} className="bg-blush on-color">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-display text-center text-5xl text-ink sm:text-6xl">{heading}</h2>
        {items.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t, i) => (
              <Reveal key={i}>
                <figure className="h-full rounded-2xl border-[1.5px] border-ink bg-paper p-6">
                  <blockquote className="leading-relaxed text-ink">“{t.quote}”</blockquote>
                  <figcaption className="font-mono-label mt-5 text-[0.7rem] text-slate">
                    {t.name}
                    {t.role ? ` · ${t.role}` : ""}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <div
            className="mx-auto mt-8 max-w-xl rounded-2xl border-[1.5px] border-dashed border-ink/60 p-8 text-center text-ink"
            data-needs="Client testimonials"
            data-needs-detail="Two or three clients' own words about working with Cristina, with their name, business and a yes to publish."
          >
            {placeholder}
          </div>
        )}
      </div>
    </section>
  );
}
