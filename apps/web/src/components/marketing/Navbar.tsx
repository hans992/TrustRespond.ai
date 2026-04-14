"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-100">
          <span className="inline-flex rounded-md border border-emerald-300/25 bg-emerald-500/15 p-1 text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
          </span>
          TrustRespond.ai
        </Link>

        <div className="flex items-center gap-3">
          <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.18 }}>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Log in
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.18 }}>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center rounded-lg border border-emerald-300/30 bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}
