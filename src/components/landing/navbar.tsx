'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full border border-white/[0.08] bg-[#0a0a0a]/70 px-6 py-3.5 backdrop-blur-xl transition-all shadow-2xl shadow-black/50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.8)] transition-all duration-300" />
          <span className="text-lg font-bold tracking-tight text-white">
            FreelanceOS
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 px-6">
          <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300">Features</Link>
          <Link href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="hidden text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-300 sm:block">Sign In</Link>
          <Link href="/auth/register" className="inline-flex h-9 items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black shadow-[0_4px_14px_0_rgba(255,255,255,0.15)] transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
