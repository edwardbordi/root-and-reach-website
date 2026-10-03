"use client";

import { useEffect } from "react";

/**
 * Marks the sticky header as "scrolled" once the page moves, so CSS can shrink
 * it from the full header to a tight bar (see .site-header in globals.css).
 * A little hysteresis (on past 40px, off under 8px) stops it flickering when
 * someone stops right at the threshold.
 */
export default function HeaderScroll() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const on = header.hasAttribute("data-scrolled");
      if (!on && y > 40) header.setAttribute("data-scrolled", "");
      else if (on && y < 8) header.removeAttribute("data-scrolled");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
