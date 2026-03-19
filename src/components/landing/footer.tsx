import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#050505] pt-32 pb-8 px-4 border-t border-white/[0.05] relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-500/5 rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* CTA Section Top */}
        <div className="mb-32 rounded-[3rem] border border-amber-500/20 bg-amber-500/5 px-6 py-20 text-center backdrop-blur-xl sm:px-12 relative overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.05)]">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
          
          <h2 className="mb-6 text-4xl font-extrabold text-white sm:text-5xl tracking-tight relative z-10">
            Ready to sort your compliance?
          </h2>
          <p className="mb-10 text-xl font-light text-zinc-400 max-w-2xl mx-auto relative z-10">
            Join thousands of Indian freelancers saving hours every month with FreelanceOS.
          </p>
          <Link href="/auth/register" className="inline-flex h-16 items-center justify-center rounded-full bg-amber-500 px-10 text-xl font-bold text-black transition-all hover:bg-amber-400 hover:scale-[1.02] shadow-[0_0_40px_rgba(245,158,11,0.3)] relative z-10">
            Start Free — ₹0
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-16 mb-24">
          <div>
            <h3 className="mb-6 font-bold text-white tracking-widest uppercase text-xs">Product</h3>
            <ul className="space-y-4 text-sm text-zinc-400 font-medium">
              <li><Link href="#features" className="hover:text-amber-400 transition-colors duration-300">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-amber-400 transition-colors duration-300">Pricing</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors duration-300">Changelog</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors duration-300">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 font-bold text-white tracking-widest uppercase text-xs">Legal</h3>
            <ul className="space-y-4 text-sm text-zinc-400 font-medium">
              <li><Link href="#" className="hover:text-amber-400 transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors duration-300">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors duration-300">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 font-bold text-white tracking-widest uppercase text-xs">Resources</h3>
            <ul className="space-y-4 text-sm text-zinc-400 font-medium">
              <li><Link href="#" className="hover:text-amber-400 transition-colors duration-300">GST Guide for Freelancers</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors duration-300">SAC Code Finder</Link></li>
              <li><Link href="#" className="hover:text-amber-400 transition-colors duration-300">LUT Application Process</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 font-bold text-white tracking-widest uppercase text-xs">Connect</h3>
            <div className="flex space-x-5">
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-10 sm:flex-row">
          <p className="text-sm font-medium text-zinc-500">
            © 2026 <span className="text-white">FreelanceOS</span>. Made in India 🇮🇳
          </p>
          <div className="mt-6 flex space-x-6 sm:mt-0">
            <Link href="#" className="text-sm font-medium text-zinc-500 hover:text-amber-400 transition-colors duration-300">
              Support: help@freelanceos.in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
