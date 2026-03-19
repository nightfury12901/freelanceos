'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const TESTIMONIALS = [
  {
    name: "Ravi Kumar",
    role: "UI/UX Designer",
    initials: "RK",
    quote: "FreelanceOS finally solved my headache of tracking export LUT invoices and matching them with FIRA. Pure magic.",
    color: "bg-blue-500"
  },
  {
    name: "Aisha Iyer",
    role: "Freelance Writer",
    initials: "AI",
    quote: "I used to spend 5 hours a month on GST. Now it takes 10 minutes. The reminders are a lifesaver.",
    color: "bg-teal-500"
  },
  {
    name: "Dev Patel",
    role: "Software Consultant",
    initials: "DP",
    quote: "The pre-built NDA and Retainer contract templates are incredibly robust. Clients sign them without a second thought.",
    color: "bg-indigo-500"
  },
  {
    name: "Sneha Sharma",
    role: "Digital Marketer",
    initials: "SS",
    quote: "No more switching between tools. My dashboard shows my upcoming GSTR-1 and pending invoices instantly.",
    color: "bg-purple-500"
  },
  {
    name: "Arjun Singh",
    role: "Mobile Dev Studio",
    initials: "AS",
    quote: "The agency plan scales perfectly for my growing team. The automated compliance score keeps me stress-free.",
    color: "bg-orange-500"
  },
  {
    name: "Priya Desai",
    role: "Freelance SEO",
    initials: "PD",
    quote: "Finally a tool that understands Indian freelancer taxation. Worth every single rupee of the subscription.",
    color: "bg-rose-500"
  }
]

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="bg-[#0f172a] py-24 overflow-hidden border-y border-white/5">
      <div className="mb-12 text-center px-4">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Loved by Indian <span className="text-teal-400">Freelancers</span>
        </h2>
      </div>

      <div className="relative flex max-w-[100vw] overflow-hidden">
        {/* Left gradient mask */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0f172a] to-transparent z-10 hidden md:block" />
        {/* Right gradient mask */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0f172a] to-transparent z-10 hidden md:block" />

        <motion.div
           className="flex gap-6 px-6"
           ref={scrollRef}
           animate={shouldReduceMotion ? undefined : { x: ["0%", "-50%"] }}
           transition={shouldReduceMotion ? undefined : { 
             ease: "linear",
             duration: 40, 
             repeat: Infinity 
           }}
        >
          {/* Double the array for seamless infinite scroll */}
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
            <div 
              key={idx} 
              className="flex w-[350px] shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <p className="text-slate-300 leading-relaxed text-sm content-center">
                "{t.quote}"
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-inner ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
