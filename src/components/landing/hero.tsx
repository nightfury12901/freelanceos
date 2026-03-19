'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 text-center bg-[#050505]">
      {/* Liquid Glass Ambient Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/10 rounded-[100%] blur-[120px] opacity-70 animate-pulse mix-blend-screen pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] opacity-40 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-blue-500/10 rounded-[100%] blur-[120px] opacity-40 mix-blend-screen pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl space-y-10 mt-16">
        <motion.div
           initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
           animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
           transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md px-5 py-2 text-sm font-medium text-zinc-300 shadow-2xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          Next-Gen Compliance for India
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-6xl font-bold tracking-tight sm:text-8xl font-sans text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-sm pb-2"
        >
          Your GST Workflow,<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600">Perfectly Sorted.</span>
        </motion.h1>

        <motion.p
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl font-light leading-relaxed"
        >
          Invoices. Contracts. e-FIRA tracker. Seamlessly integrated into one premium dashboard. Automate your tax filing for just ₹299/mo.
        </motion.p>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link href="/auth/register" className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-amber-500 px-8 font-medium text-black transition-all duration-300 hover:scale-105 hover:bg-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]">
            <span className="relative z-10 flex items-center gap-2 text-lg font-bold">
              Start Free Trial
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/000000/svg" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </span>
          </Link>
          <Link href="#features" className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-8 font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20">
            Explore Features
          </Link>
        </motion.div>
      </div>
      
      {/* Bottom Fade Mask */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </section>
  )
}
