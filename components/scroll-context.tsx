"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ScrollContextValue = {
  progress: number;
  progressRef: React.MutableRefObject<number>;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const compute = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, scrollTop / max));
      progressRef.current = p;
      setProgress(p);
    };

    compute();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const value = useMemo(() => ({ progress, progressRef }), [progress]);
  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}

export function useScrollProgress(): ScrollContextValue {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScrollProgress must be used inside <ScrollProvider />");
  }
  return ctx;
}
