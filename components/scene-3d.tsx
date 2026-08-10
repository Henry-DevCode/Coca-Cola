"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Center, Sparkles } from "@react-three/drei";
import CokeBottle from "./coke-bottle";
import SparklesField from "./sparkles-field";
import { useScrollProgress } from "./scroll-context";

export default function Scene3D() {
  const { progressRef } = useScrollProgress();
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
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 6], fov: 40 }}
        frameloop="always"
      >
        {/* Deep red ambient + strong key lights */}
        <ambientLight intensity={0.5} color="#ff3333" />
        <directionalLight position={[5, 6, 5]} intensity={1.6} color="#ffffff" />
        <directionalLight position={[-5, 3, -4]} intensity={0.9} color="#ff1a1a" />
        <pointLight position={[0, -4, 5]} intensity={0.6} color="#ff4444" />
        <pointLight position={[2, 3, -3]} intensity={0.4} color="#ff6666" />

        <Suspense fallback={null}>
          {/* ── Layer 1: rising droplet field across the full canvas ── */}
          <SparklesField
            count={isMobile ? 120 : 260}
            spread={6}
          />

          {/* ── Layer 2: tight glinting sparkles orbiting the bottle ── */}
          <Sparkles
            count={isMobile ? 40 : 90}
            scale={5}
            size={2.5}
            speed={0.55}
            noise={1.2}
            color="#ffffff"
            opacity={0.7}
          />

          {/* ── Warm red accent sparkles for a "cola fizz" look ── */}
          <Sparkles
            count={isMobile ? 20 : 50}
            scale={4}
            size={1.8}
            speed={0.9}
            noise={0.8}
            color="#ff4444"
            opacity={0.55}
          />

          {/* ── Layer 3: the model ── */}
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
      </Canvas>
    </div>
  );
}
