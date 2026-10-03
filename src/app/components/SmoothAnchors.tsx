"use client";

import { useEffect } from "react";

/**
 * Smooth, eased scrolling for every in-page link on the site: the menu
 * ("How it works", "The network", "About"), the dot rail, the hero's
 * "How it works" button and the footer's "Back to top".
 *
 * WHY NOT CSS `scroll-behavior: smooth`. It fought Next.js's own link
 * handling (the address changed and the page didn't move), and its speed and
 * easing aren't ours to set. This listens for clicks before Next does, glides
 * there with an ease-in-out over a time that grows with the distance, then
 * updates the address and moves keyboard focus to the section.
 *
 * Only same-page links are handled; links to another page navigate normally.
 * Reduced motion: it jumps instead of gliding.
 */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function SmoothAnchors() {
  useEffect(() => {
    let raf = 0;
    const glide = (to: number) => {
      cancelAnimationFrame(raf);
      const from = window.scrollY;
      const dist = to - from;
      if (Math.abs(dist) < 2) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo(0, to);
        return;
      }
      // ~0.6s for a short hop, up to ~1.3s for the length of the page.
      const dur = Math.min(1300, 550 + Math.abs(dist) * 0.12);
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        window.scrollTo(0, from + dist * ease(t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    // A wheel or touch from the visitor takes over mid-glide.
    const stop = () => cancelAnimationFrame(raf);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank") return;
      const raw = a.getAttribute("href") ?? "";
      if (!raw.includes("#")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;

      const id = decodeURIComponent(url.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (id && !target) return;

      e.preventDefault();
      e.stopPropagation(); // keep Next's link handler from also acting on it
      // Land just below the sticky header in its compact (scrolled) size.
      const BAR = 56;
      const y = target ? target.getBoundingClientRect().top + window.scrollY - BAR : 0;
      glide(Math.max(0, y));
      history.pushState(null, "", id ? `#${id}` : window.location.pathname + window.location.search);
      if (target) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };

    window.addEventListener("click", onClick, true);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
