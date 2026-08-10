"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMounted } from "./use-mounted";

/**
 * Each entry maps:
 *  - id:    the section's HTML id attribute
 *  - label: text shown in the nav
 *  - path:  the URL path to push when the section is in view
 */
const links = [
  { id: "hero",     label: "Home",     path: "/home"     },
  { id: "story",    label: "Story",    path: "/story"    },
  { id: "feel",     label: "Feel",     path: "/feel"     },
  { id: "showcase", label: "Showcase", path: "/showcase" },
  { id: "taste",    label: "Taste",    path: "/taste"    },
];

export default function Nav() {
  const mounted = useMounted();
  const [activeId, setActiveId] = useState("hero");

  // Update the URL and highlight as each section scrolls into view.
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    links.forEach(({ id, path }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id);
            // Silently update the address bar without a navigation / re-render.
            window.history.replaceState(null, "", path);
          }
        },
        {
          // Trigger when the section covers at least 40 % of the viewport.
          threshold: 0.4,
        }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const hidden = { y: -30, opacity: 0 };
  const shown  = { y: 0,   opacity: 1 };

  return (
    <motion.header
      initial={hidden}
      animate={mounted ? shown : hidden}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10"
    >
      {/* Logo — scrolls back to the top */}
      <a
        href="#hero"
        onClick={() => window.history.replaceState(null, "", "/home")}
        className="text-sm font-semibold uppercase tracking-[0.28em] text-white"
      >
        <span className="text-coke-red">Coca</span>-Cola
      </a>

      {/* Desktop nav — "Taste" duplicate CTA removed */}
      <nav className="hidden gap-8 md:flex">
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className={[
              "text-xs font-medium uppercase tracking-[0.24em] transition-colors",
              activeId === l.id
                ? "text-white"
                : "text-white/50 hover:text-white/80",
            ].join(" ")}
          >
            {l.label}
          </a>
        ))}
      </nav>
    </motion.header>
  );
}
