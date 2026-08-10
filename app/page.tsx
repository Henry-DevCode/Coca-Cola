"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ScrollProvider, useScrollProgress } from "@/components/scroll-context";
import Nav from "@/components/nav";
import Hero from "@/components/sections/home";
import ProductExperience from "@/components/sections/product-experience";
import Ingredients from "@/components/sections/ingredients";
import Showcase from "@/components/sections/showcase";
import FinalCta from "@/components/sections/final-cta";
import CssSparkles from "@/components/css-sparkles";
import LoadingScreen from "@/components/loading-screen";

// Dynamic-import so three.js / R3F never touches the server bundle.
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
  const [loadProgress, setLoadProgress] = useState(0);
  const [modelReady, setModelReady] = useState(false);

  // Stable callbacks — never recreated, so Scene3D won't re-render.
  const handleProgress = useCallback((p: number) => setLoadProgress(p), []);
  const handleReady = useCallback(() => setModelReady(true), []);

  // Prevent scrolling while the loading screen is up.
  useEffect(() => {
    if (modelReady) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modelReady]);

  return (
    <ScrollProvider>
      {/* ── Loading overlay (z-100, above everything) ── */}
      <LoadingScreen progress={loadProgress} ready={modelReady} />

      {/* ── Navigation (hidden behind loader until ready) ── */}
      <Nav />

      {/* ── Fixed 3D canvas ── */}
      <Scene3D onProgress={handleProgress} onReady={handleReady} />

      {/* ── CSS sparkle overlay ── */}
      <CssSparkles riseCount={38} glintCount={18} />

      {/* ── Page sections ── */}
      <main className="relative z-10 flex w-full flex-col">
        <Hero />
        <ProductExperience />
        <Ingredients />
        <Showcase />
        <FinalCta />
      </main>

      {/* ── Scroll progress bar ── */}
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
