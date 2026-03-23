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
    <section id="pricing" className="bg-muted px-4 py-32 border-b border-border">
      <div className="mx-auto max-w-6xl relative z-10">

        {/* Heading */}
        <div className="mb-20 text-center space-y-8">
          <h2 className="text-5xl font-playfair font-medium tracking-tight text-foreground sm:text-6xl">
            Clear, uncompromising value.
          </h2>

          {/* Billing toggle — badge sits OUTSIDE the pill, above it */}
          <div className="flex flex-col items-center gap-3">
            {/* "Save 17%" badge floats above the toggle, never overlaps */}
            <div className={cn(
              "inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold text-primary uppercase tracking-widest transition-opacity duration-300",
              billing === 'yearly' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}>
              Save 17%
            </div>
            <div className="flex p-1.5 rounded-full shadow-sm" style={{ background: '#27272a', border: '1px solid #3f3f46' }}>
              <button
                onClick={() => setBilling('monthly')}
                className={cn(
                  "rounded-full px-8 py-2.5 text-sm font-semibold transition-all duration-300 outline-none",
                  billing === 'monthly'
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={cn(
                  "rounded-full px-8 py-2.5 text-sm font-semibold transition-all duration-300 outline-none",
                  billing === 'yearly'
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Plans grid — all 3 get a border; Pro gets green border + green bg */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto items-end">
          {SUBSCRIPTION_PLANS.map((plan, idx) => {
            const isPro = plan.highlighted
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                key={plan.id}
                className={cn(
                  "group relative flex flex-col rounded-3xl p-10 transition-all duration-300 cursor-pointer",
                  isPro
                    ? "border-2 border-primary bg-primary shadow-[0_24px_60px_rgba(34,197,94,0.25)] -translate-y-4 hover:bg-black hover:border-white"
                    : "border border-border bg-zinc-900 hover:-translate-y-2 hover:shadow-xl hover:bg-white hover:border-transparent"
                )}
              >
                {isPro && (
                  <div className="mb-5 inline-flex w-max rounded-full bg-black/20 px-4 py-1.5 text-xs font-bold text-white tracking-widest uppercase group-hover:bg-white/20">
                    Most Popular
                  </div>
                )}

                {plan.id !== 'free' && (
                  <div className={cn(
                    "mb-3 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter w-fit",
                    isPro ? "bg-white text-primary" : "bg-primary/20 text-primary border border-primary/30"
                  )}>
                    1st Month ₹0 (Promo)
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={cn(
                    "text-2xl font-semibold font-playfair transition-colors duration-300",
                    isPro ? "text-white group-hover:text-white" : "text-foreground group-hover:text-black"
                  )}>
                    {plan.name}
                  </h3>
                  <p className={cn(
                    "text-sm mt-3 h-10 leading-relaxed transition-colors duration-300",
                    isPro ? "text-white/75 group-hover:text-white/60" : "text-muted-foreground group-hover:text-zinc-600"
                  )}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-4 flex items-baseline">
                  <span className={cn(
                    "text-3xl font-medium mr-1.5 transition-colors duration-300",
                    isPro ? "text-white/80" : "text-muted-foreground/60 group-hover:text-zinc-400"
                  )}>₹</span>
                  <span className="text-6xl font-semibold tracking-[-0.04em] relative inline-flex overflow-hidden min-w-[3ch]">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "inline-block transition-colors duration-300",
                          isPro ? "text-white" : "text-foreground group-hover:text-black"
                        )}
                      >
                        {billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className={cn(
                    "ml-2 font-medium transition-colors duration-300",
                    isPro ? "text-white/80" : "text-muted-foreground group-hover:text-zinc-500"
                  )}>/mo</span>
                </div>

                <div className="h-6 mb-6">
                  <AnimatePresence>
                    {billing === 'yearly' && ('yearlyTotal' in plan) && (plan as any).yearlyTotal > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className={cn(
                          "text-sm font-medium transition-colors duration-300",
                          isPro ? "text-white/75" : "text-primary group-hover:text-primary"
                        )}
                      >
                        Billed ₹{(plan as any).yearlyTotal} yearly
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className={cn(
                  "mb-8 w-full h-px transition-colors duration-300",
                  isPro ? "bg-white/20" : "bg-border group-hover:bg-zinc-200"
                )} />

                <ul className="mb-12 flex-1 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm gap-3">
                      <div className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                        isPro ? "bg-white/20 group-hover:bg-white/30" : "bg-primary/10 group-hover:bg-black/10"
                      )}>
                        <Check className={cn(
                          "h-3 w-3 transition-colors duration-300",
                          isPro ? "text-white" : "text-primary group-hover:text-black"
                        )} strokeWidth={3} />
                      </div>
                      <span className={cn(
                        "leading-snug font-medium transition-colors duration-300",
                        isPro ? "text-white/90 group-hover:text-white" : "text-foreground group-hover:text-black"
                      )}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/auth/register?plan=${plan.id}`}
                  className={cn(
                    "inline-flex items-center justify-center w-full rounded-xl py-4 font-bold text-sm outline-none transition-all duration-300 mt-auto hover:scale-[1.02]",
                    isPro
                      ? "bg-white text-black group-hover:bg-black group-hover:text-white group-hover:ring-1 group-hover:ring-white"
                      : "bg-zinc-800 text-white border border-zinc-700 group-hover:bg-black group-hover:text-white group-hover:border-black"
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
