"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type SparklesFieldProps = {
  count?: number;
  spread?: number;
};

/** Seeded PRNG — deterministic, no Math.random, passes the purity rule. */
function seeded(i: number, s: number): number {
  const x = Math.sin(i * 9301 + s * 49297) * 233280;
  return x - Math.floor(x);
}

function createMaterial() {
  return new THREE.PointsMaterial({
    size: 0.045,
    sizeAttenuation: true,
    color: new THREE.Color("#ffffff"),
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export default function SparklesField({
  count = 220,
  spread = 6,
}: SparklesFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Particle kinematic data.
  const { speeds, phases } = useMemo(() => {
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      speeds[i] = 0.18 + seeded(i, 4) * 0.28;
      phases[i] = seeded(i, 5) * Math.PI * 2;
    }
    return { speeds, phases };
  }, [count]);

  // Geometry built once; its internal Float32Array is mutable.
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (seeded(i, 1) - 0.5) * spread * 2;
      positions[i * 3 + 1] = (seeded(i, 2) - 0.5) * spread * 2;
      positions[i * 3 + 2] = (seeded(i, 3) - 0.5) * spread * 0.8;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count, spread]);

  // Material stored as a stable useMemo value; we mutate it only inside
  // useFrame (outside render), which is explicitly allowed.
  const material = useMemo(() => createMaterial(), []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * 0.006;
      arr[i * 3 + 0] += Math.sin(t * 0.4 + phases[i]) * 0.002;
      if (arr[i * 3 + 1] > spread) {
        arr[i * 3 + 1] = -spread;
      }
    }
    pos.needsUpdate = true;

    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.55 + Math.sin(t * 1.8) * 0.3;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
    />
  );
}
