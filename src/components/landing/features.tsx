'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { FileText, Globe, Shield, Bell, PieChart, Landmark } from 'lucide-react'

const featuresList = [
  {
    title: "GST Invoicing",
    description: "Create B2B and B2C domestic invoices with integrated SAC codes and auto-calculated taxes.",
    icon: FileText,
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "e-FIRA Tracker",
    description: "Upload and attach FIRA documents securely for a bulletproof audit trail.",
    icon: Shield,
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Zero-GST Export",
    description: "Generate compliant export invoices under LUT with multi-currency support instantly.",
    icon: Globe,
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Compliance Dashboard",
    description: "A panoramic view of your financial health, outstanding tasks, and overall compliance score.",
    icon: PieChart,
    colSpan: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Automated Reminders",
    description: "Never miss a deadline. Automated email reminders to consolidate and file GSTR-1.",
    icon: Bell,
    colSpan: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "Tax Savings",
    description: "Identify permissible expense deductions specific to freelance consultants.",
    icon: Landmark,
    colSpan: "md:col-span-2 lg:col-span-2",
  }
]

export function Features() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="features" className="bg-white px-4 py-32 border-b border-slate-200">
      <div className="mx-auto max-w-7xl">
        <div className="mb-24 flex flex-col items-center text-center space-y-6">
          <p className="text-sm font-bold text-emerald-700 tracking-widest uppercase">The Toolkit</p>
          <h2 className="text-5xl font-playfair font-medium text-slate-900 sm:text-6xl tracking-tight">
            Uncompromising tools.<br/>
            <span className="italic font-light text-slate-500">For uncompromising professionals.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
          {featuresList.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: idx * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl bg-[#F8F9FA] border border-slate-200 p-10 transition-shadow duration-300 hover:shadow-xl hover:bg-white ${feature.colSpan}`}
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100 group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
                    <Icon className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-semibold text-slate-900 text-2xl mb-3 font-playfair">{feature.title}</h3>
                    <p className="text-slate-600 text-base leading-relaxed max-w-lg">
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
