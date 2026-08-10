"use client";

import { useMemo } from "react";

type BubblesProps = {
  count?: number;
  className?: string;
};

/**
 * Pure-CSS bubble field. Cheap to render (no per-frame JS) and honors
 * prefers-reduced-motion via the .bubble class in globals.css.
 */
export default function Bubbles({ count = 26, className }: BubblesProps) {
  const bubbles = useMemo(() => {
    // Deterministic pseudo-random so SSR & CSR match.
    const seed = (i: number, s: number) => {
      const x = Math.sin(i * 9301 + s * 49297) * 233280;
      return x - Math.floor(x);
    };
    // Round every value to a fixed precision so the string emitted by the
    // server pass matches the string emitted by the initial client render
    // exactly — floating-point representation can differ across V8 versions
    // and CSS normalization steps, which trips React 19's hydration check.
    const round = (n: number, d = 2) => Number(n.toFixed(d));
    return Array.from({ length: count }, (_, i) => {
      const size = round(6 + seed(i, 1) * 18); // 6..24px
      const left = round(seed(i, 2) * 100); // 0..100%
      const dur = round(6 + seed(i, 3) * 8); // 6..14s
      const delay = round(seed(i, 4) * -12); // stagger
      const drift = round((seed(i, 5) - 0.5) * 120); // -60..60px
      return { i, size, left, dur, delay, drift };
    });
  }, [count]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {bubbles.map((b) => (
        <span
          key={b.i}
          className="bubble"
          style={
            {
              left: `${b.left}%`,
              "--size": `${b.size}px`,
              "--dur": `${b.dur}s`,
              "--delay": `${b.delay}s`,
              "--drift": `${b.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
