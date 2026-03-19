'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl"
    >
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-lg">
        <Link href="/" className="text-xl font-bold tracking-tight text-teal-400">
          FreelanceOS
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</Link>
          <Link href="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
        </div>
        <Link href="/auth/register" className="inline-flex h-9 items-center justify-center rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-colors hover:bg-teal-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500">
          Get Started
        </Link>
      </div>
    </motion.nav>
  )
}
