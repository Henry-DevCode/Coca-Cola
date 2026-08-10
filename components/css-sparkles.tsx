"use client";

import { useMemo } from "react";

type CssSparklesProps = {
  /** Rising droplets that drift upward */
  riseCount?: number;
  /** Fixed-position glints that pulse in place */
  glintCount?: number;
};

export default function CssSparkles({
  riseCount = 40,
  glintCount = 20,
}: CssSparklesProps) {
  const particles = useMemo(() => {
    const seed = (i: number, s: number) => {
      const x = Math.sin(i * 7919 + s * 6271) * 139457;
      return x - Math.floor(x);
    };
    const r = (n: number, d = 2) => Number(n.toFixed(d));

    const rises = Array.from({ length: riseCount }, (_, i) => ({
      id: `r${i}`,
      type: "rise" as const,
      posX: r(seed(i, 1) * 100),
      startY: r(seed(i, 2) * 40),
      sz: r(2 + seed(i, 3) * 5),
      dur: r(6 + seed(i, 4) * 10),
      delay: r(seed(i, 5) * -16),
      drift: r((seed(i, 6) - 0.5) * 140),
      maxOpacity: r(0.4 + seed(i, 7) * 0.6),
    }));

    const glints = Array.from({ length: glintCount }, (_, i) => ({
      id: `g${i}`,
      type: "glint" as const,
      posX: r(seed(i + 100, 1) * 100),
      posY: r(seed(i + 100, 2) * 100),
      sz: r(3 + seed(i + 100, 3) * 8),
      dur: r(1.8 + seed(i + 100, 4) * 3),
      delay: r(seed(i + 100, 5) * -5),
      maxOpacity: r(0.3 + seed(i + 100, 6) * 0.7),
    }));

    return [...rises, ...glints];
  }, [riseCount, glintCount]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {particles.map((p) =>
        p.type === "rise" ? (
          <span
            key={p.id}
            className="sparkle sparkle-rise"
            style={
              {
                "--pos-x": `${p.posX}%`,
                "--start-y": `-${p.startY}px`,
                "--sz": `${p.sz}px`,
                "--dur": `${p.dur}s`,
                "--delay": `${p.delay}s`,
                "--drift": `${p.drift}px`,
                "--max-opacity": p.maxOpacity,
              } as React.CSSProperties
            }
          />
        ) : (
          <span
            key={p.id}
            className="sparkle sparkle-glint"
            style={
              {
                "--pos-x": `${p.posX}%`,
                "--pos-y": `${p.posY}%`,
                "--sz": `${p.sz}px`,
                "--dur": `${p.dur}s`,
                "--delay": `${p.delay}s`,
                "--max-opacity": p.maxOpacity,
              } as React.CSSProperties
            }
          />
        )
      )}
    </div>
  );
}
