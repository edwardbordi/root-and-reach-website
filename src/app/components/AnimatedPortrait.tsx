"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The animated home version's portrait: a silent, non-stop loop of Cristina's
 * drawing (hair flowing, flowers swaying, one soft blink), made from the still
 * with image-to-video.
 *
 * Clip: Higgsfield MiniMax H3 (job 22e2949f), cut at its best-matching loop
 * point (frames 235-242 line up with 0-7) with a 1/3-second blend there, so it
 * loops non-stop without a visible jump (~9.8s). Full
 * frame (not cropped to the still), so hair that drifts past the drawing's
 * edges shows; it sits 10% beyond the still on every side and above the quote
 * below. mix-blend-darken makes its near-bone background disappear (no box).
 * 864px, ~700KB. The glasses' swirl is patched from the still on every frame,
 * so it never moves. Raw clip is in design-process/client-assets.
 *
 * The still is the first paint and stays underneath until the clip plays.
 * Reduced motion gets the still only; the clip pauses when scrolled away.
 */
const STILL = "/logos/cristina-portrait-face.webp";
const ALT = "Line drawing of Cristina Vann in black glasses, one lens filled with a 70s swirl, flowers in her hair";

export default function AnimatedPortrait() {
  const ref = useRef<HTMLVideoElement>(null);
  const [motion, setMotion] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotion(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) void v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [motion]);

  return (
    <div className="relative z-10 aspect-square w-full">
      <Image
        src={STILL}
        alt={ALT}
        fill
        priority
        sizes="(min-width: 768px) 26rem, 80vw"
        className={`object-contain transition-opacity duration-500 ${playing ? "opacity-0" : ""}`}
      />
      {motion && (
        <video
          ref={ref}
          className={`absolute -left-[10%] -top-[10%] h-[120%] w-[120%] max-w-none object-contain mix-blend-darken transition-opacity duration-500 ${playing ? "" : "opacity-0"}`}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
        >
          <source src="/hero/cristina-loop.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
