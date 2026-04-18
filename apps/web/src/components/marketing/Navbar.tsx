"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { GlowButton } from "../ui/GlowButton";

const SECTION_IDS = ["how-it-works", "trust-center", "pricing", "security"] as const;

type SectionId = (typeof SECTION_IDS)[number];

type NavItem = {
  label: string;
  sectionId: SectionId;
};

const navItems: NavItem[] = [
  { label: "How It Works", sectionId: "how-it-works" },
  { label: "Trust Center", sectionId: "trust-center" },
  { label: "Pricing", sectionId: "pricing" },
  { label: "Security", sectionId: "security" },
];

function useActiveSection(): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const compute = () => {
      const headerOffset = 96;
      let current: SectionId | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= headerOffset) {
          current = id;
        }
      }
      setActive(current);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return active;
}

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const activeSection = useActiveSection();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelled = false;
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setUser(session?.user ?? null);
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.refresh();
    setIsMobileMenuOpen(false);
  }

  const scrollToSection = (sectionId: SectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "glass border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.32)]"
          : "border-white/[0.06] bg-slate-950/65 backdrop-blur-xl"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald" />
          <span className="text-sm font-semibold text-neutral-50">
            TrustRespond<span className="text-emerald-light">.ai</span>
          </span>
        </Link>

        <div className="hidden items-center gap-5 md:flex md:gap-6">
          {navItems.map((item) => {
            const isActive = activeSection === item.sectionId;
            return (
              <button
                key={item.sectionId}
                type="button"
                onClick={() => scrollToSection(item.sectionId)}
                className={`cursor-pointer border-b-2 border-transparent pb-0.5 text-sm transition-all duration-200 ease-out hover:text-slate-100 ${
                  isActive ? "border-emerald font-medium text-slate-100" : "text-neutral-400 hover:-translate-y-px"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <GlowButton href="/app" variant="primary" size="sm">
                Workspace
              </GlowButton>
              <GlowButton variant="ghost" size="sm" onClick={() => void handleSignOut()}>
                Log out
              </GlowButton>
            </>
          ) : (
            <>
              <GlowButton href="/auth/sign-in" variant="ghost" size="sm">
                Log in
              </GlowButton>
              <GlowButton href="/auth/sign-up" variant="primary" size="sm">
                Start Free Trial
              </GlowButton>
            </>
          )}
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
            className="w-full border-t border-white/10 glass md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4">
              {navItems.map((item) => {
                const isActive = activeSection === item.sectionId;
                return (
                  <button
                    key={item.sectionId}
                    type="button"
                    onClick={() => scrollToSection(item.sectionId)}
                    className={`cursor-pointer rounded-lg px-2 py-2 text-left text-sm transition-all duration-200 ease-out hover:text-slate-100 ${
                      isActive ? "border-l-2 border-emerald bg-white/[0.04] pl-3 font-medium text-slate-100" : "text-neutral-400 hover:-translate-y-px"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <div className="mt-2 flex items-center gap-2">
                {user ? (
                  <>
                    <GlowButton href="/app" variant="primary" size="sm" className="flex-1 justify-center">
                      Workspace
                    </GlowButton>
                    <GlowButton variant="ghost" size="sm" className="flex-1 justify-center" onClick={() => void handleSignOut()}>
                      Log out
                    </GlowButton>
                  </>
                ) : (
                  <>
                    <GlowButton href="/auth/sign-in" variant="ghost" size="sm" className="flex-1 justify-center">
                      Log in
                    </GlowButton>
                    <GlowButton href="/auth/sign-up" variant="primary" size="sm" className="flex-1 justify-center">
                      Start Free Trial
                    </GlowButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
