/**
 * The 70s swirl from the left lens of Cristina's logo, redrawn as SVG so it
 * can be reused at any size: concentric bands of orange, sand and seafoam
 * spiralling out from two centres, clipped to a lens shape.
 *
 * It's a hand-redrawn stand-in, not a trace — swap the paths for the real
 * swirl once the vector logo arrives (OPEN-ITEM 11).
 *
 * Decorative only (aria-hidden). `spin` turns the swirl slowly on hover of the
 * nearest `.group` ancestor; reduced-motion users get it still.
 */
export default function LensSwirl({
  className = "",
  shape = "lens",
  spin = false,
  onDark = false,
  turnOnLoad = false,
}: {
  className?: string;
  /** "lens" = the glasses lens; "circle" = a round badge; "none" = unclipped field */
  shape?: "lens" | "circle" | "none";
  spin?: boolean;
  /** On an ink band the outline switches to bone so the lens edge still reads. */
  onDark?: boolean;
  /** One slow quarter turn shortly after the page loads. */
  turnOnLoad?: boolean;
}) {
  const edge = onDark ? "var(--color-bone)" : "var(--color-ink)";
  const id = `lens-${shape}`;
  const bands = [
    { r: 150, c: "var(--color-sand)" },
    { r: 132, c: "var(--color-orange)" },
    { r: 116, c: "var(--color-sand)" },
    { r: 100, c: "var(--color-orange)" },
    { r: 84, c: "var(--color-seafoam)" },
    { r: 68, c: "var(--color-sand)" },
    { r: 52, c: "var(--color-orange)" },
    { r: 36, c: "var(--color-seafoam)" },
    { r: 20, c: "var(--color-sand)" },
  ];
  const small = [
    { r: 70, c: "var(--color-seafoam)" },
    { r: 56, c: "var(--color-sand)" },
    { r: 42, c: "var(--color-seafoam)" },
    { r: 28, c: "var(--color-sand)" },
    { r: 14, c: "var(--color-seafoam)" },
  ];
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id}>
          {shape === "lens" && (
            <path d="M14 18 C60 6 140 4 190 14 C196 60 186 120 160 146 C120 156 60 156 30 142 C10 110 6 60 14 18 Z" />
          )}
          {shape === "circle" && <circle cx="100" cy="80" r="78" />}
          {shape === "none" && <rect width="200" height="160" />}
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width="200" height="160" fill="var(--color-sand)" />
        <g
          className={[spin ? "swirl-spin" : "", turnOnLoad ? "swirl-once" : ""].join(" ").trim() || undefined}
          style={{ transformOrigin: "120px 92px" }}
        >
          {bands.map((b) => (
            <circle key={b.r} cx="120" cy="92" r={b.r} fill={b.c} stroke="var(--color-ink)" strokeWidth="1.6" />
          ))}
        </g>
        <g>
          {small.map((b) => (
            <circle key={b.r} cx="44" cy="40" r={b.r} fill={b.c} stroke="var(--color-ink)" strokeWidth="1.6" />
          ))}
        </g>
      </g>
      {shape === "lens" && (
        <path
          d="M14 18 C60 6 140 4 190 14 C196 60 186 120 160 146 C120 156 60 156 30 142 C10 110 6 60 14 18 Z"
          fill="none"
          stroke={edge}
          strokeWidth="9"
          strokeLinejoin="round"
        />
      )}
      {shape === "circle" && (
        <circle cx="100" cy="80" r="78" fill="none" stroke={edge} strokeWidth="3" />
      )}
    </svg>
  );
}
