import LegalPage, { type LegalBlock } from "../components/LegalPage";
import { buildPageMetadata } from "../../lib/seo";
import { SITE_NAME, LEGAL_ENTITY, CONTACT_EMAIL } from "../../lib/site-config";

export const metadata = buildPageMetadata({
  title: `Privacy Policy — ${SITE_NAME}`,
  description: `How ${LEGAL_ENTITY} collects and uses information on this site, and the choices you have.`,
  path: "/privacy",
  focusKeyword: "privacy policy",
  noindex: true,
});

/* Based on realiiz.com's privacy policy, rewritten for Root & Reach Creative
   Agency LLC (2026-10-03). Facts still open (her business address, email,
   domain) come from site-config.ts, so they update everywhere at once:
   OPEN-ITEMS 2 and 7. */
const HOW_TO_REACH = CONTACT_EMAIL
  ? `email ${CONTACT_EMAIL}`
  : "use the form on our [Contact page](/contact)";

const BLOCKS: LegalBlock[] = [
  {
    type: "p",
    text: `${LEGAL_ENTITY} ("we," "us," "our"), doing business as ${SITE_NAME}, operates this website (the "Site"). This Privacy Policy explains what information we collect when you visit the Site or contact us, how we use it, and the choices you have.`,
  },

  { type: "h2", text: "Information We Collect" },
  {
    type: "p",
    text: "**Information you give us.** When you fill in our contact form or otherwise communicate with us, we collect the information you provide: typically your name, email address, phone number, business name, website, social media handle, and anything you tell us about your business or project.",
  },
  {
    type: "p",
    text: "**Information collected automatically.** When you visit the Site, we automatically collect certain technical information about your device and visit, including your IP address, browser type, device type, referring pages, the pages you view, and how you interact with the Site. We collect this using cookies, log files, and similar technologies.",
  },
  {
    type: "p",
    text: "We do not sell products through the Site and do not collect payment card information through the Site. Payment for client work is handled separately, under the terms agreed for that work.",
  },

  { type: "h2", text: "How We Use Your Information" },
  { type: "p", text: "We use the information we collect to:" },
  {
    type: "ul",
    items: [
      "Respond to your inquiries, schedule calls, and provide the services you request;",
      "Plan and deliver photo and video shoots and the content we create for you;",
      "Operate, maintain, and improve the Site;",
      "Understand how visitors use the Site;",
      "Communicate with you about our services, where you have agreed to hear from us;",
      "Protect the Site and our business against fraud, abuse, and security risks;",
      "Comply with legal obligations.",
    ],
  },

  { type: "h2", text: "Photos and Video on the Site" },
  {
    type: "p",
    text: "The Site shows photos and video from real shoots, including clients, their teams, and models. We feature people only with their permission. If you appear on the Site and would like an image removed, contact us and we will take it down.",
  },

  { type: "h2", text: "Reviews" },
  {
    type: "p",
    text: "The Site quotes public reviews left for our business on Google. We show the reviewer's first name and last initial, and any business name they mentioned. If you left a review and would rather it not appear on the Site, contact us and we will remove it.",
  },

  { type: "h2", text: "Cookies and Analytics" },
  {
    type: "p",
    text: "We use cookies and similar technologies to operate the Site and to understand how visitors use it. You can control or disable cookies through your browser settings, though some features of the Site may not work properly without them. Learn more about cookies at allaboutcookies.org.",
  },
  {
    type: "p",
    text: "If we use third-party analytics or advertising services (such as Google or Meta), those providers may collect information through cookies and pixels under their own privacy policies. You can opt out of certain analytics and targeted advertising:",
  },
  {
    type: "ul",
    items: [
      "Google Analytics opt-out: tools.google.com/dlpage/gaoptout",
      "Google Ads settings: google.com/settings/ads",
      "Meta/Facebook ad settings: facebook.com/settings/?tab=ads",
      "Industry opt-out portal: optout.aboutads.info",
    ],
  },

  { type: "h2", text: "Our Contact Form" },
  {
    type: "p",
    text: "When you send our contact form, the details you enter are stored in our customer relationship management system, provided by a third party (HighLevel / LeadConnector), so we can reply to you and keep track of our conversation. That service processes them under its own privacy policy.",
  },

  { type: "h2", text: "How We Share Information" },
  { type: "p", text: "We do not sell your personal information. We share it only:" },
  {
    type: "ul",
    items: [
      "With service providers who help us run the Site and our business (such as hosting, scheduling, email, and analytics providers), under obligations to protect it;",
      "With members of our creative network (such as a videographer or venue) when it is needed to plan or deliver a shoot you have booked;",
      "When required to comply with law, a subpoena, or a lawful request, or to protect our legal rights;",
      "In connection with a business transfer (such as a merger or acquisition), subject to this Policy.",
    ],
  },

  { type: "h2", text: "Data Retention" },
  {
    type: "p",
    text: "We keep personal information for as long as needed to fulfill the purposes described in this Policy, to maintain our business records, and to comply with legal obligations. You may ask us to delete information we hold about you, and we will do so unless we are required to keep it.",
  },

  { type: "h2", text: "Your Choices and Rights" },
  { type: "p", text: "You may:" },
  {
    type: "ul",
    items: [
      "Ask us what personal information we hold about you;",
      "Ask us to correct or delete your personal information;",
      "Unsubscribe from marketing emails at any time using the link in those emails.",
    ],
  },
  {
    type: "p",
    text: "Depending on where you live, you may have additional rights under privacy laws (such as the CCPA for California residents, or the GDPR for residents of the European Economic Area), including rights to access, correct, delete, or restrict the use of your personal information. To exercise any of these, contact us using the details below. If you are outside the United States, your information will be processed in the United States.",
  },

  { type: "h2", text: "Do Not Track" },
  { type: "p", text: 'The Site does not currently respond to browser "Do Not Track" signals.' },

  { type: "h2", text: "Children's Privacy" },
  {
    type: "p",
    text: "The Site is not directed to children under 16, and we do not knowingly collect personal information from them.",
  },

  { type: "h2", text: "SMS Messaging" },
  {
    type: "p",
    text: "If you provide a phone number on our contact form and agree to receive texts, we use it only to send messages about your inquiry, such as replies, appointment confirmations and reminders. This information is not sold, rented, or used for third-party marketing. You can opt out at any time by replying STOP, or reply HELP for help.",
  },
  {
    type: "p",
    text: "**No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.** SMS opt-in data and consent are never shared with any third party.",
  },

  { type: "h2", text: "Changes to This Policy" },
  {
    type: "p",
    text: 'We may update this Privacy Policy from time to time. The current version is always posted on this page with its "last updated" date.',
  },

  { type: "h2", text: "Contact Us" },
  { type: "p", text: `For privacy questions or requests, ${HOW_TO_REACH}.` },
  { type: "contact", name: LEGAL_ENTITY, lines: ["United States"] },
];

export default function PrivacyPage() {
  return <LegalPage eyebrow="Legal" title="Privacy Policy" lastUpdated="October 6, 2026" blocks={BLOCKS} />;
}
