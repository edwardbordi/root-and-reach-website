import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Eyebrow from "../components/Eyebrow";
import JsonLd from "../components/JsonLd";
import Scribble from "../components/Scribble";
import OutboundArrow from "../components/OutboundArrow";
import ContactForm from "./ContactForm";
import { buildPageMetadata, breadcrumbJsonLd } from "../../lib/seo";
import { SOCIAL_LINKS } from "../../lib/site-config";

export const metadata = buildPageMetadata({
  title: "Contact Cristina — Root & Reach Creative",
  description:
    "Get in touch with Cristina Vann of Root & Reach Creative. Tell her about your business and the content you'd love to make, and she'll reach out to set up a time to talk.",
  path: "/contact",
  focusKeyword: "content creator for small business contact",
});

/* Contact: a short form that lands in Cristina's GoHighLevel as a contact and
   notifies her (email + text) — it replaced the booking calendar 2026-10-06.
   Her channels sit underneath for anyone who'd rather say hi first. */
export default function ContactPage() {
  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact Cristina", path: "/contact" }])} />
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-3xl px-6 pb-24 pt-20">
          <Reveal eager>
            <Eyebrow tone="signal">Contact Cristina</Eyebrow>
          </Reveal>
          <Reveal eager delay={80}>
            <h1 className="font-display mt-6 text-balance text-6xl leading-[0.95] text-ink sm:text-7xl">
              Let&apos;s <Scribble text="talk." />
            </h1>
          </Reveal>
          <Reveal eager delay={140}>
            <p className="wrap-balance mt-6 max-w-xl text-lg leading-relaxed text-slate">
              Tell me about your business and what you&apos;d love to make. No pressure and no script. I&apos;ll reach
              out to set up a time to talk, and if it&apos;s a fit, we&apos;ll plan your first shoot together.
            </p>
          </Reveal>

          <Reveal eager delay={200}>
            <div className="mt-10">
              <ContactForm />
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
