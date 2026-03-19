import { AuthForm } from '@/components/ui/auth-form'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
      <AuthForm mode="login" />
    </Suspense>
  )
}
