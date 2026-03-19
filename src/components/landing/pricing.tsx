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
    <section id="pricing" className="bg-[#050505] px-4 py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-[100%] blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-8 sm:text-5xl">
            Simple, transparent pricing
          </h2>
          
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md shadow-xl">
              <button 
                onClick={() => setBilling('monthly')}
                className={cn("rounded-full px-8 py-2.5 text-sm font-semibold transition-all duration-300 outline-none", billing === 'monthly' ? "bg-white text-black shadow-md" : "text-zinc-400 hover:text-white")}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBilling('yearly')}
                className={cn("relative rounded-full px-8 py-2.5 text-sm font-semibold transition-all duration-300 outline-none", billing === 'yearly' ? "bg-white text-black shadow-md" : "text-zinc-400 hover:text-white")}
              >
                Yearly
                <span className="absolute -top-3 -right-4 inline-flex items-center rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {SUBSCRIPTION_PLANS.map((plan, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-[2rem] p-8 backdrop-blur-xl transition-all duration-500",
                plan.highlighted 
                  ? "border border-amber-500/50 bg-white/[0.03] shadow-[0_0_50px_rgba(245,158,11,0.1)] -translate-y-4" 
                  : "border border-white/[0.08] bg-white/[0.01]"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 px-5 py-1.5 text-xs font-bold text-black tracking-widest uppercase shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-zinc-400 mt-2 h-10">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline text-white">
                <span className="text-3xl font-bold text-zinc-500 mr-1">₹</span>
                <span className="text-6xl font-extrabold tracking-[-0.04em] relative h-[72px] overflow-hidden flex items-center min-w-[3ch]">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0"
                    >
                      {billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="ml-2 text-zinc-500 font-medium">/mo</span>
              </div>
              
              <AnimatePresence>
                <div className="h-6 mb-6">
                  {billing === 'yearly' && ('yearlyTotal' in plan) && (plan as any).yearlyTotal > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-sm text-amber-500 font-medium"
                    >
                      Billed ₹{(plan as any).yearlyTotal} yearly
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>

              <div className="mb-8 w-full h-px bg-white/10" />

              <ul className="mb-10 flex-1 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm text-zinc-300">
                    <Check className="mr-4 h-5 w-5 shrink-0 text-amber-500" />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href={`/auth/register?plan=${plan.id}`}
                className={cn(
                  "inline-flex items-center justify-center w-full rounded-full py-4 font-bold outline-none transition-all duration-300 mt-auto",
                  plan.highlighted 
                    ? "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]"
                    : "bg-white/10 hover:bg-white/20 text-white hover:scale-[1.02]"
                )}
              >
                  {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
