'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  const [timeStr, setTimeStr] = useState('D2026-03-23 T10:45:00')

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const pad = (n: number) => n.toString().padStart(2, '0')
      
      const yr = d.getFullYear()
      const mo = pad(d.getMonth() + 1)
      const dy = pad(d.getDate())
      
      const hr = pad(d.getHours())
      const mi = pad(d.getMinutes())
      const sc = pad(d.getSeconds())
      
      setTimeStr(`D${yr}-${mo}-${dy} T${hr}:${mi}:${sc}`)
    }
    tick()
    const int = setInterval(tick, 1000)
    return () => clearInterval(int)
  }, [])

  return (
    <footer className="bg-[#e5e5e5] text-[#050505] px-6 py-12 md:px-12 md:py-16 flex flex-col w-full font-mono relative overflow-hidden z-20">
      
      {/* Top Row: Logo + Links + Contact */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-black/10 pb-16 w-full max-w-[1400px] mx-auto">
        <div className="flex gap-8 md:gap-16">
          <div className="w-12 h-12 rounded-full border-2 border-black/20 flex items-center justify-center font-bold text-xl shrink-0">
            F
          </div>
          <div className="flex flex-col gap-1.5 text-[12px] md:text-[14px] tracking-widest uppercase font-semibold">
            <Link href="#pricing" className="hover:text-black/50 transition-colors">Invoicing</Link>
            <Link href="#features" className="hover:text-black/50 transition-colors">Contracts</Link>
            <Link href="#features" className="hover:text-black/50 transition-colors">e-FIRA</Link>
            <Link href="#pricing" className="hover:text-black/50 transition-colors">CRM Dashboard</Link>
            <Link href="#features" className="hover:text-black/50 transition-colors">About</Link>
          </div>
        </div>
        
        <div className="flex flex-col md:items-end gap-3 text-[12px] md:text-[14px] tracking-widest font-semibold uppercase mt-8 md:mt-0">
          <a href="mailto:hello@freelanceos.dev" className="hover:text-black/50 transition-colors underline underline-offset-4 decoration-black/20 hover:decoration-black">
            HELLO@FREELANCEOS.DEV
          </a>
          <div className="flex gap-5 mt-2">
            <Twitter className="h-5 w-5 hover:text-black/50 transition-colors cursor-pointer" />
            <Linkedin className="h-5 w-5 hover:text-black/50 transition-colors cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Middle Row: Massive Live Date Time */}
      <div className="pt-24 pb-16 w-full text-left max-w-[1400px] mx-auto">
        <h2 className="text-[10vw] md:text-[8vw] lg:text-[7vw] font-bold tracking-tighter tabular-nums leading-none opacity-90">
          {timeStr}
        </h2>
      </div>

      {/* Bottom Massive Inverted Text */}
      <div className="w-full flex justify-center py-12 border-b border-black/10 overflow-hidden">
        <h1 
           className="text-[14vw] md:text-[13.5vw] leading-[0.70] font-black tracking-tighter whitespace-nowrap opacity-90 scale-x-[-1] scale-y-[-1] select-none uppercase"
           aria-hidden="true"
        >
          Freelance OS
        </h1>
      </div>

      {/* Credits */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-[11px] md:text-[12px] font-semibold tracking-wider text-black/40 uppercase max-w-[1400px] mx-auto w-full">
        <div>© {new Date().getFullYear()} FREELANCE OS. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-8 mt-6 md:mt-0">
          <Link href="#" className="hover:text-black/80 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-black/80 transition-colors">Terms of Service</Link>
        </div>
      </div>

    </footer>
  )
}
