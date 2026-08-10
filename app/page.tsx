"use client";

import dynamic from "next/dynamic";
import { ScrollProvider, useScrollProgress } from "@/components/scroll-context";
import Nav from "@/components/nav";
import Hero from "@/components/sections/hero";
import ProductExperience from "@/components/sections/product-experience";
import Ingredients from "@/components/sections/ingredients";
import Showcase from "@/components/sections/showcase";
import FinalCta from "@/components/sections/final-cta";
import CssSparkles from "@/components/css-sparkles";

// The 3D scene is client + WebGL-only. Dynamic-import with ssr: false so it
// never touches the server bundle, and give it a subtle black fallback so
// the DOM sections layer smoothly on top while it hydrates.
const Scene3D = dynamic(() => import("@/components/scene-3d"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-coke-vignette"
    />
  ),
});

export default function Home() {
  return (
    <ScrollProvider>
      <Nav />

      {/* Fixed 3D layer sits behind every DOM section (z-0) */}
      <Scene3D />

      {/* CSS sparkle / droplet overlay — sits just above the canvas */}
      <CssSparkles riseCount={38} glintCount={18} />

      {/* Content sits above the canvas */}
      <main className="relative z-10 flex w-full flex-col">
        <Hero />
        <ProductExperience />
        <Ingredients />
        <Showcase />
        <FinalCta />
      </main>

      {/* Progress bar pinned to the top for a premium feel */}
      <ScrollProgressBar />
    </ScrollProvider>
  );
}

function ScrollProgressBar() {
  const { progress } = useScrollProgress();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px] bg-white/[0.05]">
      <div
        className="h-full origin-left bg-coke-red"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
