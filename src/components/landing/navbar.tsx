'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Layers } from 'lucide-react'

export function Navbar() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 pt-6 pointer-events-none"
    >
      <div
        className="pointer-events-auto flex w-full max-w-6xl items-center justify-between rounded-xl px-6 py-3 backdrop-blur-xl transition-all shadow-xl"
        style={{
          background: 'var(--nav-bg)',
          border: '1px solid var(--nav-border)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
            <div
              className="flex items-center justify-center h-8 w-8 rounded-lg shadow-inner"
              style={{
                background: 'linear-gradient(135deg, #18181b, #27272a)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Layers className="h-4 w-4 text-primary" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Freelance<span style={{ color: 'var(--primary)' }}>OS</span>
          </span>
        </Link>

        {/* Nav links */}
        <div
            className="hidden md:flex items-center gap-8 px-8 rounded-full py-2.5 backdrop-blur-xl shadow-sm"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
          {['features', 'pricing', 'workflows'].map((item) => (
            <Link
              key={item}
              href={`#${item}`}
              className="text-sm font-medium capitalize transition-colors duration-300 hover:text-white"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {item === 'workflows' ? 'How it Works' : item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>

        {/* Right: auth */}
        <div className="flex items-center gap-3">

          <Link
            href="/auth/login"
            className="hidden sm:block text-sm font-medium transition-colors duration-300"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Log In
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex h-9 items-center justify-center rounded-lg px-5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            Start Free
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
