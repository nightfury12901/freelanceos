'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { FileText, Globe, Shield, FileSignature, Bell, PieChart } from 'lucide-react'

const featuresList = [
  {
    title: "GST Invoicing",
    description: "Create standard B2B and B2C domestic invoices with integrated SAC codes and auto-calculated taxes.",
    icon: FileText
  },
  {
    title: "Export + LUT",
    description: "Generate compliant export invoices with zero GST under LUT, seamlessly handling multi-currency pricing.",
    icon: Globe
  },
  {
    title: "e-FIRA Tracker",
    description: "Upload and attach FIRA documents directly to your export invoices for a bulletproof audit trail.",
    icon: Shield
  },
  {
    title: "Contracts",
    description: "Customizable pre-built templates for NDAs, SOWs, and retained services designed specifically for freelancers.",
    icon: FileSignature
  },
  {
    title: "GSTR-1 Reminders",
    description: "Never miss a deadline. Automated email reminders to consolidate and file your outward supplies.",
    icon: Bell
  },
  {
    title: "Compliance Dashboard",
    description: "A single view of your financial health, outstanding tasks, and overall compliance score.",
    icon: PieChart
  }
]

export function Features() {
  const shouldReduceMotion = useReducedMotion()

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.4 }
    }
  }

  return (
    <section id="features" className="relative bg-[#0f172a] px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need. <span className="text-teal-400">Nothing you don't.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            Purpose-built components to simplify your freelance operations.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {featuresList.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                variants={item}
                whileHover={shouldReduceMotion ? {} : { y: -6, boxShadow: '0 20px 40px rgba(20,184,166,0.15)' }}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors hover:border-teal-500/30 hover:bg-white/[0.07]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
