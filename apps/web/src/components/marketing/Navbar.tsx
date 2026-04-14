"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShieldCheck } from "lucide-react";
import { GlowButton } from "../ui/GlowButton";

type NavItem = {
  label: string;
  sectionId: "features" | "how-it-works" | "pricing" | "security";
};

const navItems: NavItem[] = [
  { label: "Features", sectionId: "features" },
  { label: "How It Works", sectionId: "how-it-works" },
  { label: "Pricing", sectionId: "pricing" },
  { label: "Security", sectionId: "security" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: NavItem["sectionId"]) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass border-b border-surface-border/50" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <a href="/" className="inline-flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-accent" />
          <span className="text-sm font-semibold text-neutral-50">
            TrustRespond<span className="text-accent">.ai</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <button
              key={item.sectionId}
              type="button"
              onClick={() => scrollToSection(item.sectionId)}
              className="cursor-pointer text-sm text-neutral-400 transition-colors duration-200 hover:text-neutral-50"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <GlowButton href="/auth/sign-in" variant="ghost" size="sm">
            Log in
          </GlowButton>
          <GlowButton href="/auth/sign-up" variant="primary" size="sm">
            Start Free Trial
          </GlowButton>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-xl p-2 text-neutral-50 transition-colors hover:bg-white/5 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full border-t border-surface-border/50 glass md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4">
              {navItems.map((item) => (
                <button
                  key={item.sectionId}
                  type="button"
                  onClick={() => scrollToSection(item.sectionId)}
                  className="cursor-pointer rounded-lg px-2 py-2 text-left text-sm text-neutral-400 transition-colors duration-200 hover:text-neutral-50"
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-2 flex items-center gap-2">
                <GlowButton href="/auth/sign-in" variant="ghost" size="sm" className="flex-1 justify-center">
                  Log in
                </GlowButton>
                <GlowButton href="/auth/sign-up" variant="primary" size="sm" className="flex-1 justify-center">
                  Start Free Trial
                </GlowButton>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
