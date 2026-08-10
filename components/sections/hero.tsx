"use client";

import { motion } from "framer-motion";
import { useScrollProgress } from "../scroll-context";
import { useMounted } from "../use-mounted";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
};

const line = {
  hidden: { y: 40, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const { progress } = useScrollProgress();
  const mounted = useMounted();

  const uiOpacity = 1 - Math.min(1, progress * 6);
  const uiY = -progress * 220;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 text-center sm:px-10"
    >
      {/* Background parallax layer — moves slowest */}
      <BackgroundWord />

      <div
        style={{ opacity: uiOpacity, transform: `translateY(${uiY}px)` }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate={mounted ? "show" : "hidden"}
          className="flex flex-col items-center gap-6"
        >
          <motion.span
            variants={line}
            className="text-xs font-medium uppercase tracking-[0.4em] text-white/60"
          >
            Since 1886
          </motion.span>
          <motion.h1
            variants={line}
            className="max-w-4xl text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-7xl md:text-[112px]"
          >
            Open{" "}
            <span className="bg-gradient-to-b from-white via-red-100 to-coke-red bg-clip-text text-transparent">
              Happiness
            </span>
          </motion.h1>
          <motion.p
            variants={line}
            className="max-w-xl text-balance text-base leading-relaxed text-white/70 sm:text-lg"
          >
            A cinematic scroll through the world&apos;s most iconic can.
            Rendered in real time, cracked open just for you.
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator — pure CSS entrance to avoid another motion mount */}
      <div
        style={{ opacity: uiOpacity }}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 motion-safe:animate-[fadeInUp_0.8s_ease-out_1.4s_both]"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/50">
          Scroll
        </span>
        <div className="relative h-10 w-[1.5px] overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-4 animate-[scrollDot_1.8s_ease-in-out_infinite] bg-white/80" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollDot {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateY(300%);
            opacity: 0;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 12px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </section>
  );
}

/** Huge outlined word behind the hero, drifts up slowly with scroll. */
function BackgroundWord() {
  const { progress } = useScrollProgress();
  // Background layer moves slowest (parallax rule #1)
  const y = progress * -80;
  const opacity = 1 - Math.min(1, progress * 3);

  return (
    <div
      aria-hidden
      style={{ transform: `translateY(${y}px)`, opacity }}
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
    >
      <span className="select-none text-[22vw] font-black leading-none tracking-tighter text-white/[0.03] sm:text-[16vw]">
        COCA·COLA
      </span>
    </div>
  );
}
