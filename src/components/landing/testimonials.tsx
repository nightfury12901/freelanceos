'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const TESTIMONIALS = [
  {
    name: "Ravi Kumar",
    role: "UI/UX Designer",
    initials: "RK",
    quote: "FreelanceOS finally solved my headache of tracking export LUT invoices and matching them with FIRA. Pure magic.",
    color: "from-blue-500 to-blue-400"
  },
  {
    name: "Aisha Iyer",
    role: "Freelance Writer",
    initials: "AI",
    quote: "I used to spend 5 hours a month on GST. Now it takes 10 minutes. The reminders are an absolute lifesaver.",
    color: "from-amber-500 to-amber-300"
  },
  {
    name: "Dev Patel",
    role: "Software Consultant",
    initials: "DP",
    quote: "The pre-built NDA and Retainer contract templates are incredibly robust. Clients sign them instantly.",
    color: "from-indigo-500 to-indigo-400"
  },
  {
    name: "Sneha Sharma",
    role: "Digital Marketer",
    initials: "SS",
    quote: "No more switching between tools. My dashboard shows my upcoming GSTR-1 and pending invoices instantly.",
    color: "from-purple-500 to-purple-400"
  },
  {
    name: "Arjun Singh",
    role: "Mobile Dev Studio",
    initials: "AS",
    quote: "The agency plan scales perfectly for my growing team. The automated compliance score keeps me stress-free.",
    color: "from-orange-500 to-orange-400"
  },
  {
    name: "Priya Desai",
    role: "Freelance SEO",
    initials: "PD",
    quote: "Finally a tool that understands Indian freelancer taxation. Worth every single rupee of the subscription.",
    color: "from-rose-500 to-rose-400"
  }
]

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="bg-[#050505] py-32 overflow-hidden border-y border-white/[0.05] relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.03),transparent_70%)] pointer-events-none" />

      <div className="mb-20 text-center px-4 relative z-10">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Loved by Indian <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Freelancers</span>
        </h2>
      </div>

      <div className="relative flex max-w-[100vw] overflow-hidden py-4">
        {/* Left gradient mask */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
        {/* Right gradient mask */}
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

        <motion.div
           className="flex gap-6 px-6"
           ref={scrollRef}
           animate={shouldReduceMotion ? undefined : { x: ["0%", "-50%"] }}
           transition={shouldReduceMotion ? undefined : { 
             ease: "linear",
             duration: 50, 
             repeat: Infinity 
           }}
        >
          {/* Double the array for seamless infinite scroll */}
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
            <div 
              key={idx} 
              className="group flex w-[400px] shrink-0 flex-col justify-between rounded-[2rem] border border-white/[0.05] bg-white/[0.02] p-8 backdrop-blur-xl transition-colors hover:bg-white/[0.04] hover:border-white/[0.1]"
            >
              <div className="mb-8">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/000000/svg" className="text-white/20 mb-4 group-hover:text-amber-500/40 transition-colors">
                  <path d="M10 11C10 14.3137 7.31371 17 4 17C3.44772 17 3 16.5523 3 16C3 15.4477 3.44772 15 4 15C5.10457 15 6 14.1046 6 13V11C6 9.89543 6.89543 9 8 9H10C10.5523 9 11 9.44772 11 10V11ZM21 11C21 14.3137 18.3137 17 15 17C14.4477 17 14 16.5523 14 16C14 15.4477 14.4477 15 15 15C16.1046 15 17 14.1046 17 13V11C17 9.89543 17.8954 9 19 9H21C21.5523 9 22 9.44772 22 10V11Z" fill="currentColor"/>
                </svg>
                <p className="text-zinc-300 leading-relaxed text-lg font-light tracking-wide">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-black shadow-inner bg-gradient-to-br ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{t.name}</h4>
                  <p className="text-sm text-zinc-500 font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
