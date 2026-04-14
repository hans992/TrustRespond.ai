"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type GlowButtonVariant = "primary" | "secondary" | "ghost";
type GlowButtonSize = "sm" | "md" | "lg";

type GlowButtonProps = {
  variant?: GlowButtonVariant;
  size?: GlowButtonSize;
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
};

function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

const variantClasses: Record<GlowButtonVariant, string> = {
  primary:
    "bg-emerald text-white border border-emerald-light/25 shadow-glow-emerald shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] hover:bg-emerald-light hover:shadow-[0_8px_32px_rgba(48,209,88,0.35),0_0_0_1px_rgba(76,217,100,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "glass border border-white/10 text-neutral-50 hover:border-emerald/35 hover:text-emerald-light hover:bg-emerald/5 hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "bg-transparent text-neutral-400 border border-transparent hover:text-neutral-50 hover:bg-white/[0.04] hover:-translate-y-px",
};

const sizeClasses: Record<GlowButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-2xl font-semibold",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 cursor-pointer font-medium transition-all duration-200 ease-out";

const motionHover = { y: -2 };
const motionTap = { y: 0 };

export function GlowButton({
  variant = "primary",
  size = "md",
  children,
  className,
  href,
  onClick,
}: GlowButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        onClick={onClick}
        whileHover={variant === "ghost" ? { y: -1 } : motionHover}
        whileTap={motionTap}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      className={classes}
      onClick={onClick}
      whileHover={variant === "ghost" ? { y: -1 } : motionHover}
      whileTap={motionTap}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {children}
    </motion.button>
  );
}
