import { LEGAL_ENTITY, SITE_NAME, SITE_URL } from "./site-config";

/**
 * The Contact Cristina form: field rules shared by the form (client) and
 * /api/contact (server). Safe to import anywhere — no secrets in here.
 *
 * Email and phone checks are realiiz.com's (the /websites apply survey), on
 * purpose, so every site behaves the same:
 *   • email: a permissive shape check here; the server then asks whether the
 *     domain can receive mail and whether it looks like a typo of a common
 *     provider (lib/email.ts), and the form offers "Did you mean …?"
 *   • phone: US, formatted live as (xxx) xxx-xxxx, 10 digits to pass.
 */

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function isValidMobile(v: string): boolean {
  return v.replace(/\D/g, "").length === 10;
}

/** Live-format a US phone number as (xxx) xxx-xxxx while typing. */
export function formatPhone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** Max lengths, enforced by the inputs and again by the server. */
export const LIMITS = {
  firstName: 120,
  lastName: 120,
  email: 254,
  phone: 30,
  business: 200,
  website: 300,
  social: 300,
  message: 2000,
} as const;

const host = (() => {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "";
  }
})();

/**
 * A2P 10DLC SMS consent, shown beside an UNCHECKED box that is NOT required to
 * submit (CRM.md § Phase 5). It names the brand and the legal entity, the
 * message types, frequency, rates, STOP and HELP, and links Privacy and Terms.
 * The note on every contact records this exact text, so it must match what
 * the page shows — and any HighLevel form that texts these contacts must use
 * identical wording.
 */
export const SMS_CONSENT_TEXT = `I agree to receive text messages about my inquiry, including appointment confirmations and reminders, from ${SITE_NAME} — a ${LEGAL_ENTITY} brand — at the phone number provided. Message frequency varies. Message & data rates may apply. Reply STOP to opt out or HELP for help. Privacy Policy: ${host}/privacy · Terms: ${host}/terms`;

/** CRM tags (CRM.md § 3.5). Renaming a live tag empties every list and
    workflow built on it — don't, without migrating the contacts. */
export const CONTACT_TAGS = {
  provenance: "via-website",
  outcome: "contact-enquiry",
} as const;
