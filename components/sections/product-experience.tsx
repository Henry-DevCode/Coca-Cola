"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProductExperience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textLayer = useRef<HTMLDivElement | null>(null);
  const bgLayer = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { amount: 0.35, once: false });

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Layered parallax: background slower, text faster.
      gsap.to(bgLayer.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(textLayer.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative flex min-h-screen w-full items-center overflow-hidden px-6 sm:px-10"
    >
      {/* Background parallax word */}
      <div
        ref={bgLayer}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-start"
      >
        <span className="ml-[-4vw] select-none whitespace-nowrap text-[26vw] font-black leading-none tracking-tighter text-coke-red/[0.06]">
          1886
        </span>
      </div>

      {/* Foreground text */}
      <div ref={textLayer} className="relative z-10 max-w-2xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs font-medium uppercase tracking-[0.4em] text-coke-red"
        >
          The Experience
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          Refreshing since{" "}
          <span className="bg-gradient-to-r from-white to-coke-red bg-clip-text text-transparent">
            1886
          </span>
          .
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
        >
          A shape you recognise before you read the label. A crack of the tab
          that hits before the first sip. Every millimetre of aluminium — from
          the embossed grip to the bold crimson — engineered to be
          unmistakable.
        </motion.p>
      </div>
    </section>
  );
}
