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
  primary: "bg-accent text-white hover:bg-accent-light shadow-glow-blue",
  secondary:
    "glass border border-surface-border text-neutral-50 hover:border-accent/50 hover:text-accent-light",
  ghost: "bg-transparent text-neutral-400 hover:text-neutral-50",
};

const sizeClasses: Record<GlowButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-2xl font-semibold",
};

const baseClasses = "inline-flex items-center gap-2 cursor-pointer font-medium transition-all duration-200";

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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.button>
  );
}
