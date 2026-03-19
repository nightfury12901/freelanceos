import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#0f172a] pt-24 pb-8 px-4 border-t border-white/5">
      <div className="mx-auto max-w-6xl">
        {/* CTA Section Top */}
        <div className="mb-20 rounded-3xl border border-teal-500/30 bg-teal-500/5 px-6 py-16 text-center backdrop-blur-sm sm:px-12">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to sort your compliance?
          </h2>
          <p className="mb-8 text-lg text-slate-400">
            Join thousands of Indian freelancers saving hours every month.
          </p>
          <Link href="/auth/register" className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-8 py-4 text-lg font-bold text-white hover:bg-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.2)] transition-all">
            Start Free — ₹0
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12 mb-16">
          <div>
            <h3 className="mb-4 font-bold text-white tracking-wide">Product</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#features" className="hover:text-teal-400 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Changelog</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-white tracking-wide">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-white tracking-wide">Resources</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-teal-400 transition-colors">GST Guide for Freelancers</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">SAC Code Finder</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">LUT Application Process</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-white tracking-wide">Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © 2026 FreelanceOS. Made in India 🇮🇳
          </p>
          <div className="mt-4 flex space-x-6 sm:mt-0">
            <Link href="#" className="text-sm text-slate-500 hover:text-white transition-colors">
              Support: help@freelanceos.in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
