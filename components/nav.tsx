"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMounted } from "./use-mounted";

type NavLink = {
  id: string;
  label: string;
  path: string;
};

const links: NavLink[] = [
  { id: "hero",     label: "Home",     path: "/home"     },
  { id: "story",    label: "Story",    path: "/story"    },
  { id: "feel",     label: "Feel",     path: "/feel"     },
  { id: "showcase", label: "Showcase", path: "/showcase" },
  { id: "taste",    label: "Taste",    path: "/taste"    },
];

export default function Nav() {
  const mounted = useMounted();
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    links.forEach((link: NavLink) => {
      const el = document.getElementById(link.id);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            setActiveId(link.id);
            window.history.replaceState(null, "", link.path);
          }
        },
        { threshold: 0.4 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((obs: IntersectionObserver) => obs.disconnect());
    };
  }, []);

  const hidden = { y: -30, opacity: 0 };
  const shown = { y: 0, opacity: 1 };

  return (
    <motion.header
      initial={hidden}
      animate={mounted ? shown : hidden}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10"
    >
      <a
        href="#hero"
        onClick={() => window.history.replaceState(null, "", "/home")}
        className="text-sm font-semibold uppercase tracking-[0.28em] text-white"
      >
        <span className="text-coke-red">Coca</span>-Cola
      </a>

      <nav className="hidden gap-8 md:flex">
        {links.map((link: NavLink) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={[
              "text-xs font-medium uppercase tracking-[0.24em] transition-colors",
              activeId === link.id
                ? "text-white"
                : "text-white/50 hover:text-white/80",
            ].join(" ")}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </motion.header>
  );
}
