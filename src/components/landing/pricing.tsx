'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { SUBSCRIPTION_PLANS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="pricing" className="bg-[#F8F9FA] px-4 py-32 border-b border-slate-200">
      
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="mb-20 text-center space-y-8">
          <h2 className="text-5xl font-playfair font-medium tracking-tight text-slate-900 sm:text-6xl">
            Clear, uncompromising value.
          </h2>
          
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex p-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
              <button 
                onClick={() => setBilling('monthly')}
                className={cn("rounded-full px-8 py-2.5 text-sm font-semibold transition-all duration-300 outline-none", billing === 'monthly' ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900")}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBilling('yearly')}
                className={cn("relative rounded-full px-8 py-2.5 text-sm font-semibold transition-all duration-300 outline-none", billing === 'yearly' ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900")}
              >
                Yearly
                <span className="absolute -top-3 -right-4 inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {SUBSCRIPTION_PLANS.map((plan, idx) => {
            const isPro = plan.highlighted;
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-3xl p-10 transition-all duration-500 shadow-sm hover:shadow-xl",
                  isPro 
                    ? "border-none bg-emerald-900 shadow-[0_20px_40px_rgba(6,78,59,0.15)] -translate-y-4 text-white" 
                    : "border border-slate-200 bg-white text-slate-900 hover:-translate-y-2"
                )}
              >
                {isPro && (
                  <div className="mb-6 inline-flex w-max rounded-full bg-emerald-800 px-4 py-1.5 text-xs font-bold text-emerald-100 tracking-widest uppercase shadow-sm">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className={cn("text-2xl font-semibold font-playfair", isPro ? "text-white" : "text-slate-900")}>{plan.name}</h3>
                  <p className={cn("text-sm mt-3 h-10 leading-relaxed", isPro ? "text-emerald-100/80" : "text-slate-500")}>{plan.description}</p>
                </div>

                <div className="mb-6 flex items-baseline">
                  <span className={cn("text-3xl font-medium mr-1.5", isPro ? "text-emerald-400" : "text-slate-400")}>₹</span>
                  <span className="text-6xl font-semibold tracking-[-0.04em] relative inline-flex overflow-hidden min-w-[3ch]">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="inline-block"
                      >
                        {billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className={cn("ml-2 font-medium", isPro ? "text-emerald-400" : "text-slate-500")}>/mo</span>
                </div>
                
                <AnimatePresence>
                  <div className="h-6 mb-8">
                    {billing === 'yearly' && ('yearlyTotal' in plan) && (plan as any).yearlyTotal > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className={cn("text-sm font-medium", isPro ? "text-emerald-300" : "text-emerald-700")}
                      >
                        Billed ₹{(plan as any).yearlyTotal} yearly
                      </motion.div>
                    )}
                  </div>
                </AnimatePresence>

                <div className={cn("mb-8 w-full h-px", isPro ? "bg-emerald-800/50" : "bg-slate-100")} />

                <ul className="mb-12 flex-1 space-y-5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <Check className={cn("mr-4 h-5 w-5 shrink-0", isPro ? "text-emerald-400" : "text-emerald-600")} />
                      <span className={cn("leading-snug font-medium", isPro ? "text-emerald-50/90" : "text-slate-700")}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href={`/auth/register?plan=${plan.id}`}
                  className={cn(
                    "inline-flex items-center justify-center w-full rounded-xl py-4 font-semibold outline-none transition-all duration-300 mt-auto",
                    isPro 
                      ? "bg-white text-emerald-900 shadow-md hover:scale-[1.02]"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200 hover:scale-[1.02]"
                  )}
                >
                    {plan.cta}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
