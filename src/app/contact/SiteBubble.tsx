"use client";

import { useEffect, useState } from "react";

/**
 * "Is this your site?" — the little card under the contact form's Website
 * field, after /api/check-site finds the address live. Same idea as the
 * realiiz.com apply survey: the page title straight away, then a screenshot of
 * their homepage from WordPress's public mShots renderer (keyless; the first
 * request for a domain takes a few seconds to generate, so it retries on a
 * timer and swaps in when the real shot lands). Purely a delight layer: if the
 * screenshot fails it just doesn't show, and nothing here blocks sending.
 * Styled like the site's tooltips: espresso bubble, three-band border.
 */
export default function SiteBubble({
  url,
  title,
  onYes,
  onNo,
}: {
  url: string;
  title?: string;
  onYes: () => void;
  onNo: () => void;
}) {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (loaded || failed) return;
    const timer = setInterval(() => {
      setAttempt((a) => {
        if (a >= 6) {
          clearInterval(timer);
          return a;
        }
        return a + 1;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [url, loaded, failed]);

  const target = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const src = `https://s0.wp.com/mshots/v1/${encodeURIComponent(target)}?w=640&r=${attempt}`;
  const host = (() => {
    try {
      return new URL(target).host.replace(/^www\./, "");
    } catch {
      return url;
    }
  })();

  return (
    <div role="status" className="term-bubble site-bubble relative mt-3 w-full max-w-[22rem] rounded-xl bg-espresso p-3.5 text-bone">
      {!failed && (
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-bone/10">
          {!loaded && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-bone/10" />}
          {/* eslint-disable-next-line @next/next/no-img-element -- third-party
              screenshot service; next/image can't optimize a generating shot */}
          <img
            key={attempt}
            src={src}
            alt={`A snapshot of ${host}`}
            className={`h-full w-full object-cover object-top transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={(e) => {
              // mShots serves a "generating" placeholder first; real shots come
              // back at the requested 640px width, the placeholder doesn't.
              if (e.currentTarget.naturalWidth >= 600) setLoaded(true);
            }}
            onError={() => {
              if (!loaded) setFailed(true);
            }}
          />
        </div>
      )}
      <p className="mt-3 text-[0.95rem] leading-snug">Is this your site?</p>
      <p className="mt-0.5 truncate text-[0.8rem] text-bone/70">{title ? `${title} · ${host}` : host}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onYes} className="rounded-full bg-signal px-3.5 py-1 text-[0.82rem] font-medium text-paper transition-colors hover:bg-signal-strong">
          Yes
        </button>
        <button type="button" onClick={onNo} className="rounded-full border border-bone/30 px-3.5 py-1 text-[0.82rem] font-medium text-bone/85 transition-colors hover:border-bone/60 hover:text-bone">
          Not quite
        </button>
      </div>
    </div>
  );
}
