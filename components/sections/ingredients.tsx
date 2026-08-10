"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Bubbles from "../bubbles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Three text layers moving at different speeds → classic parallax. */
export default function Ingredients() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const back = useRef<HTMLDivElement | null>(null);
  const mid = useRef<HTMLDivElement | null>(null);
  const front = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { amount: 0.3, once: false });

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const st = (target: unknown, y: number) =>
        gsap.to(target as gsap.TweenTarget, {
          yPercent: y,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      st(back.current, -35); // slowest
      st(mid.current, -18);
      st(front.current, 12); // moves opposite for depth
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="feel"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 sm:px-10"
    >
      <Bubbles count={30} />

      {/* Layer 1: BACK — huge outlined word */}
      <div
        ref={back}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <span className="select-none text-[28vw] font-black leading-none tracking-tighter text-white/[0.04] sm:text-[20vw]">
          TASTE
        </span>
      </div>

      {/* Layer 2: MID — small red pill */}
      <div
        ref={mid}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <span className="translate-y-[22vh] select-none text-[8vw] font-semibold uppercase tracking-[0.4em] text-coke-red/40 sm:text-[5vw]">
          Refresh
        </span>
      </div>

      {/* Layer 3: FRONT — the actual message, fastest */}
      <div
        ref={front}
        className="relative z-10 max-w-3xl text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-xs font-medium uppercase tracking-[0.4em] text-white/60"
        >
          The Feel
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          A million tiny bubbles.{" "}
          <span className="italic text-white/70">One crack of the tab.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
        >
          Kola nut, vanilla, citrus — and the unmistakable hiss the moment
          the pull-tab gives way. Every sip from the can is engineered to feel
          effortless.
        </motion.p>
      </div>
    </section>
  );
}
