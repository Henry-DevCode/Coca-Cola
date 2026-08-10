"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type LoadingScreenProps = {
  /** 0–100 download progress reported by useProgress() */
  progress: number;
  /** true once the model is fully loaded and the overlay should exit */
  ready: boolean;
};

/**
 * Cinematic full-screen loading overlay.
 *
 * Timeline:
 *  0 s   – black screen fades in, logo scales up
 *  0.4 s – "Coca-Cola" wordmark appears
 *  0.8 s – fill bar starts tracking `progress`
 *  done  – bar fills to 100 %, "LOADING" swaps to "READY", 0.6 s pause,
 *           then the whole overlay dissolves upward revealing the site
 */
export default function LoadingScreen({ progress, ready }: LoadingScreenProps) {
  // Stay mounted long enough for the exit animation to finish.
  const [visible, setVisible] = useState(true);
  // Once ready, show 100 % briefly before dismissing.
  const [displayProgress, setDisplayProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const currentRef = useRef(0);

  // Smoothly interpolate the display bar so it never jumps.
  useEffect(() => {
    const target = ready ? 100 : progress;

    const tick = () => {
      const diff = target - currentRef.current;
      if (Math.abs(diff) < 0.2) {
        currentRef.current = target;
        setDisplayProgress(target);
        return;
      }
      currentRef.current += diff * 0.08;
      setDisplayProgress(Math.round(currentRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [progress, ready]);

  // Hide overlay after exit animation completes (framer exit = 0.9 s).
  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(id);
  }, [ready]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-8vh", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, #3a0000 0%, #1a0000 35%, #0a0000 70%)",
          }}
        >
          {/* Ambient red pulse ring */}
          <PulseRing />

          {/* Rising bubble particles */}
          <BubbleParticles />

          {/* Logo + wordmark */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mb-10 flex flex-col items-center gap-5"
          >
            <div className="relative h-20 w-20 drop-shadow-[0_0_28px_rgba(255,0,0,0.6)]">
              <Image
                src="/image/CC-LOGO.png"
                alt="Coca-Cola"
                fill
                className="object-contain"
                priority
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-xs font-medium uppercase tracking-[0.55em] text-white/50">
                Coca-Cola
              </span>
              <span className="text-2xl font-black uppercase tracking-[0.18em] text-white sm:text-3xl">
                Open Happiness
              </span>
            </motion.div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="relative z-10 flex w-64 flex-col items-center gap-3 sm:w-80"
          >
            {/* Track */}
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              {/* Fill */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-700 via-coke-red to-red-400"
                style={{ width: `${displayProgress}%` }}
                transition={{ ease: "linear", duration: 0.05 }}
              />
              {/* Shimmer glint running over the fill */}
              <div
                className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{
                  left: `${displayProgress - 10}%`,
                  transition: "left 0.1s linear",
                }}
              />
            </div>

            {/* Numeric + label */}
            <div className="flex w-full items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">
                Loading Experience
              </span>
              <span className="font-mono text-xs text-white/60">
                {displayProgress}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* "Ready" flash — momentarily replaces the bar when at 100 % */}
      {ready && visible && (
        <motion.div
          key="ready"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, #3a0000 0%, #1a0000 35%, #0a0000 70%)",
          }}
        >
          <motion.span
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-medium uppercase tracking-[0.6em] text-coke-red"
          >
            Ready
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Expanding red ring that pulses like a heartbeat. */
function PulseRing() {
  return (
    <>
      {[0, 0.8, 1.6].map((delay) => (
        <motion.div
          key={delay}
          className="pointer-events-none absolute rounded-full border border-red-700/20"
          initial={{ width: 120, height: 120, opacity: 0.6 }}
          animate={{ width: 600, height: 600, opacity: 0 }}
          transition={{
            repeat: Infinity,
            duration: 3.2,
            delay,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

/** Small CSS-driven bubbles rising from the bottom during load. */
function BubbleParticles() {
  const items = [
    { left: "18%", size: 5, dur: 5, delay: 0 },
    { left: "35%", size: 8, dur: 7, delay: 1.2 },
    { left: "52%", size: 4, dur: 6, delay: 0.4 },
    { left: "67%", size: 9, dur: 8, delay: 2.1 },
    { left: "80%", size: 6, dur: 5.5, delay: 0.9 },
    { left: "28%", size: 7, dur: 9, delay: 3 },
    { left: "74%", size: 5, dur: 6.5, delay: 1.8 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={
            {
              left: b.left,
              "--size": `${b.size}px`,
              "--dur": `${b.dur}s`,
              "--delay": `${-b.delay}s`,
              "--drift": `${(i % 2 === 0 ? 1 : -1) * (20 + i * 8)}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
