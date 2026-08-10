"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FinalCta() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.35, once: false });

  return (
    <section
      ref={ref}
      id="taste"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center sm:px-10"
    >
      {/* Radial red glow behind the CTA to sell the "zoom in" moment */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.35)_0%,rgba(0,0,0,0)_55%)]"
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-xs font-medium uppercase tracking-[0.5em] text-white/70"
        >
          Final Sip
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={
            inView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 60, scale: 0.95 }
          }
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-6xl font-black leading-[0.95] tracking-tight text-white sm:text-8xl md:text-[128px]"
        >
          Taste the{" "}
          <span className="bg-gradient-to-b from-white via-red-200 to-coke-red bg-clip-text text-transparent">
            Feeling
          </span>
          .
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="max-w-lg text-base leading-relaxed text-white/70 sm:text-lg"
        >
          Some feelings can&apos;t be described. They can only be cracked open.
        </motion.p>

        <motion.a
          href="#hero"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 inline-flex items-center gap-3 rounded-full bg-coke-red px-8 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-[0_20px_60px_-10px_rgba(255,0,0,0.55)] transition-colors hover:bg-red-600"
        >
          Crack a Can
          <span aria-hidden>→</span>
        </motion.a>
      </div>

      <footer className="absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.32em] text-white/40">
        <span>Concept build • Not affiliated with The Coca-Cola Company</span>
      </footer>
    </section>
  );
}
