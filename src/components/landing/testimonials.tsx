'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const TESTIMONIALS = [
  {
    name: "Ravi Kumar",
    role: "UI/UX Designer",
    initials: "RK",
    quote: "FreelanceOS finally solved my headache of tracking export LUT invoices and matching them with FIRA. Pure magic.",
    color: "bg-emerald-100 text-emerald-800"
  },
  {
    name: "Aisha Iyer",
    role: "Freelance Writer",
    initials: "AI",
    quote: "I used to spend 5 hours a month on GST. Now it takes 10 minutes. The reminders are an absolute lifesaver.",
    color: "bg-indigo-100 text-indigo-800"
  },
  {
    name: "Dev Patel",
    role: "Software Consultant",
    initials: "DP",
    quote: "The pre-built NDA and Retainer contract templates are incredibly robust. Clients sign them instantly.",
    color: "bg-amber-100 text-amber-800"
  },
  {
    name: "Sneha Sharma",
    role: "Digital Marketer",
    initials: "SS",
    quote: "No more switching between tools. My dashboard shows my upcoming GSTR-1 and pending invoices instantly.",
    color: "bg-rose-100 text-rose-800"
  },
  {
    name: "Arjun Singh",
    role: "Mobile Dev Studio",
    initials: "AS",
    quote: "The agency plan scales perfectly for my growing team. The automated compliance score keeps me stress-free.",
    color: "bg-blue-100 text-blue-800"
  },
  {
    name: "Priya Desai",
    role: "Freelance SEO",
    initials: "PD",
    quote: "Finally a tool that understands Indian freelancer taxation. Worth every single rupee of the subscription.",
    color: "bg-purple-100 text-purple-800"
  }
]

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="bg-background py-32 overflow-hidden border-b border-border">
      <div className="mb-24 text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-5xl font-playfair font-medium tracking-tight text-foreground sm:text-6xl">
          Trusted by India&apos;s top <br />
          <span className="italic font-light text-muted-foreground">independent talent.</span>
        </h2>
      </div>

      <div className="relative flex max-w-[100vw] overflow-hidden py-4">
        {/* Left gradient mask */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        {/* Right gradient mask */}
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

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
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
            <div 
              key={idx} 
              className="group flex w-[400px] shrink-0 flex-col justify-between rounded-3xl border border-border bg-card p-10 transition-shadow duration-300 hover:shadow-xl hover:bg-muted"
            >
              <div className="mb-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/000000/svg" className="text-muted-foreground opacity-50 mb-6 group-hover:text-primary transition-colors">
                  <path d="M10 11C10 14.3137 7.31371 17 4 17C3.44772 17 3 16.5523 3 16C3 15.4477 3.44772 15 4 15C5.10457 15 6 14.1046 6 13V11C6 9.89543 6.89543 9 8 9H10C10.5523 9 11 9.44772 11 10V11ZM21 11C21 14.3137 18.3137 17 15 17C14.4477 17 14 16.5523 14 16C14 15.4477 14.4477 15 15 15C16.1046 15 17 14.1046 17 13V11C17 9.89543 17.8954 9 19 9H21C21.5523 9 22 9.44772 22 10V11Z" fill="currentColor"/>
                </svg>
                <p className="text-foreground leading-relaxed text-lg font-medium">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold shadow-sm ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">{t.name}</h4>
                  <p className="text-sm text-muted-foreground font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
