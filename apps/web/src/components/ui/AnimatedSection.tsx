"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type AnimatedSectionDirection = "up" | "left" | "right" | "none";

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: AnimatedSectionDirection;
  /** Above-the-fold: animate on mount without waiting for scroll intersection */
  priority?: boolean;
};

const travel = 20;

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  priority = false,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollInView = useInView(ref, { once: true, margin: "-80px" });
  const visible = priority || scrollInView;

  const initial = {
    opacity: 0,
    y: direction === "up" ? travel : 0,
    x: direction === "left" ? -travel : direction === "right" ? travel : 0,
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={visible ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
