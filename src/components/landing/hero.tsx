'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const words = "Your GST Compliance, Sorted.".split(" ")

export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08, delayChildren: 0.1 * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
        duration: shouldReduceMotion ? 0 : 0.5
      },
    },
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 60,
    },
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[#0f172a]" />
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15)_0,rgba(15,23,42,0)_50%)]"
      />

      <div className="relative z-10 mx-auto max-w-4xl space-y-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
           className="mx-auto flex w-fit items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-300"
        >
          <span>🇮🇳</span> Built for Indian Freelancers
        </motion.div>

        <motion.h1
          className="text-5xl font-extrabold tracking-tight sm:text-7xl font-sans"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={child}
              className="inline-block mr-[0.25em]"
            >
              {word === "Sorted." ? <span className="text-teal-400">{word}</span> : word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: 0.4 }}
           className="mx-auto max-w-2xl text-lg text-slate-400 sm:text-xl"
        >
          Invoices. Contracts. GSTR-1. e-FIRA. All in one place, ₹299/mo.
        </motion.p>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: shouldReduceMotion ? 0 : 0.6, duration: 0.4 }}
           className="flex items-center justify-center pt-4"
        >
          <Link href="/auth/register" className="inline-flex h-14 items-center justify-center rounded-xl bg-teal-500 px-8 text-lg font-semibold text-white hover:bg-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.4)] transition-all">
            Start Free Trial
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
