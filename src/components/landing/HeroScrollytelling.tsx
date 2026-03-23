'use client'

import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Send } from 'lucide-react'
import dynamic from 'next/dynamic'

const LineWaves = dynamic(() => import('@/components/ui/line-waves'), { ssr: false })

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

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
            style={{ background: color, zIndex: 4 - idx, borderColor: '#050505' }}
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

function TrustBar() {
  return (
    <div className="w-full border-t border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md py-6 relative z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap justify-center md:justify-between items-center gap-8 text-sm font-medium text-white/50">
        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3EE87A]/70" /> GSTIN compliant invoices</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3EE87A]/70" /> Section 194J TDS auto-calc</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3EE87A]/70" /> e-signature ready contracts</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#3EE87A]/70" /> Payment reminders & tracking</div>
      </div>
    </div>
  )
}

const HEADLINES = [
  { main: 'Freelancing in India is complicated.', sub: "Getting paid shouldn't be." },
  { main: 'Generate GST compliant invoices.', sub: 'In seconds. Not hours.' },
  { main: 'Every tax calculation, handled.', sub: 'CGST, SGST, IGST. Zero errors.' },
  { main: 'And finally, get paid.', sub: "The stamp you've been waiting for." },
]

export function HeroScrollytelling() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)

  // Headlines
  const hl0Ref = useRef<HTMLDivElement>(null)
  const hl1Ref = useRef<HTMLDivElement>(null)
  const hl2Ref = useRef<HTMLDivElement>(null)
  const hl3Ref = useRef<HTMLDivElement>(null)

  // Right Side Elements
  const headerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const taxRef = useRef<HTMLDivElement>(null)
  const totalRef = useRef<HTMLDivElement>(null)
  const pillsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  // Floating badges & UI
  const gstReadyBadgeRef = useRef<HTMLDivElement>(null)
  const paidStampRef = useRef<HTMLDivElement>(null)
  const scrollRevealRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const pin = pinnedRef.current
    const wrap = wrapRef.current
    if (!pin || !wrap) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        pin: pin,
        pinSpacing: false,
      },
    })

    // ── Set initial states ─────────────────────────────
    // Hide Headlines 1, 2, 3
    gsap.set([hl1Ref.current, hl2Ref.current, hl3Ref.current], { opacity: 0, y: 16 })
    
    // Hide parts of the invoice that appear later
    gsap.set(headerRef.current, { opacity: 0, y: 10 })
    gsap.set(itemsRef.current, { opacity: 0, y: 10 })
    gsap.set(taxRef.current, { opacity: 0, y: 10 })
    gsap.set(totalRef.current, { opacity: 0, y: 10 })
    gsap.set(pillsRef.current, { opacity: 0, y: 10 })
    gsap.set(buttonRef.current, { opacity: 0, y: 10 })
    
    gsap.set(gstReadyBadgeRef.current, { opacity: 0, scale: 0.5, y: -20 })
    gsap.set(paidStampRef.current, { opacity: 0, scale: 1.5 })
    gsap.set(scrollRevealRef.current, { opacity: 1 })

    // ── PHASE 1 (0 → 25%): Invoice Header In ──────────
    // Fade out Scroll Reveal text immediately
    tl.to(scrollRevealRef.current, { opacity: 0, y: 10, duration: 0.1 }, 0.0)

    tl.to(hl0Ref.current, { opacity: 0, y: -16, duration: 0.1 }, 0.05)
    tl.to(hl1Ref.current, { opacity: 1, y: 0, duration: 0.1 }, 0.1)
    
    tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.15 }, 0.15)
    tl.to(buttonRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.2)

    // ── PHASE 2 (25 → 50%): Line Items + Tax In ───────
    tl.to(hl1Ref.current, { opacity: 0, y: -16, duration: 0.1 }, 0.3)
    tl.to(hl2Ref.current, { opacity: 1, y: 0, duration: 0.1 }, 0.35)

    tl.to(itemsRef.current, { opacity: 1, y: 0, duration: 0.15 }, 0.4)
    tl.to(taxRef.current, { opacity: 1, y: 0, duration: 0.15 }, 0.45)

    // ── PHASE 3 (50 → 75%): Paid / Total ──────────────
    tl.to(hl2Ref.current, { opacity: 0, y: -16, duration: 0.1 }, 0.55)
    tl.to(hl3Ref.current, { opacity: 1, y: 0, duration: 0.1 }, 0.6)

    tl.to(totalRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.65)
    tl.to(pillsRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.7)
    
    // Pop the badges
    tl.to(gstReadyBadgeRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.15, ease: 'back.out(1.7)' }, 0.72)
    tl.to(paidStampRef.current, { opacity: 1, scale: 1, rotation: -12, duration: 0.2, ease: 'back.out(2.5)' }, 0.75)

    // ── PHASE 4 (75 → 100%): Fade to continue ─────────
    tl.to(pin, { opacity: 0, duration: 0.1 }, 0.9)

  }, { scope: wrapRef })

  return (
    <div ref={wrapRef} className="relative min-h-[500vh] w-full bg-[#050505]">
      <div ref={pinnedRef} className="relative h-screen w-full overflow-hidden flex flex-col justify-center pt-24">
        
        {/* Background Waves */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen">
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
            mouseInfluence={2}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 md:px-10 flex-1 flex flex-col justify-center h-full pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center w-full h-full">

            {/* LEFT TEXT COLUMN */}
            <div className="flex flex-col gap-8 relative z-10">
              
              <div className="inline-flex items-center gap-2 w-fit rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-white shadow-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#3EE87A]" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3EE87A]" />
                </span>
                Freelance OS
              </div>

              {/* Headline Container (Uses CSS Grid to automatically size to the tallest child, preventing overlap with paragraph) */}
              <div className="grid w-full">
                
                {/* Headline slot 0 */}
                <div ref={hl0Ref} className="col-start-1 row-start-1 pb-6">
                  <h1 className="leading-[1.1] tracking-tight flex flex-col gap-4 md:gap-6" style={{ fontSize: 'clamp(3.5rem, 6vw, 4.5rem)' }}>
                    <span className="text-white font-serif" style={{ fontFamily: '"DM Serif Display", serif' }}>
                      {HEADLINES[0].main}
                    </span>
                    <span className="text-white/50 italic font-serif leading-[1.1]" style={{ fontFamily: '"DM Serif Display", serif' }}>
                      {HEADLINES[0].sub}
                    </span>
                  </h1>
                </div>

                {/* Headline slots 1-3 */}
                {[hl1Ref, hl2Ref, hl3Ref].map((r, i) => (
                  <div key={i + 1} ref={r} className="col-start-1 row-start-1 pb-6">
                    <h2 className="leading-[1.1] tracking-tight flex flex-col gap-4 md:gap-6" style={{ fontSize: 'clamp(3.5rem, 6vw, 4.5rem)' }}>
                      <span className="text-white font-serif" style={{ fontFamily: '"DM Serif Display", serif' }}>
                        {HEADLINES[i + 1].main}
                      </span>
                      <span className="text-white/50 italic font-serif leading-[1.1]" style={{ fontFamily: '"DM Serif Display", serif' }}>
                        {HEADLINES[i + 1].sub}
                      </span>
                    </h2>
                  </div>
                ))}

              </div>

              <p className="text-lg leading-relaxed max-w-md font-medium text-white/80">
                The compliance-first OS for Indian consultants. Automate your invoices, e-FIRA, and TDS tracking so you can focus on shipping.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <Link
                  href="/auth/register"
                  className="group inline-flex w-full sm:w-auto h-14 items-center justify-center gap-2 rounded-xl px-8 text-[15px] font-bold transition-all duration-300 bg-white text-black hover:-translate-y-0.5"
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
              </div>

              <AvatarStack />
            </div>

            {/* RIGHT MOCKUP COLUMN */}
            <div className="w-full relative hidden md:block">
              {/* Floating Badge */}
              <div 
                ref={gstReadyBadgeRef}
                className="absolute -top-6 -right-6 z-20 flex items-center gap-1.5 bg-[#3EE87A] text-black px-4 py-2 rounded-full font-bold text-sm shadow-[0_12px_24px_rgba(62,232,122,0.3)] origin-bottom-left"
              >
                <CheckCircle2 className="w-4 h-4" />
                GST Ready
              </div>

              {/* Main Card */}
              <div className="relative z-10 bg-white border border-zinc-200 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.4)] p-6 md:p-8 backdrop-blur-xl max-w-lg mx-auto md:ml-auto min-h-[460px] flex flex-col">
                
                {/* Scroll to Reveal Placeholder */}
                <div 
                  ref={scrollRevealRef} 
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-12"
                >
                  <div className="w-10 h-10 mb-4 rounded-full border border-zinc-200 flex items-center justify-center animate-bounce shadow-sm bg-zinc-50">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase">Scroll to reveal</p>
                </div>

                {/* Header Phase */}
                <div ref={headerRef} className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mb-1">Invoice To</div>
                    <div className="text-zinc-900 font-medium text-lg">Acme Corp India</div>
                  </div>
                  <div className="text-right">
                    <div className="text-zinc-500 text-xs font-semibold tracking-wider uppercase mb-1">Invoice No</div>
                    <div className="text-zinc-900 font-mono text-sm">#INV-2026-004</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Items Phase */}
                  <div ref={itemsRef}>
                    <div className="flex justify-between text-sm pb-4 border-b border-zinc-100">
                      <div className="text-zinc-700">Strategy Consulting (40 hrs)</div>
                      <div className="text-zinc-900 font-mono">₹ 1,20,000</div>
                    </div>
                    <div className="flex justify-between text-sm pt-4">
                      <div className="text-zinc-500">Subtotal</div>
                      <div className="text-zinc-800 font-mono">₹ 1,20,000</div>
                    </div>
                  </div>

                  {/* Tax Phase */}
                  <div ref={taxRef} className="space-y-4 pt-4">
                    <div className="flex justify-between text-sm">
                      <div className="text-zinc-500">GST (18%)</div>
                      <div className="text-zinc-800 font-mono">+ ₹ 21,600</div>
                    </div>
                    <div className="flex justify-between text-sm pb-4 border-b border-zinc-100">
                      <div className="text-red-500">TDS u/s 194J (10%)</div>
                      <div className="text-red-500 font-mono">- ₹ 12,000</div>
                    </div>
                  </div>
                </div>

                {/* Total Phase */}
                <div ref={totalRef} className="flex justify-between items-center mb-8 pt-2">
                  <div className="text-zinc-600 font-medium">Net Receivable</div>
                  <div className="text-3xl font-semibold text-green-600 font-mono tracking-tight">
                    ₹ 1,29,600
                  </div>
                </div>

                {/* Action */}
                <button ref={buttonRef} className="w-full bg-black text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                  Send Invoice
                  <Send className="w-4 h-4 ml-1" />
                </button>

                {/* Pills Phase */}
                <div ref={pillsRef} className="flex flex-wrap gap-2 mt-6">
                  <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1 text-xs text-zinc-600">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> GST Validated
                  </div>
                  <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1 text-xs text-zinc-600">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> TDS Computed
                  </div>
                  <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1 text-xs text-zinc-600">
                    <FileText className="w-3 h-3 text-green-500" /> Contract Attached
                  </div>
                </div>

                {/* CSS PAID Stamp */}
                <div
                  ref={paidStampRef}
                  className="absolute bottom-16 -left-6 pointer-events-none origin-center"
                >
                  <div className="border-[4px] border-green-500 rounded-lg px-6 py-2 bg-white/90 backdrop-blur-sm shadow-xl">
                    <p className="text-green-500 font-black text-4xl tracking-[0.35em] uppercase leading-none">
                      PAID
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
      
      {/* Attached to bottom of animation wrap */}
      <div className="absolute bottom-0 left-0 w-full z-30">
        <TrustBar />
      </div>

    </div>
  )
}
