import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--color-surface, #060B14)",
          card: "var(--color-surface-card, #0D1526)",
          elevated: "var(--color-surface-elevated, #141F35)",
          border: "var(--color-surface-border, #1E2D4A)",
        },
        accent: {
          DEFAULT: "var(--color-accent, #0A84FF)",
          light: "var(--color-accent-light, #34AAFF)",
          glow: "var(--color-accent-glow, rgba(10,132,255,0.25))",
        },
        emerald: {
          DEFAULT: "var(--color-emerald, #30D158)",
          light: "var(--color-emerald-light, #4CD964)",
          glow: "var(--color-emerald-glow, rgba(48,209,88,0.2))",
        },
        neutral: {
          50: "var(--color-neutral-50, #F5F5F7)",
          100: "var(--color-neutral-100, #E8E8ED)",
          400: "var(--color-neutral-400, #86868B)",
          600: "var(--color-neutral-600, #48484A)",
          800: "var(--color-neutral-800, #1C1C1E)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: ["SF Mono", "JetBrains Mono", "Fira Code", "monospace"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "indeterminate-bar": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(420%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(10,132,255,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(10,132,255,0.6)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
        "indeterminate-bar": "indeterminate-bar 1.25s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        "glow-blue":
          "0 0 30px rgba(10,132,255,0.3), 0 0 60px rgba(10,132,255,0.1)",
        "glow-emerald":
          "0 0 30px rgba(48,209,88,0.3), 0 0 60px rgba(48,209,88,0.1)",
        card: "0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover":
          "0 4px 16px rgba(0,0,0,0.5), 0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
    },
  },
};

export default config;
