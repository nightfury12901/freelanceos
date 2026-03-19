import { AuthForm } from '@/components/ui/auth-form'
import { Suspense } from 'react'

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
      <AuthForm mode="register" />
    </Suspense>
  )
}
