"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type CokeBottleProps = {
  progressRef: React.MutableRefObject<number>;
};

export default function CokeBottle({ progressRef }: CokeBottleProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/model/coke.glb");

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const p = progressRef.current; // 0 → 1 across the full page

    // ----- ROTATION -----

    // Y-axis spin: slow idle + accelerated by scroll.
    const yRot = t * 0.4 + p * Math.PI * 6;

    const flipEase = easeInOutCubic(p);
    const xRot = flipEase * Math.PI * 2;

    // Gentle Z tilt for "alive" feel + slight scroll-driven lean.
    const zRot = Math.sin(t * 0.5) * 0.06 + Math.sin(p * Math.PI * 4) * 0.12;

    group.current.rotation.set(xRot, yRot, zRot);

    // ----- POSITION -----

    // Idle floating bob.
    const bob = Math.sin(t * 0.9) * 0.1;

    // Horizontal drift: bottle slides left during Showcase (≈0.55–0.8).
    const showcase = smoothstep(0.55, 0.8, p) - smoothstep(0.8, 0.95, p);
    const driftX = -1.2 * showcase + Math.sin(t * 0.3) * 0.05;

    // Vertical: start centered, tiny scroll drift downward.
    const posY = bob - 1.7 - p * 0.1;

    // Forward zoom in the final CTA band (0.85–1.0).
    const finalZoom = smoothstep(0.85, 1.0, p);
    const posZ = finalZoom * 0.7;

    group.current.position.set(driftX, posY, posZ);

    // ----- SCALE -----
    // Base scale of 3× makes the model fill the viewport nicely.
    const BASE_SCALE = 20;
    const hero = 1 - smoothstep(0, 0.15, p);
    const cta = smoothstep(0.85, 1.0, p);
    const scale =
      BASE_SCALE * (1 + hero * 0.04 + cta * 0.15 + Math.sin(t * 1.2) * 0.005);
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

// Preload so the model starts downloading immediately.
useGLTF.preload("/model/coke.glb");

// --- Utility functions ---

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
