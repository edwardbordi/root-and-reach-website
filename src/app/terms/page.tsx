import LegalPage, { type LegalBlock } from "../components/LegalPage";
import { buildPageMetadata } from "../../lib/seo";
import { SITE_NAME, LEGAL_ENTITY, CONTACT_EMAIL } from "../../lib/site-config";

export const metadata = buildPageMetadata({
  title: `Terms of Service — ${SITE_NAME}`,
  description: `The terms governing your use of this site, operated by ${LEGAL_ENTITY}.`,
  path: "/terms",
  focusKeyword: "terms of service",
  noindex: true,
});

/* Based on realiiz.com's terms, rewritten for Root & Reach Creative Agency
   LLC (2026-10-03). Governing law assumes New Jersey (OPEN-ITEMS 20: confirm
   her LLC's home state). Contact comes from site-config.ts. */
const HOW_TO_REACH = CONTACT_EMAIL ? CONTACT_EMAIL : "the contact options on our [Book a Call page](/book)";

const BLOCKS: LegalBlock[] = [
  { type: "h2", text: "Overview" },
  {
    type: "p",
    text: `${LEGAL_ENTITY} operates this website (the "Site"). Throughout the Site, the terms "we," "us," and "our" refer to ${LEGAL_ENTITY}, doing business as ${SITE_NAME}. By accessing or using the Site, or by booking our services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Site or our services.`,
  },
  {
    type: "p",
    text: "We may update these Terms from time to time. The most current version is always posted on this page, and your continued use of the Site after changes are posted means you accept those changes.",
  },

  { type: "h2", text: "1. Who We Are and What We Provide" },
  {
    type: "p",
    text: `${SITE_NAME} creates photo and video content for small businesses, including planning, shoots, and editing, and brings in a network of creative partners (such as venues, models, videographers, and designers) when a project calls for it. The Site itself is informational: it describes our services, shares content, and lets visitors book a call or contact us. We do not sell products through the Site.`,
  },
  {
    type: "p",
    text: "The specific scope, deliverables, schedule, fees, and terms of any project are agreed with you separately before work begins. If those agreed terms conflict with these Terms, the agreed terms control for that project.",
  },

  { type: "h2", text: "2. Use of the Site" },
  { type: "p", text: "You agree to use the Site only for lawful purposes. You may not:" },
  {
    type: "ul",
    items: [
      "Use the Site in any way that violates applicable law or regulation;",
      "Attempt to gain unauthorized access to any part of the Site, its systems, or its networks;",
      "Introduce viruses, malware, or other harmful code;",
      "Scrape, harvest, or collect information about other users;",
      "Use the Site to harass, abuse, defame, or harm others;",
      "Interfere with or get around the security or operation of the Site.",
    ],
  },
  {
    type: "p",
    text: "We may restrict or end access to the Site for anyone who violates these Terms.",
  },

  { type: "h2", text: "3. Intellectual Property" },
  {
    type: "p",
    text: `The content on the Site, including text, design, graphics, logos, photos, and video, is owned by ${LEGAL_ENTITY}, our clients, or our licensors, and is protected by intellectual property laws. You may not copy, reproduce, distribute, or create derivative works from Site content without written permission.`,
  },
  {
    type: "p",
    text: "Rights to the photos and video we create for clients, and how they may be used, are covered by the terms agreed for each project.",
  },

  { type: "h2", text: "4. Submissions and Feedback" },
  {
    type: "p",
    text: "If you send us ideas, suggestions, feedback, or other materials, through the Site, by email, or otherwise, you agree that we may use them without restriction or compensation, and without any obligation to keep them confidential. You represent that anything you send does not violate the rights of any third party.",
  },

  { type: "h2", text: "5. Third-Party Links and Tools" },
  {
    type: "p",
    text: "The Site may link to or include third-party websites, services, or tools that we do not control, such as social media platforms and our booking calendar. We provide these for convenience and are not responsible for their content, accuracy, or practices. Your use of any third-party service is subject to that service's own terms and policies, and is at your own risk.",
  },

  { type: "h2", text: "6. No Warranties" },
  {
    type: "p",
    text: 'The Site and its content are provided "as is" and "as available," without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Site will be uninterrupted, secure, or error-free, or that information on it is accurate, complete, or current. Any reliance on Site content is at your own risk.',
  },
  {
    type: "p",
    text: "This section covers the Site. Any commitments about services we perform for clients are covered by the terms agreed for each project.",
  },

  { type: "h2", text: "7. Limitation of Liability" },
  {
    type: "p",
    text: `To the fullest extent permitted by law, ${LEGAL_ENTITY} and its members, employees, contractors, and agents will not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, lost revenue, or lost data, arising from your use of, or inability to use, the Site, even if advised of the possibility of such damages. Where liability cannot be excluded, it is limited to the maximum extent permitted by applicable law.`,
  },

  { type: "h2", text: "8. Indemnification" },
  {
    type: "p",
    text: `You agree to indemnify and hold harmless ${LEGAL_ENTITY} and its members, employees, contractors, and agents from any claim or demand, including reasonable attorneys' fees, arising from your breach of these Terms or your violation of any law or third-party right.`,
  },

  { type: "h2", text: "9. Governing Law" },
  {
    type: "p",
    text: "These Terms are governed by the laws of the State of New Jersey, without regard to its conflict-of-law principles. Any dispute arising from these Terms or use of the Site will be subject to the jurisdiction of the state and federal courts located in New Jersey.",
  },

  { type: "h2", text: "10. Severability and Entire Agreement" },
  {
    type: "p",
    text: "If any provision of these Terms is found unenforceable, the remaining provisions remain in full effect. These Terms, together with any policies posted on the Site and any terms agreed for a specific project, are the entire agreement between you and us regarding the Site.",
  },

  { type: "h2", text: "11. SMS / Text Messaging" },
  {
    type: "p",
    text: `${SITE_NAME} may send appointment-related text messages, such as booking confirmations and reminders, to people who opt in when they book a call. This is not a marketing program; messages are sent only to people who have opted in.`,
  },
  {
    type: "p",
    text: "**Message frequency** varies with your bookings. **Message and data rates may apply.**",
  },
  {
    type: "p",
    text: `For help, reply **HELP** or contact us at ${HOW_TO_REACH}. To stop receiving messages, reply **STOP** at any time. After replying STOP, you will no longer receive text messages from us.`,
  },
  { type: "p", text: "Carriers are not liable for delayed or undelivered messages." },

  { type: "h2", text: "12. Contact" },
  { type: "p", text: `Questions about these Terms can be sent to ${HOW_TO_REACH}.` },
  { type: "contact", name: LEGAL_ENTITY, lines: ["United States"] },
];

export default function TermsPage() {
  return <LegalPage eyebrow="Legal" title="Terms of Service" lastUpdated="October 3, 2026" blocks={BLOCKS} />;
}
