"use client";

import { motion } from "framer-motion";
import { useMounted } from "./use-mounted";

const links = [
  { label: "Story", href: "#story" },
  { label: "Feel", href: "#feel" },
  { label: "Showcase", href: "#showcase" },
  { label: "Taste", href: "#taste" },
];

export default function Nav() {
  const mounted = useMounted();

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
        className="text-sm font-semibold uppercase tracking-[0.28em] text-white"
      >
        <span className="text-coke-red">Coca</span>-Cola
      </a>
      <nav className="hidden gap-8 md:flex">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-xs font-medium uppercase tracking-[0.24em] text-white/70 transition-colors hover:text-white"
          >
            {l.label}
          </a>
        ))}
      </nav>
      <a
        href="#taste"
        className="hidden rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-white/90 transition hover:border-coke-red hover:text-white sm:inline-block"
      >
        Taste
      </a>
    </motion.header>
  );
}
