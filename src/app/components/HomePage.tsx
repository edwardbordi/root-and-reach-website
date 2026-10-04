import Nav from "./Nav";
import Footer from "./Footer";
import JsonLd from "./JsonLd";
import Hero from "./widgets/Hero";
import ScaryToEasy from "./widgets/ScaryToEasy";
import FourCs from "./widgets/FourCs";
import MonthAtAGlance from "./widgets/MonthAtAGlance";
import ReviewWall from "./widgets/ReviewWall";
import NetworkGrid from "./widgets/NetworkGrid";
import StoryTeaser from "./widgets/StoryTeaser";
import SocialBand from "./widgets/SocialBand";
import BookCallBand from "./widgets/BookCallBand";
import SectionRail from "./SectionRail";
import { webSiteJsonLd, serviceJsonLd } from "../../lib/seo";
import { SOCIAL_LINKS } from "../../lib/site-config";
import { REVIEWS, REVIEW_THEMES, REVIEW_SNAPSHOT } from "../../lib/reviews";
import Term from "./Term";
import { GLOSSARY } from "../../lib/glossary";

/* The home page body, shared by "/" (animated portrait) and "/still" (the
   original still portrait) while Cristina compares them. Home — first draft, 2026-10-02.
   Every claim traces to design-process/CLIENT-FACTS.md. Anything still owed
   by Cristina carries data-needs (OPEN-ITEMS 3–6), so the review kit's
   "Show what we still need" lists it. Pricing is deliberately absent until
   she decides whether it goes on the site (OPEN-ITEM 8). */


const HANDLES: Record<string, string> = {
  Instagram: "@cristina_creative_",
  TikTok: "@cristina_creative_",
};

// Right-side dot menu (desktop). ids match the section anchors below.
const RAIL_SECTIONS = [
  { id: "top", label: "Top" },
  { id: "why", label: "Why it works" },
  { id: "four-cs", label: "My 4 Cs" },
  { id: "what-you-get", label: "What you get" },
  { id: "clients", label: "Reviews" },
  { id: "network", label: "The network" },
  { id: "story", label: "My story" },
  { id: "follow", label: "Follow along" },
  { id: "book", label: "Book a call" },
];

/** Headline override for a home version (the animated one says it positively). */
export type HeroTitle = { lead: string; highlight: string; swap?: string; swapNote?: string; auto?: boolean };

export default function HomePage({ portrait, title }: { portrait?: React.ReactNode; title?: HeroTitle } = {}) {
  return (
    <>
      <Nav />
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd
        data={serviceJsonLd({
          name: "Content creation for small businesses",
          description:
            "Monthly half-day photo and video shoots for small businesses, with optional editing into ready-to-post content.",
          path: "/",
        })}
      />
      <SectionRail sections={RAIL_SECTIONS} />
      <main id="main" className="flex-1">
        <Hero
          id="top"
          portrait={portrait}
          eyebrow={
            <>
              Content creation<span className="hidden sm:inline"> for small businesses</span>
            </>
          }
          titleLead={title?.lead ?? "Being on camera can be"}
          titleHighlight={title?.highlight ?? "scary"}
          titleSwap={title ? title.swap : "fun."}
          titleSwapNote={title?.swapNote}
          titleSwapAuto={title ? title.auto : true}
          subtitle={
            <>
              I&apos;m Cristina, a <Term definition={GLOSSARY.creativePartner}>creative partner</Term> for small
              businesses. I take the part you&apos;ve been dreading and make it fun, comfortable and easy, then hand you
              photos and video that look like you at your best.
            </>
          }
          ctaLabel="Book a call"
          ctaHref="/book"
          secondaryLabel="How it works"
          secondaryHref="#four-cs"
          tagline="Strategy with style, content with heart."
        />

        <ScaryToEasy
          id="why"
          eyebrow="Why it works"
          heading="Content creation usually feels cold. It doesn't have to."
          beforeLabel="The usual way"
          afterLabel="Working with me"
          rows={[
            { before: "A script that doesn't sound like you.", after: "Your message, shaped together." },
            { before: "Feeling judged the second the camera's on.", after: "Comfortable, so you look like you." },
            {
              before: "A folder of files and no idea what's next.",
              after: (
                <>
                  You leave more confident<span className="hidden sm:inline"> than you came</span>.
                </>
              ),
            },
          ]}
          closing="And it's actually fun. Really."
          closingHighlight="fun"
        />

        <FourCs
          id="four-cs"
          eyebrow={
            /* Eyebrows are all caps and widely spaced; keep the plural "s"
               lowercase and tucked against its C so it reads "4 Cs", not "4 CS".
               One wrapping span: Eyebrow is a flex row, and loose pieces
               would each get its gap. */
            <span>
              My 4 <span className="tracking-[0.03em]">C</span>
              <span className="normal-case">s</span>
            </span>
          }
          heading="Connect. Collab. Create. Consistently."
          intro="Every client goes through the same four steps, from our first call to the content that keeps showing up, month after month."
          steps={[
            {
              word: "Connect",
              body: "We start with a conversation. I get to know you, your business, and what makes you nervous about being on camera.",
            },
            {
              word: "Collab",
              body: "We plan it together. You're my creative partner, not my subject, and the message stays yours.",
            },
            {
              word: "Create",
              body: (
                <>
                  <Term definition={GLOSSARY.halfDayShoot}>A half-day shoot</Term>. I bring whoever we need, from the
                  venue and models to a videographer, and I keep it fun.
                </>
              ),
            },
            {
              word: "Consistently",
              body: "Once a month we do it again, so you always have fresh, authentic content for your business.",
            },
          ]}
          needs="Cristina's own description of each step, from the first call on, and what clients worry about at each one. These four are placeholders written from the kickoff meeting."
        />

        <MonthAtAGlance
          id="what-you-get"
          eyebrow="What you get"
          heading="One shoot a month. Everything else, handled."
          items={[
            {
              title: "The shoot",
              body: (
                <>
                  A <Term definition={GLOSSARY.halfDayShoot}>half-day, four-hour shoot</Term> each month, planned together
                  and made comfortable.
                </>
              ),
            },
            {
              title: "Your content",
              body: (
                <>
                  Your photos and video, <Term definition={GLOSSARY.raw}>raw</Term> or edited, delivered on time and ready
                  to use however you like.
                </>
              ),
            },
            {
              title: "Optional editing",
              body: (
                <>
                  Want <Term definition={GLOSSARY.finishedCuts}>finished cuts</Term> ready to post? We agree on what&apos;s
                  needed, and the price, before I start.
                </>
              ),
            },
            {
              title: "Your accounts",
              body: (
                <>
                  Your social accounts stay yours, and I&apos;ll show you how to get more out of them. Want more{" "}
                  <Term definition={GLOSSARY.handsOnHelp}>hands-on help</Term> than that? Let&apos;s talk it through and
                  find what makes sense for you.
                </>
              ),
            },
          ]}
          /* Preview set: Ed's picks from Cristina's Facebook, 2026-10-03.
             Captions say what each photo captures; swap freely. */
          photos={[
            { src: "/work/two-women.webp", caption: "Real people, real joy", alt: "Two women laugh together over cocktails and dessert at an outdoor table." },
            { src: "/work/feet.webp", caption: "Fun is the brand", alt: "Black-and-white photo of three women lying on a sofa with their legs up the wall in white socks." },
            { src: "/work/traintracks.webp", caption: "The vibe, captured", alt: "A group of women in vintage-inspired autumn outfits sit together on railroad tracks." },
            { src: "/work/steps.webp", caption: "Style with a story", alt: "Women in long skirts and hats pose on a rustic wooden staircase among fall trees." },
            { src: "/work/bar.webp", caption: "Put a face to the place", alt: "A smiling bartender leans on a polished bar, bottles and glassware behind him." },
            { src: "/work/art.webp", caption: "Show the experience", alt: "A live artist sketches a portrait of a woman posing in a purple-lit studio." },
            { src: "/work/carusos.webp", caption: "Make them want to be there", alt: "Two cocktails and a candle on a table beside a restaurant menu." },
          ]}
          photoNeeds={{
            label: "A photo from one of your shoots",
            detail: "Behind the scenes at a real client shoot, you and the client together if possible. Portrait orientation.",
          }}
          ctaLabel="Book a call"
          ctaHref="/book"
        />

        <ReviewWall
          id="clients"
          eyebrow="Kind words"
          heading="Five-star reviews. Not one scary shoot."
          themes={REVIEW_THEMES}
          reviews={REVIEWS}
          rating={REVIEW_SNAPSHOT.rating}
          url={REVIEW_SNAPSHOT.url}
        />

        <NetworkGrid
          id="network"
          eyebrow="The network"
          heading="One call. The whole creative team."
          intro="I bring everyone to the table. Use my people, bring your own, or mix the two. Either way, I pull it together so you don't have to."
          roles={[
            { role: "Strategy", icon: "strategy", body: "A plan for what to make and why, built around your business." },
            { role: "Venues", icon: "venues", body: "The right place to shoot, found and booked." },
            { role: "Models", icon: "models", body: "Faces for your brand, when the shoot calls for them." },
            { role: "Videographers", icon: "video", body: "More cameras and hands when the shoot gets bigger." },
            { role: "Web designers", icon: "web", body: "A home online for everything we make." },
            { role: "Graphic designers", icon: "graphics", body: "Graphics and design work to go with your content." },
          ]}
          closing={
            <>
              A <Term definition={GLOSSARY.oneStopShop}>one-stop shop</Term> for creative, with one person you trust in
              the middle of it.
            </>
          }
          /* From her Google reviews (src/lib/reviews.ts), trimmed with "…". */
          quote={{
            text: "Cristina and her team is amazing to work with! She wants us all to win…",
            name: "Ciara C. · Google review",
          }}
          needs="For each person in Cristina's network: name, what they do, a link, and a yes to being named. Until then, roles only."
        />

        <StoryTeaser
          id="story"
          eyebrow="Why small business"
          heading="Small business is in my blood."
          paragraphs={[
            "My parents came from Italy with very little, before I was born, and both of them started small businesses. Scrappy survivors. I spent time in Italy as a little girl, and I've been back many times since.",
            "That's where my heart for small business comes from. I love working with entrepreneurs who have an idea and the passion to chase it, people who are in it for more than the bottom line. Not big boxes. People.",
          ]}
          needs="Cristina to read and approve this in her own words, including how she wants to describe her time in Italy."
          /* Preview: Cristina with two people from one of her shoots (from Ed,
             2026-10-03). OPEN-ITEMS 19: their OK, and Cristina's. */
          photo={{
            src: "/work/cristina-with-crew.webp",
            alt: "Cristina Vann, smiling in the middle, with two women from one of her shoots in a brick-walled studio.",
            caption: "At one of my shoots",
          }}
          photoNeeds={{
            label: "A portrait of Cristina",
            detail: "A natural, smiling photo of you. You're the face of the brand. Square or portrait orientation.",
          }}
        />

        <SocialBand
          id="follow"
          eyebrow="Follow along"
          heading="See what we've been making."
          body="Behind the scenes and finished work from real shoots."
          links={SOCIAL_LINKS.map((s) => ({ ...s, handle: HANDLES[s.label] }))}
        />

        <BookCallBand
          id="book"
          heading="Ready when you are."
          body="Book a call and tell me about your business. No pressure and no script, just a conversation about what we could make together."
          ctaLabel="Book a call"
          ctaHref="/book"
        />
      </main>
      <Footer />
    </>
  );
}
