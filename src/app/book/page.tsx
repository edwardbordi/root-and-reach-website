import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Eyebrow from "../components/Eyebrow";
import JsonLd from "../components/JsonLd";
import Scribble from "../components/Scribble";
import OutboundArrow from "../components/OutboundArrow";
import BookingEmbed from "./BookingEmbed";
import { buildPageMetadata, breadcrumbJsonLd } from "../../lib/seo";
import { SOCIAL_LINKS } from "../../lib/site-config";

export const metadata = buildPageMetadata({
  title: "Book a Call — Root & Reach Creative",
  description:
    "Book a call with Cristina Vann of Root & Reach Creative. Tell her about your business and what you'd love to make. No pressure, no script.",
  path: "/book",
  focusKeyword: "book a content shoot",
});

/* Booking: her HighLevel calendar, a 30-minute discovery call (embedded the
   same way as realiiz.com/book). Her channels sit underneath for anyone who'd
   rather say hi first. */
export default function BookPage() {
  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Book a call", path: "/book" }])} />
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-3xl px-6 pb-24 pt-20">
          <Reveal eager>
            <Eyebrow tone="signal">Book a call</Eyebrow>
          </Reveal>
          <Reveal eager delay={80}>
            <h1 className="font-display mt-6 text-balance text-6xl leading-[0.95] text-ink sm:text-7xl">
              Let&apos;s <Scribble text="talk." />
            </h1>
          </Reveal>
          <Reveal eager delay={140}>
            <p className="wrap-balance mt-6 max-w-xl text-lg leading-relaxed text-slate">
              Pick a time for a relaxed 30-minute call. Tell me about your business and what you&apos;d love to make. No
              pressure and no script. If it&apos;s a fit, we&apos;ll plan your first shoot together.
            </p>
          </Reveal>

          <Reveal eager delay={200}>
            <div className="mt-10">
              <BookingEmbed />
            </div>
          </Reveal>

          {SOCIAL_LINKS.length > 0 && (
            <div className="mt-10">
              <p className="font-mono-label text-[0.72rem] text-slate">Or say hi on</p>
              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="font-mono-label group inline-flex items-center gap-1.5 text-[0.85rem] text-ink transition-colors hover:text-signal">
                    {s.label}
                    <OutboundArrow />
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
