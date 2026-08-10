"use client";

import { Suspense, useEffect, useState } from "react";
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
  /** Called with current 0-100 download progress while the GLB loads. */
  onProgress: (p: number) => void;
  /** Called once when the GLB is fully loaded and textures are ready. */
  onReady: () => void;
};

/**
 * Inner component: lives inside the Canvas, so it can use drei hooks.
 * Reports load progress and completion to the parent overlay.
 */
function SceneContents({
  onProgress,
  onReady,
  isMobile,
}: Scene3DProps & { isMobile: boolean }) {
  const { progress, active } = useProgress();
  const { progressRef } = useScrollProgress();

  // Report raw 0-100 progress every frame it changes.
  useEffect(() => {
    onProgress(Math.round(progress));
  }, [progress, onProgress]);

  // `active` flips to false when ALL assets in the scene are done.
  useEffect(() => {
    if (!active && progress >= 100) {
      onReady();
    }
  }, [active, progress, onReady]);

  return (
    <>
      <ambientLight intensity={0.5} color="#ff3333" />
      <directionalLight position={[5, 6, 5]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-5, 3, -4]} intensity={0.9} color="#ff1a1a" />
      <pointLight position={[0, -4, 5]} intensity={0.6} color="#ff4444" />
      <pointLight position={[2, 3, -3]} intensity={0.4} color="#ff6666" />

      <Suspense fallback={null}>
        <SparklesField count={isMobile ? 120 : 260} spread={6} />

        <Sparkles
          count={isMobile ? 40 : 90}
          scale={5}
          size={2.5}
          speed={0.55}
          noise={1.2}
          color="#ffffff"
          opacity={0.7}
        />

        <Sparkles
          count={isMobile ? 20 : 50}
          scale={4}
          size={1.8}
          speed={0.9}
          noise={0.8}
          color="#ff4444"
          opacity={0.55}
        />

        <Center>
          <CokeBottle progressRef={progressRef} />
        </Center>

        {!isMobile && (
          <ContactShadows
            position={[0, -2.2, 0]}
            opacity={0.45}
            scale={10}
            blur={2.5}
            far={5}
            color="#220000"
          />
        )}

        <Environment preset="city" background={false} />
      </Suspense>
    </>
  );
}

/** Fullscreen fixed 3D layer. Sits behind every DOM section (z-0). */
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
        <SceneContents
          onProgress={onProgress}
          onReady={onReady}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
