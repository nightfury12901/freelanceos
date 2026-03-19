'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, FileCheck, CheckCircle2 } from 'lucide-react'

export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 md:px-8 bg-[#F8F9FA] pt-40 pb-20 border-b border-slate-200">
      
      {/* Soft radiant glow behind the text */}
      <div className="absolute top-20 left-0 w-[800px] h-[600px] bg-emerald-100/40 rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Copy Section */}
        <div className="space-y-8 max-w-2xl">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
             className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 uppercase tracking-widest shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Tier-One Compliance Stack
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 1, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-playfair font-medium text-slate-900 leading-[1.1] tracking-tight"
          >
            Compliance that <br />
            <span className="italic text-emerald-800">commands trust.</span>
          </motion.h1>

          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: 1 }}
             className="text-lg text-slate-600 leading-relaxed max-w-md font-sans"
          >
            FreelanceOS brings institutional-grade financial structure to your solo practice. Generate GST & LUT invoices, track e-FIRA, and stay impeccably compliant in India.
          </motion.p>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: 1 }}
             className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <Link href="/auth/register" className="group flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-emerald-800 px-8 font-medium text-white transition-all duration-300 hover:bg-emerald-900 shadow-[0_8px_20px_rgb(6,78,59,0.15)] hover:shadow-[0_12px_25px_rgb(6,78,59,0.25)] hover:-translate-y-0.5">
              Start Your Free Trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="text-sm text-slate-500 font-medium">No credit card required.</p>
          </motion.div>
        </div>

        {/* Right Graphical Composition */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 2 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:ml-auto w-full max-w-[500px]"
        >
           {/* Abstract Invoice Card */}
           <div className="relative bg-white rounded-2xl p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100/50 backdrop-blur-2xl transition-transform duration-700 hover:rotate-0">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-10 pb-6 border-b border-slate-100">
                <div>
                  <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-slate-100 rounded mt-3" />
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <FileCheck className="h-5 w-5" />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-6 mb-10">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <div className="h-4 w-40 bg-slate-100 rounded mb-2" />
                        <div className="h-2 w-20 bg-slate-50 rounded" />
                      </div>
                    </div>
                    <div className="h-4 w-16 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                <div className="h-4 w-24 bg-slate-100 rounded" />
                <div className="h-8 w-32 bg-emerald-900 rounded" />
              </div>
              
              {/* Floating Element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-12 -bottom-10 bg-white p-4 rounded-xl shadow-2xl border border-slate-100 flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-700 font-bold text-lg">₹</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">GSTR-1 Filed</p>
                  <p className="text-sm font-bold text-slate-900">Successfully</p>
                </div>
              </motion.div>
           </div>
        </motion.div>
      </div>
    </section>
  )
}
