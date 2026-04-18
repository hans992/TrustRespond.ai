"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type AnimatedSectionDirection = "up" | "left" | "right" | "none";

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: AnimatedSectionDirection;
  /** Above-the-fold: animate on mount without waiting for scroll intersection */
  priority?: boolean;
};

const travel = 16;

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  priority = false,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(priority);

  useEffect(() => {
    if (priority) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "-80px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority]);

  const hiddenTransform =
    direction === "up"
      ? `translateY(${travel}px)`
      : direction === "left"
        ? `translateX(-${travel}px)`
        : direction === "right"
          ? `translateX(${travel}px)`
          : "none";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : hiddenTransform,
        transitionProperty: "opacity, transform",
        transitionDuration: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        transitionDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
}
