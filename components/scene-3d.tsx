"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Center,
  Sparkles,
  useProgress,
} from "@react-three/drei";
import CokeBottle from "./coke-bottle";
import SparklesField from "./sparkles-field";
import { useScrollProgress } from "./scroll-context";

type Scene3DProps = {
  onProgress: (p: number) => void;
  onReady: () => void;
};

/** Pure scene graph — zero state, zero side-effects. */
function SceneContents({ isMobile }: { isMobile: boolean }) {
  const { progressRef } = useScrollProgress();

  return (
    <>
      <ambientLight intensity={0.5} color="#ff3333" />
      <directionalLight position={[5, 6, 5]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-5, 3, -4]} intensity={0.9} color="#ff1a1a" />
      <pointLight position={[0, -4, 5]} intensity={0.6} color="#ff4444" />
      <pointLight position={[2, 3, -3]} intensity={0.4} color="#ff6666" />

      <Suspense fallback={null}>
        <SparklesField count={isMobile ? 120 : 260} spread={6} />
        <Sparkles count={isMobile ? 40 : 90} scale={5} size={2.5} speed={0.55} noise={1.2} color="#ffffff" opacity={0.7} />
        <Sparkles count={isMobile ? 20 : 50} scale={4} size={1.8} speed={0.9} noise={0.8} color="#ff4444" opacity={0.55} />
        <Center>
          <CokeBottle progressRef={progressRef} />
        </Center>
        {!isMobile && (
          <ContactShadows position={[0, -2.2, 0]} opacity={0.45} scale={10} blur={2.5} far={5} color="#220000" />
        )}
        <Environment preset="city" background={false} />
      </Suspense>
    </>
  );
}

/**
 * Lives entirely OUTSIDE the Canvas in the normal DOM tree.
 * useProgress is a Zustand selector — it doesn't need to be inside the
 * Canvas. By keeping it here, Environment's render-phase store writes
 * never touch the same React subtree as our setState calls.
 */
function ProgressTracker({ onProgress, onReady }: Scene3DProps) {
  const { progress, active } = useProgress();
  const readyFiredRef = useRef(false);
  const lastProgressRef = useRef(-1);

  useEffect(() => {
    const rounded = Math.round(progress);
    // Only fire if the value actually changed to avoid cascading updates.
    if (rounded !== lastProgressRef.current) {
      lastProgressRef.current = rounded;
      onProgress(rounded);
    }
  }, [progress, onProgress]);

  useEffect(() => {
    if (!active && progress >= 100 && !readyFiredRef.current) {
      readyFiredRef.current = true;
      // Defer to the next tick so we're fully outside any render cycle.
      setTimeout(onReady, 0);
    }
  }, [active, progress, onReady]);

  return null;
}

export default function Scene3D({ onProgress, onReady }: Scene3DProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const dpr: [number, number] = isMobile ? [1, 1.25] : [1, 1.75];

  return (
    <>
      {/* ProgressTracker is a sibling of the Canvas div, not a child.
          This guarantees it is in a completely separate React subtree from
          Environment, so Environment's Zustand writes can never trigger a
          "setState during render" collision here. */}
      <ProgressTracker onProgress={onProgress} onReady={onReady} />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      >
        <Canvas
          dpr={dpr}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 6], fov: 40 }}
          frameloop="always"
        >
          <SceneContents isMobile={isMobile} />
        </Canvas>
      </div>
    </>
  );
}
