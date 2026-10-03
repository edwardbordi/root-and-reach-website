"use client";

import { useEffect, useState } from "react";
import { BOOKING_CALENDAR_ID } from "../../lib/site-config";

/**
 * Cristina's HighLevel (LeadConnector) booking calendar, embedded.
 * Same setup as realiiz.com's /book, minus that site's corner-bracket frame
 * (a Realiiz mark): here it sits in a soft rounded card in her colors. The
 * widget's own card border is removed in HighLevel's custom CSS.
 *
 * The calendar itself is styled in HighLevel to match the site:
 * background #F7F4EE, accent #A4501F.
 *
 * Why the script is injected on mount (from the Realiiz build): HighLevel's
 * form_embed.js sizes the iframe by scanning the page for embeds when it RUNS.
 * Loaded once with next/script, a client-side visit to /book never re-runs it,
 * so the calendar sits half-sized until a hard refresh. Re-injecting it on
 * mount re-runs the scan; the vendor's own guards make repeats safe.
 *
 * A spinner covers the reserved frame until the iframe loads (with a fallback
 * timer so it can never get stuck), so a slow calendar never reads as blank.
 */
const EMBED_SCRIPT_SRC = "https://link.msgsndr.com/js/form_embed.js";
const FRAME_RESERVE = "min-h-[760px] sm:min-h-[700px]";
const LOADING_FALLBACK_MS = 8000;

export default function BookingEmbed({ calendarId = BOOKING_CALENDAR_ID }: { calendarId?: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
    const fallback = window.setTimeout(() => setLoaded(true), LOADING_FALLBACK_MS);
    return () => {
      script.remove();
      window.clearTimeout(fallback);
    };
  }, [calendarId]);

  return (
    <div className="relative w-full rounded-[1.25rem] border border-line bg-bone p-3 sm:p-6">
      <div className={`relative ${FRAME_RESERVE}`}>
        <iframe
          key={calendarId}
          src={`https://api.leadconnectorhq.com/widget/booking/${calendarId}`}
          title="Book a discovery call with Cristina"
          scrolling="no"
          id="root-and-reach-booking-calendar"
          className="block w-full rounded-xl"
          onLoad={() => setLoaded(true)}
          style={{ width: "100%", minHeight: 400, border: "none", overflow: "hidden", background: "transparent", colorScheme: "light" }}
        />
        <div
          aria-hidden={loaded}
          className={`absolute inset-0 flex flex-col items-center justify-start gap-5 rounded-xl bg-bone pt-20 transition-opacity duration-500 ${
            loaded ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <span className="relative block h-12 w-12">
            <span className="absolute inset-0 block animate-spin rounded-full border-2 border-line border-t-signal motion-reduce:animate-none" />
            <svg className="absolute inset-0 m-auto h-5 w-5 text-signal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4.5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 2.5v4M16 2.5v4" />
            </svg>
          </span>
          <span className="eyebrow text-slate" role="status">
            Loading calendar…
          </span>
        </div>
      </div>
    </div>
  );
}
