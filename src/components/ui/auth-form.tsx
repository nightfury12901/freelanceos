'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { signIn, signUp } from '@/app/auth/actions'
import { useSearchParams } from 'next/navigation'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const searchParams = useSearchParams()
  const successMessage = searchParams.get('message')
  const errorMessage = searchParams.get('error')

  const action = mode === 'login' ? signIn : signUp

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    const res = await action(formData)
    if (res?.error) {
      setError(res.error)
      setIsLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden"
      style={{ background: '#050505' }}
    >
      {/* Ambient green glow top-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 70% 10%, rgba(34,197,94,0.13) 0%, transparent 70%)',
        }}
      />
      {/* Ambient purple glow bottom-left */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 20% 90%, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Animated grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
              }}
            >
              <ShieldCheck className="h-5 w-5" style={{ color: '#22c55e' }} />
            </div>
            <span className="text-[22px] font-bold tracking-tight text-white">
              Freelance<span style={{ color: '#22c55e' }}>OS</span>
            </span>
          </div>
          <h1 className="text-[15px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {mode === 'login'
              ? 'Welcome back. Sign in to your account.'
              : 'Create your free account to get started.'}
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          }}
        >
          {/* Error */}
          {(error || errorMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-xl px-4 py-3 text-[13px] font-medium"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171',
              }}
            >
              {error || errorMessage}
            </motion.div>
          )}

          {/* Success */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-xl px-4 py-3 text-[13px] font-medium"
              style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
                color: '#4ade80',
              }}
            >
              ✓ {successMessage}
            </motion.div>
          )}

          <form action={onSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[12px] font-semibold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl px-4 py-3 text-[14px] font-medium text-white placeholder:text-white/20 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={e => {
                  e.currentTarget.style.border = '1px solid rgba(34,197,94,0.5)'
                  e.currentTarget.style.background = 'rgba(34,197,94,0.04)'
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[12px] font-semibold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Password
                </label>
                {mode === 'login' && (
                  <span
                    className="text-[12px] font-medium"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    min. 6 chars
                  </span>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full rounded-xl px-4 py-3 text-[14px] font-medium text-white placeholder:text-white/20 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={e => {
                  e.currentTarget.style.border = '1px solid rgba(34,197,94,0.5)'
                  e.currentTarget.style.background = 'rgba(34,197,94,0.04)'
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isLoading
                  ? 'rgba(34,197,94,0.7)'
                  : '#22c55e',
                color: '#000',
                boxShadow: '0 0 24px rgba(34,197,94,0.3)',
              }}
              onMouseEnter={e => {
                if (!isLoading) {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(34,197,94,0.5)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 0 24px rgba(34,197,94,0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p
          className="mt-6 text-center text-[13px]"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="font-semibold transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Register for free
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-semibold transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Sign in
              </Link>
            </>
          )}
        </p>

        {/* Trust note */}
        <p
          className="mt-4 text-center text-[11px]"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          🔒 Secured by Supabase Auth · No credit card required
        </p>
      </motion.div>
    </div>
  )
}
