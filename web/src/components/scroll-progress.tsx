"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/** Thin bar at the top that fills as you scroll; doubles as reading progress on blog posts. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-(--viz-1) print:hidden"
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
    />
  );
}
