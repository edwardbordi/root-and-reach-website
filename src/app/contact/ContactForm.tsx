"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ForwardArrow from "../components/ForwardArrow";
import SiteBubble from "./SiteBubble";
import SocialTags, { MAX_SOCIALS } from "./SocialTags";
import { socialForCrm } from "../../lib/social";
import { formatPhone, isValidEmail, isValidMobile, LIMITS, SMS_CONSENT_TEXT } from "../../lib/contact";

/**
 * The Contact Cristina form. Posts to /api/contact, which creates the contact
 * in her GoHighLevel (the token never reaches this file — CRM.md § Phase 2).
 *
 * Validation matches realiiz.com's apply survey: email shape + a server-side
 * deliverability / "did you mean …?" check, US phone formatted live and 10
 * digits to pass, errors shown under each field on submit. SMS consent is an
 * unchecked box and never required (CRM.md § Phase 5).
 */

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  business: string;
  website: string;
  message: string;
};
type Errors = Partial<Record<keyof Fields, string>>;

/** The live website check (realiiz.com's apply-survey pattern). */
type SiteCheck = "checking" | { live: boolean; title?: string };

/** Page titles arrive raw from the HTML ("Tom &amp; Jerry"); decode for display. */
function decodeEntities(s: string): string {
  if (typeof document === "undefined") return s;
  const t = document.createElement("textarea");
  t.innerHTML = s;
  return t.value;
}

const EMPTY: Fields = { firstName: "", lastName: "", email: "", phone: "", business: "", website: "", message: "" };

const FIELD =
  "w-full rounded-xl border bg-paper px-4 py-3 text-base text-ink placeholder:text-slate/60 field-soft";
const LABEL = "font-mono-label mb-2 block text-[0.68rem] text-slate";
const ERROR_TEXT = "mt-1.5 text-sm text-signal-strong";

export default function ContactForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [consent, setConsent] = useState(false);
  const [fax, setFax] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  // "Did you mean …?" — the server's lookalike-domain guess.
  const [typoSuggestion, setTypoSuggestion] = useState<string | null>(null);
  const [emailFixedDomain, setEmailFixedDomain] = useState<string | null>(null);
  const [typoConfirmed, setTypoConfirmed] = useState(false);
  // Social accounts as tags; `socialDraft` is whatever is typed but not added yet.
  const [socials, setSocials] = useState<string[]>([]);
  const [socialDraft, setSocialDraft] = useState("");
  // Website: checked live as they type; "Is this your site?" bubble when found.
  const [siteCheck, setSiteCheck] = useState<SiteCheck | null>(null);
  const [siteAnswer, setSiteAnswer] = useState<"yes" | "no" | null>(null);
  const websiteRef = useRef("");

  useEffect(() => {
    const url = f.website.trim();
    websiteRef.current = url;
    // Wait until it looks like a domain (has a dot) before checking.
    if (!/^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(url)) {
      // Debounced input tracking: resetting derived request state, not a cascade.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSiteCheck(null);
      return;
    }
    setSiteCheck("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/check-site", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = (await res.json()) as { live?: boolean; title?: string };
        if (websiteRef.current !== url) return; // they kept typing
        setSiteCheck({ live: Boolean(data.live), title: typeof data.title === "string" ? decodeEntities(data.title) : undefined });
      } catch {
        if (websiteRef.current === url) setSiteCheck(null);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [f.website]);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  function validate(): Errors {
    const errs: Errors = {};
    if (!f.firstName.trim()) errs.firstName = "Please add your first name.";
    if (!f.lastName.trim()) errs.lastName = "Please add your last name.";
    if (!isValidEmail(f.email)) errs.email = "Please enter a valid email address.";
    if (!isValidMobile(f.phone)) errs.phone = "Please enter a valid phone number.";
    if (!f.business.trim()) errs.business = "Please add your business name.";
    if (!f.message.trim()) errs.message = "Tell me a little about what you're looking for.";
    return errs;
  }

  /** Swap the email's domain, keep the local part: "ed@gmial.com" → "ed@gmail.com". */
  function emailWithDomain(domain: string): string {
    const email = f.email.trim();
    return `${email.slice(0, email.lastIndexOf("@"))}@${domain}`;
  }

  function onEmailChange(value: string) {
    setF((prev) => ({ ...prev, email: value }));
    setTypoSuggestion(null);
    setEmailFixedDomain(null);
    setTypoConfirmed(false);
  }

  /** "Yes, use that": fix the field; they press Send themselves. */
  function acceptSuggestion() {
    if (!typoSuggestion) return;
    const fixed = emailWithDomain(typoSuggestion);
    setEmailFixedDomain(typoSuggestion);
    setTypoSuggestion(null);
    setF((prev) => ({ ...prev, email: fixed }));
  }

  /** "No, keep mine": they're the authority on their own address. */
  function keepMine() {
    setTypoConfirmed(true);
    setTypoSuggestion(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setFailed(false);
    if (Object.keys(errs).length > 0 || submitting) {
      const first = Object.keys(errs)[0];
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...f,
          email: f.email.trim(),
          // Anything still typed in the social field counts too.
          socials: [...socials, ...(socialDraft.trim() ? [socialDraft.trim()] : [])].slice(0, MAX_SOCIALS).map(socialForCrm),
          smsConsent: consent,
          websiteCheck:
            siteAnswer === "yes"
              ? "confirmed"
              : siteCheck && siteCheck !== "checking"
                ? siteCheck.live
                  ? "found"
                  : "not-reached"
                : "",
          emailTypoConfirmed: typoConfirmed,
          fax,
          pageUrl: window.location.href,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (res.status === 400) {
        const data = (await res.json().catch(() => null)) as { error?: string; reason?: string; suggestion?: string } | null;
        if (data?.error === "email") {
          if (data.reason === "likely-typo" && data.suggestion) {
            setTypoSuggestion(data.suggestion);
            setErrors((prev) => ({ ...prev, email: undefined }));
          } else if (data.reason === "undeliverable-domain") {
            setErrors((prev) => ({ ...prev, email: "That email's domain can't receive mail. Double-check it." }));
          } else {
            setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
          }
          document.getElementById("contact-email")?.focus();
          return;
        }
      }
      if (!res.ok) throw new Error(`contact ${res.status}`);
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div role="status" className="rounded-2xl border border-line bg-paper px-7 py-10 text-center sm:px-10">
        <p className="font-display text-5xl leading-none text-espresso">Got it. Thank you!</p>
        <p className="wrap-balance mx-auto mt-4 max-w-md text-lg leading-relaxed text-slate">
          Your message is on its way to me. I&apos;ll be in touch soon to set up a time to talk.
        </p>
        <Link href="/" className="btn-ghost group mt-8 inline-flex">
          Back to the home page
          <ForwardArrow />
        </Link>
      </div>
    );
  }

  const err = (k: keyof Fields) =>
    errors[k] ? (
      <p id={`err-${k}`} className={ERROR_TEXT}>
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Fields) => ({
    "aria-invalid": Boolean(errors[k]),
    "aria-describedby": errors[k] ? `err-${k}` : undefined,
  });
  const border = (k: keyof Fields) => (errors[k] ? "border-signal" : "border-line");

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line bg-bone p-6 sm:p-9">
      {/* Honeypot: hidden from people and screen readers; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-fax">Fax</label>
        <input id="contact-fax" name="fax" type="text" tabIndex={-1} autoComplete="off" value={fax} onChange={(e) => setFax(e.target.value)} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-firstName" className={LABEL}>First name</label>
          <input id="contact-firstName" name="firstName" autoComplete="given-name" maxLength={LIMITS.firstName} value={f.firstName} onChange={set("firstName")} {...aria("firstName")} className={`${FIELD} ${border("firstName")}`} />
          {err("firstName")}
        </div>
        <div>
          <label htmlFor="contact-lastName" className={LABEL}>Last name</label>
          <input id="contact-lastName" name="lastName" autoComplete="family-name" maxLength={LIMITS.lastName} value={f.lastName} onChange={set("lastName")} {...aria("lastName")} className={`${FIELD} ${border("lastName")}`} />
          {err("lastName")}
        </div>

        <div>
          <label htmlFor="contact-email" className={LABEL}>Email</label>
          <div className="relative">
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={LIMITS.email}
              value={f.email}
              onChange={(e) => onEmailChange(e.target.value)}
              {...aria("email")}
              className={`${FIELD} ${border("email")} ${emailFixedDomain && !typoSuggestion ? "pr-20" : ""}`}
            />
            {emailFixedDomain && !typoSuggestion && (
              <span role="status" className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-signal/10 px-2 py-0.5 text-[11px] font-semibold text-signal-strong">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Fixed
              </span>
            )}
          </div>
          {err("email")}
          {/* "Did you mean …?" is a guess, so it's a question, not an error. */}
          {typoSuggestion && (
            <div role="status" className="mt-2 rounded-xl border border-signal-light/60 bg-signal-light/10 p-3 text-[0.9rem] leading-snug">
              <p className="text-signal-strong">Check your email. Did you mean {emailWithDomain(typoSuggestion)}?</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={acceptSuggestion} className="rounded-full bg-signal px-3 py-1 text-[0.82rem] font-medium text-paper transition-colors hover:bg-signal-strong">
                  Yes, use that
                </button>
                <button type="button" onClick={keepMine} className="rounded-full border border-line bg-paper px-3 py-1 text-[0.82rem] font-medium text-slate transition-colors hover:border-slate hover:text-ink">
                  No, keep mine
                </button>
              </div>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="contact-phone" className={LABEL}>Phone</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="(555) 555-5555"
            maxLength={LIMITS.phone}
            value={f.phone}
            onChange={(e) => setF((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
            {...aria("phone")}
            className={`${FIELD} ${border("phone")}`}
          />
          {err("phone")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-business" className={LABEL}>Business name</label>
          <input id="contact-business" name="business" autoComplete="organization" maxLength={LIMITS.business} value={f.business} onChange={set("business")} {...aria("business")} className={`${FIELD} ${border("business")}`} />
          {err("business")}
        </div>

        <div>
          <label htmlFor="contact-website" className={LABEL}>
            Website <span className="text-slate normal-case tracking-normal">(optional)</span>
          </label>
          <div className="relative">
            <input
              id="contact-website"
              name="website"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="yourbusiness.com"
              maxLength={LIMITS.website}
              value={f.website}
              onChange={(e) => {
                setF((prev) => ({ ...prev, website: e.target.value }));
                setSiteAnswer(null);
              }}
              className={`${FIELD} border-line ${siteCheck === "checking" || siteAnswer === "yes" ? "pr-24" : ""}`}
            />
            {siteCheck === "checking" && (
              <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-bone-2 px-2.5 py-1 text-[11px] font-medium text-slate">
                <span aria-hidden="true" className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-line border-t-slate" />
                Checking…
              </span>
            )}
            {siteAnswer === "yes" && siteCheck !== "checking" && (
              <span role="status" className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-signal/10 px-2 py-0.5 text-[11px] font-semibold text-signal-strong">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                That&apos;s it
              </span>
            )}
          </div>
          {siteCheck && siteCheck !== "checking" && siteCheck.live && siteAnswer === null && (
            <SiteBubble url={f.website.trim()} title={siteCheck.title} onYes={() => setSiteAnswer("yes")} onNo={() => setSiteAnswer("no")} />
          )}
          {siteCheck && siteCheck !== "checking" && !siteCheck.live && (
            <p aria-live="polite" className="mt-1.5 whitespace-nowrap text-sm text-slate">
              Can&apos;t reach that one. Double-check it?
            </p>
          )}
          {siteAnswer === "no" && (
            <p aria-live="polite" className="mt-1.5 whitespace-nowrap text-sm text-slate">No problem, fix it above.</p>
          )}
        </div>
        <div>
          <label htmlFor="contact-social" className={LABEL}>
            Social media <span className="text-slate normal-case tracking-normal">(optional)</span>
          </label>
          <SocialTags id="contact-social" tags={socials} onChange={setSocials} pending={socialDraft} onPendingChange={setSocialDraft} maxLength={LIMITS.social} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={LABEL}>What are you looking for?</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={LIMITS.message}
            placeholder="Tell me about your business and the content you'd love to make."
            value={f.message}
            onChange={set("message")}
            {...aria("message")}
            className={`${FIELD} ${border("message")} resize-y`}
          />
          {err("message")}
        </div>
      </div>

      {/* A2P SMS consent: unchecked by default, never required to submit. */}
      <label className="mt-6 flex cursor-pointer items-start gap-3 text-[0.82rem] leading-relaxed text-slate">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-signal)]" />
        <span>
          {SMS_CONSENT_TEXT.split(" Privacy Policy:")[0]}{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">Privacy Policy</Link> ·{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-ink">Terms</Link>
        </span>
      </label>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={submitting} className="btn-primary group disabled:opacity-60">
          {submitting ? "Sending…" : "Send to Cristina"}
          {!submitting && <ForwardArrow />}
        </button>
        {failed && (
          <p role="alert" className="text-sm text-signal-strong">
            That didn&apos;t send. Please try again in a moment.
          </p>
        )}
      </div>
    </form>
  );
}
