'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import Link from 'next/link'
import { SUBSCRIPTION_PLANS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="pricing" className="bg-[#0f172a] px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-6 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-full">
              <button 
                onClick={() => setBilling('monthly')}
                className={cn("rounded-full px-6 py-2 text-sm font-medium transition-colors outline-none", billing === 'monthly' ? "bg-teal-500 text-white" : "text-slate-300 hover:text-white")}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBilling('yearly')}
                className={cn("relative rounded-full px-6 py-2 text-sm font-medium transition-colors outline-none", billing === 'yearly' ? "bg-teal-500 text-white" : "text-slate-300 hover:text-white")}
              >
                Yearly
                <span className="absolute -top-3 -right-6 inline-flex animate-bounce items-center rounded-full bg-teal-400/20 border border-teal-500/30 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto items-start">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-3xl p-8 backdrop-blur-sm transition-all",
                plan.highlighted 
                  ? "border border-teal-500 shadow-[0_0_40px_rgba(20,184,166,0.15)] bg-white/10" 
                  : "border border-white/10 bg-white/5 border-b-[3px] border-b-teal-500/50"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-teal-500 px-4 py-1 text-xs font-bold text-white tracking-wide uppercase">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-slate-400 mt-2 h-10">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">₹</span>
                <span className="text-5xl font-extrabold tracking-tight ml-1 relative h-14 overflow-hidden flex items-center min-w-[3ch]">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                      className="absolute left-0"
                    >
                      {billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="ml-2 text-slate-400">/mo</span>
              </div>
              
              <AnimatePresence>
                {billing === 'yearly' && ('yearlyTotal' in plan) && (plan as any).yearlyTotal > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-teal-400 mb-6 font-medium"
                  >
                    Billed ₹{(plan as any).yearlyTotal} yearly
                  </motion.div>
                )}
              </AnimatePresence>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-300">
                    <Check className="mr-3 h-5 w-5 shrink-0 text-teal-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href={`/auth/register?plan=${plan.id}`}
                className={cn(
                  "inline-flex items-center justify-center w-full rounded-xl py-4 flex-1 max-h-12 font-bold outline-none",
                  plan.highlighted 
                    ? "bg-teal-500 hover:bg-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                    : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                  {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
