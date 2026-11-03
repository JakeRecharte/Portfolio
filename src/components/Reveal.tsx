"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Fades content up as it scrolls into view. The reference site reveals every
 * block this way; `once` keeps it from re-firing and turning into noise.
 *
 * Reduced motion is the two `motion-reduce:` classes, not `useReducedMotion`.
 * The hook can't see the visitor's setting on the server, so the prerendered
 * HTML always carries Motion's `opacity: 0`, and returning a plain div on the
 * client doesn't remove it: React leaves mismatched attributes alone, and the
 * content stays invisible. `!important` beats Motion's inline styles and its
 * animation from the first paint, so the block just sits in place.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`motion-reduce:transform-none! motion-reduce:opacity-100! ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
