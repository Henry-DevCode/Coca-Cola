"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    n: "01",
    title: "Iconic Can Silhouette",
    body: "The cylindrical shape with the embossed grip — designed to feel right in your hand before you even crack it open.",
  },
  {
    n: "02",
    title: "Signature Red",
    body: "PMS 484. The same exact crimson printed on every can, every country, for over a century of instant recognition.",
  },
  {
    n: "03",
    title: "Perfect Fizz",
    body: "2.5 volumes of CO₂ sealed under a pull-tab. That hiss when you open it is the sound of 135 years of refinement.",
  },
];

export default function Showcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".showcase-card");
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.18,
          ease: "power3.out",
          duration: 1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative flex min-h-[110vh] w-full items-center overflow-hidden px-6 sm:px-10"
    >
      {/* Text on the RIGHT half — can drifts into the LEFT half */}
      <div className="relative z-10 ml-auto mr-[8%] max-w-lg">
        <span className="text-xs font-medium uppercase tracking-[0.4em] text-coke-red">
          The Can
        </span>
        <h2 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          Three details you&apos;ve felt a thousand times.
        </h2>
        <div ref={cardsRef} className="mt-10 flex flex-col gap-4">
          {features.map((f) => (
            <div
              key={f.n}
              className="showcase-card group relative flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-coke-red/40"
            >
              <span className="text-sm font-mono text-coke-red">{f.n}</span>
              <div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
