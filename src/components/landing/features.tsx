'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { FileText, Globe, Shield, Bell, PieChart, Zap } from 'lucide-react'

const featuresList = [
  {
    title: "GST Invoicing",
    description: "Create B2B and B2C domestic invoices with integrated SAC codes and auto-calculated taxes in seconds.",
    icon: FileText,
    colSpan: "md:col-span-2 lg:col-span-2",
    size: "large"
  },
  {
    title: "e-FIRA Tracker",
    description: "Upload and attach FIRA documents securely for a bulletproof audit trail.",
    icon: Shield,
    colSpan: "md:col-span-1 lg:col-span-1",
    size: "standard"
  },
  {
    title: "Zero-GST Export & LUT",
    description: "Generate compliant export invoices under LUT with multi-currency support.",
    icon: Globe,
    colSpan: "md:col-span-1 lg:col-span-1",
    size: "standard"
  },
  {
    title: "Compliance Dashboard",
    description: "A panoramic view of your financial health, outstanding tasks, and overall compliance score.",
    icon: PieChart,
    colSpan: "md:col-span-2 lg:col-span-2",
    size: "large"
  },
  {
    title: "Automated Reminders",
    description: "Never miss a deadline. Automated email reminders to consolidate and file GSTR-1.",
    icon: Bell,
    colSpan: "md:col-span-3 lg:col-span-3",
    size: "wide"
  }
]

export function Features() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="features" className="relative bg-[#050505] px-4 py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Everything you need.<br/>
            <span className="text-zinc-500">Nothing you don't.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {featuresList.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative overflow-hidden rounded-[2.5rem] border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.04] p-8 md:p-10 ${feature.colSpan}`}
              >
                {/* Subtle gradient hover effect inside card */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-amber-500 shadow-inner ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500 ease-out">
                    <Icon className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-white mb-3 ${feature.size === 'large' || feature.size === 'wide' ? 'text-3xl' : 'text-xl'}`}>{feature.title}</h3>
                    <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
