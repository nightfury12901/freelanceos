'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

export function Navbar() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 pt-6 pointer-events-none"
    >
      <div className="pointer-events-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-slate-200/60 bg-white/80 px-8 py-4 backdrop-blur-xl transition-all shadow-sm">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-4 w-4 rounded-sm bg-emerald-700 shadow-sm" />
          <span className="text-xl font-bold tracking-tight text-slate-900 font-playfair">
            FreelanceOS
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-10 px-6">
          <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors duration-300">Features</Link>
          <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors duration-300">Pricing</Link>
          <Link href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors duration-300">Testimonials</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="hidden text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors duration-300 sm:block">Sign In</Link>
          <Link href="/auth/register" className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-700 px-6 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-emerald-800 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            Start Free Trial
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
