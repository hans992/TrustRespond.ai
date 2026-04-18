"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

function useCountUp(target: number, duration: number, inView: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    let startTime: number | null = null;
    let rafId = 0;

    const tick = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      setCount(Math.round(target * progress));

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [target, duration, inView]);

  return count;
}

export function StatsBar() {
  const countRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(countRef, { once: true, margin: "-80px" });
  const count = useCountUp(80, 1.5, isInView);

  return (
    <section className="relative border-y border-white/10 py-14 md:py-16">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/[0.04] to-transparent" />
      <div ref={countRef} className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 text-center md:grid-cols-3 md:gap-8">
        <AnimatedSection direction="none">
          <div className="md:border-r md:border-white/10 md:pr-8">
            <p className="text-4xl font-bold text-gradient-emerald md:text-5xl">{count}%</p>
            <p className="mx-auto mt-2 max-w-[160px] text-sm leading-relaxed text-slate-400">
              Average time saved per questionnaire
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1} direction="none">
          <div className="md:border-r md:border-white/10 md:pr-8">
            <p className="text-4xl font-bold text-gradient-emerald md:text-5xl">2 hours</p>
            <p className="mx-auto mt-2 max-w-[160px] text-sm leading-relaxed text-slate-400">From 2 weeks to completion</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2} direction="none">
          <div>
            <p className="text-4xl font-bold text-gradient-emerald md:text-5xl">Zero</p>
            <p className="mx-auto mt-2 max-w-[160px] text-sm leading-relaxed text-slate-400">
              Formatting errors in exported files
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
