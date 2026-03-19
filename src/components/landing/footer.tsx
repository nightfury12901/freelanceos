import Link from 'next/link'
import { Github, Twitter, Linkedin, ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#F8F9FA] pt-32 pb-8 px-4 overflow-hidden">
      
      <div className="mx-auto max-w-7xl">
        {/* CTA Section Top */}
        <div className="mb-32 rounded-3xl border border-emerald-100 bg-emerald-50/50 px-6 py-24 text-center sm:px-12 shadow-sm">
          <h2 className="mb-6 text-5xl font-playfair font-medium text-emerald-900 sm:text-6xl tracking-tight">
            Ready to sort your compliance?
          </h2>
          <p className="mb-10 text-xl font-medium text-emerald-800/70 max-w-2xl mx-auto">
            Join thousands of Indian freelancers saving hours every month with FreelanceOS.
          </p>
          <Link href="/auth/register" className="inline-flex h-16 items-center justify-center gap-3 rounded-lg bg-emerald-800 px-10 text-lg font-semibold text-white transition-all hover:bg-emerald-900 hover:scale-[1.02] shadow-[0_8px_20px_rgb(6,78,59,0.15)]">
            Start Free — ₹0
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-16 mb-24">
          <div>
            <h3 className="mb-6 font-bold text-slate-900 tracking-widest uppercase text-xs">Product</h3>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li><Link href="#features" className="hover:text-emerald-700 transition-colors duration-300">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-emerald-700 transition-colors duration-300">Pricing</Link></li>
              <li><Link href="#" className="hover:text-emerald-700 transition-colors duration-300">Changelog</Link></li>
              <li><Link href="#" className="hover:text-emerald-700 transition-colors duration-300">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 font-bold text-slate-900 tracking-widest uppercase text-xs">Legal</h3>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li><Link href="#" className="hover:text-emerald-700 transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-emerald-700 transition-colors duration-300">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-emerald-700 transition-colors duration-300">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 font-bold text-slate-900 tracking-widest uppercase text-xs">Resources</h3>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li><Link href="#" className="hover:text-emerald-700 transition-colors duration-300">GST Guide for Freelancers</Link></li>
              <li><Link href="#" className="hover:text-emerald-700 transition-colors duration-300">SAC Code Finder</Link></li>
              <li><Link href="#" className="hover:text-emerald-700 transition-colors duration-300">LUT Application Process</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-6 font-bold text-slate-900 tracking-widest uppercase text-xs">Connect</h3>
            <div className="flex space-x-5">
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 transition-all duration-300 shadow-sm">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 transition-all duration-300 shadow-sm">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 transition-all duration-300 shadow-sm">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-slate-200 pt-10 sm:flex-row">
          <p className="text-sm font-medium text-slate-500">
            © 2026 <span className="text-slate-900 font-semibold font-playfair">FreelanceOS</span>. Made in India 🇮🇳
          </p>
          <div className="mt-6 flex space-x-6 sm:mt-0">
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors duration-300">
              Support: help@freelanceos.in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
