"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type CokeBottleProps = {
  progressRef: React.MutableRefObject<number>;
};

/**
 * Scroll progress bands (approximate):
 *   0.00 – 0.18  Hero         — centred, breathes, slow spin
 *   0.18 – 0.38  Story        — drifts RIGHT to fill the empty left half
 *   0.38 – 0.55  Feel         — returns to centre, faster spin + tilt
 *   0.55 – 0.75  Showcase     — drifts LEFT to fill the empty right half
 *   0.75 – 1.00  CTA          — returns to centre, zooms forward
 */
export default function CokeBottle({ progressRef }: CokeBottleProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/model/coke.glb");

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const p = progressRef.current; // 0 → 1

    // ── ROTATION ──────────────────────────────────────────────────────────

    // Y-spin: idle + scroll-accelerated.
    const yRot = t * 0.45 + p * Math.PI * 7;

    // Full vertical flip across the whole page (one 360° over the journey).
    const xRot = easeInOutCubic(p) * Math.PI * 2;

    // Z tilt: idle sway + section-driven lean.
    // Leans left in Story, leans right in Showcase for a dynamic look.
    const storyLean  =  smoothstep(0.15, 0.35, p) - smoothstep(0.38, 0.55, p);
    const showLean   = -(smoothstep(0.55, 0.75, p) - smoothstep(0.75, 0.88, p));
    const zRot = Math.sin(t * 0.5) * 0.06 + storyLean * 0.15 + showLean * 0.18;

    group.current.rotation.set(xRot, yRot, zRot);

    // ── POSITION ──────────────────────────────────────────────────────────

    // Idle bob — always present.
    const bob = Math.sin(t * 0.9) * 0.1;

    // X: drift RIGHT during Story so it fills the empty left gap.
    //    drift LEFT during Showcase so it fills the empty right gap.
    const storyDrift   =  smoothstep(0.18, 0.38, p) - smoothstep(0.38, 0.55, p);
    const showDrift    = -(smoothstep(0.55, 0.75, p) - smoothstep(0.75, 0.90, p));
    const driftX = storyDrift * 1.6 + showDrift * 1.6 + Math.sin(t * 0.3) * 0.04;

    // Y: arc the model through the page — rises slightly mid-page, settles.
    //    Each section gets a distinct vertical landmark so it reads as
    //    "the can is travelling" not "stuck in the middle".
    const heroY    = (1 - smoothstep(0, 0.18, p))       * -0.2;
    const storyY   = smoothstep(0.18, 0.38, p)           *  0.35;
    const feelY    = smoothstep(0.38, 0.55, p)           * -0.25;
    const showcaseY = smoothstep(0.55, 0.75, p)          *  0.3;
    const ctaY     = smoothstep(0.75, 1.0, p)            * -0.4;
    const posY = bob - 1.7 + heroY + storyY + feelY + showcaseY + ctaY;

    // Z: zoom forward in the CTA.
    const posZ = smoothstep(0.85, 1.0, p) * 0.5;

    group.current.position.set(driftX, posY, posZ);

    // ── SCALE ─────────────────────────────────────────────────────────────

    const BASE_SCALE = 20;
    // Breathe gently in the hero, swell for the CTA zoom.
    const heroPulse = (1 - smoothstep(0, 0.18, p)) * 0.20;
    const ctaSwell  = smoothstep(0.85, 1.0, p) * 0.18;
    const breathe   = Math.sin(t * 1.2) * 0.005;
    group.current.scale.setScalar(BASE_SCALE * (1 + heroPulse + ctaSwell + breathe));
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/model/coke.glb");

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
