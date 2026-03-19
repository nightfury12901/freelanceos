'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
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
    
    // In Next.js Server Actions, a thrown redirect error will propagate to the client router
    // So if the action is successful, it will throw and then redirect.
    // However, if we catch it, we'd squash the redirect! But we are NOT catching here.
    // If there is an error returned gracefully, we will set it.
    const res = await action(formData)
    
    if (res?.error) {
      setError(res.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0f172a]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400 mb-2">FreelanceOS</h1>
          <p className="text-slate-400">
            {mode === 'login' ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
          </p>
        </div>

        {(error || errorMessage) && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
            {error || errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/50 rounded-lg text-teal-400 text-sm">
            {successMessage}
          </div>
        )}

        <form action={onSubmit} className="space-y-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="email" className="text-slate-200">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="password" className="text-slate-200">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              minLength={6}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-teal-500 hover:bg-teal-400 text-white mt-6" 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (mode === 'login' ? 'Sign In' : 'Register')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {mode === 'login' ? (
            <p>Don't have an account? <Link href="/auth/register" className="text-teal-400 hover:underline">Register</Link></p>
          ) : (
            <p>Already have an account? <Link href="/auth/login" className="text-teal-400 hover:underline">Sign In</Link></p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
