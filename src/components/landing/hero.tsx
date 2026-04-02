'use client'

import Link from 'next/link'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { ArrowRight, CheckCircle2, FileText, Send } from 'lucide-react'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const LineWaves = dynamic(() => import('@/components/ui/line-waves'), { ssr: false })

function AvatarStack() {
  const avatars = [
    { i: 'A', color: '#16a34a' },
    { i: 'R', color: '#059669' },
    { i: 'P', color: '#0891b2' },
    { i: 'S', color: '#7c3aed' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-4 py-4 mt-4 border-t border-white/10">
      <div className="flex -space-x-2">
        {avatars.map(({ i, color }, idx) => (
          <div
            key={idx}
            className="h-8 w-8 text-xs rounded-full border-2 flex items-center justify-center font-bold text-white shrink-0"
            style={{ background: color, zIndex: 4 - idx, borderColor: '#0a0a0f' }}
          >
            {i}
          </div>
        ))}
      </div>
      <div className="text-sm font-medium text-white/60 flex items-center gap-3">
        <span>2,400+ Indian consultants</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span className="text-white/90 font-semibold">₹18Cr+ Invoiced this year</span>
      </div>
    </div>
  )
}

function InvoiceMockup() {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative w-full max-w-lg mx-auto md:ml-auto select-none"
    >
      {/* Floating Badge */}
      <m.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 z-20 flex items-center gap-1.5 bg-[#3EE87A] text-black px-4 py-2 rounded-full font-bold text-sm shadow-[0_12px_24px_rgba(62,232,122,0.3)]"
      >
        <CheckCircle2 className="w-4 h-4" />
        GST Ready
      </m.div>

      {/* Main Card */}
      <div className="relative z-10 bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-white/40 text-xs font-semibold tracking-wider uppercase mb-1">Invoice To</div>
            <div className="text-white font-medium text-lg">Acme Corp India</div>
          </div>
          <div className="text-right">
            <div className="text-white/40 text-xs font-semibold tracking-wider uppercase mb-1">Invoice No</div>
            <div className="text-white font-mono text-sm">#INV-2026-004</div>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm pb-4 border-b border-white/10">
            <div className="text-white/80">Strategy Consulting (40 hrs)</div>
            <div className="text-white font-mono">₹ 1,20,000</div>
          </div>
          <div className="flex justify-between text-sm">
            <div className="text-white/60">Subtotal</div>
            <div className="text-white/80 font-mono">₹ 1,20,000</div>
          </div>
          <div className="flex justify-between text-sm">
            <div className="text-white/60">GST (18%)</div>
            <div className="text-white/80 font-mono">+ ₹ 21,600</div>
          </div>
          <div className="flex justify-between text-sm pb-4 border-b border-white/10">
            <div className="text-[#ff453a]/90">TDS u/s 194J (10%)</div>
            <div className="text-[#ff453a]/90 font-mono">- ₹ 12,000</div>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-white/80 font-medium">Net Receivable</div>
          <div className="text-3xl font-semibold text-[#3EE87A] font-mono tracking-tight">
            ₹ 1,29,600
          </div>
        </div>

        {/* Action */}
        <button className="w-full bg-white text-black font-bold h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-[#3EE87A] transition-colors">
          Send Invoice
          <Send className="w-4 h-4 ml-1" />
        </button>

        {/* Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-xs text-white/70">
            <CheckCircle2 className="w-3 h-3 text-[#3EE87A]" /> GST Validated
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-xs text-white/70">
            <CheckCircle2 className="w-3 h-3 text-[#3EE87A]" /> TDS Computed
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-xs text-white/70">
            <FileText className="w-3 h-3 text-[#3EE87A]" /> Contract Attached
          </div>
        </div>
      </div>
    </m.div>
  )
}

function TrustBar() {
  return (
    <div className="w-full border-y border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md py-6 mt-16 relative z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap justify-center md:justify-between items-center gap-8 text-sm font-medium text-white/50">
        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3EE87A]/70" /> GSTIN compliant invoices</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3EE87A]/70" /> Section 194J TDS auto-calc</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3EE87A]/70" /> e-signature ready contracts</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3EE87A]/70" /> Payment reminders & tracking</div>
      </div>
    </div>
  )
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  // Ensure DM Serif Display is imported globally or use a nice web safe serif fallback for now
  // We'll rely on global font-serif class tying to DM Serif Display in layout.tsx if we set it, 
  // or standard serif if not.

  return (
    <LazyMotion features={domAnimation}>
      <section
        className="relative flex min-h-[100svh] flex-col overflow-hidden pt-32 bg-[#050505]"
      >
        {/* LineWaves — z-0 */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen">
          <Suspense fallback={null}>
            <LineWaves
              speed={0.25}
              innerLineCount={24}
              outerLineCount={30}
              warpIntensity={1.5}
              rotation={-45}
              colorCycleSpeed={1}
              brightness={0.15}
              color1="#ffffff"
              color2="#3EE87A"
              color3="#ffffff"
              enableMouseInteraction
              mouseInfluence={2}
            />
          </Suspense>
        </div>

        {/* Content — z-10 */}
        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 md:px-10 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center w-full">

            {/* LEFT TEXT COLUMN */}
            <div className="flex flex-col gap-8 relative z-10 pt-10 lg:pt-0">
              {/* Badge */}
              <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.55 }}
                className="inline-flex items-center gap-2 w-fit rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-white"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#3EE87A]" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3EE87A]" />
                </span>
                Freelance OS
              </m.div>

              {/* Headline */}
              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.65, delay: 0.1 }}
                className="leading-[1.05] tracking-tight flex flex-col gap-2"
                style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
              >
                <span className="text-white font-serif" style={{ fontFamily: '"DM Serif Display", serif' }}>
                  Freelancing in India is complicated.
                </span>
                <span className="text-white/38 italic font-serif" style={{ fontFamily: '"DM Serif Display", serif', opacity: 0.38 }}>
                  Getting paid shouldn&apos;t be.
                </span>
              </m.h1>

              {/* Subtext */}
              <m.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.25, duration: 0.6 }}
                className="text-lg leading-relaxed max-w-md font-medium text-white/60"
              >
                The compliance-first OS for Indian consultants. Automate your invoices, e-FIRA, and TDS tracking so you can focus on shipping.
              </m.p>

              {/* CTAs */}
              <m.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.35, duration: 0.55 }}
                className="flex flex-col sm:flex-row items-center gap-4 mt-2"
              >
                <Link
                  href="/auth/register"
                  className="group inline-flex w-full sm:w-auto h-14 items-center justify-center gap-2 rounded-xl px-8 text-[15px] font-bold transition-all duration-300 bg-white text-black hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,255,255,0.4)]"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex w-full sm:w-auto h-14 items-center justify-center rounded-xl px-8 text-[15px] font-semibold transition-all duration-300 bg-white/5 border border-white/25 text-white hover:bg-white/10 hover:-translate-y-0.5"
                >
                  See Pricing
                </Link>
              </m.div>

              {/* Social proof */}
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.5 }}
              >
                <AvatarStack />
              </m.div>
            </div>

            {/* RIGHT MOCKUP COLUMN */}
            <div className="w-full mt-10 lg:mt-0">
              <Suspense
                fallback={
                  <div className="w-full max-w-lg mx-auto h-[400px] rounded-2xl animate-pulse bg-white/5 border border-white/10" />
                }
              >
                <InvoiceMockup />
              </Suspense>
            </div>

          </div>
        </div>

        {/* Bottom Trust Bar */}
        <TrustBar />
      </section>
    </LazyMotion>
  )
}
