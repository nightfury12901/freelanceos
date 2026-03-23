import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from './settings-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-3xl space-y-8 pb-32">
      <div>
        <h1
          className="text-[28px] leading-tight tracking-[-0.02em] font-serif font-black mb-1"
          style={{ color: 'var(--dash-fg)' }}
        >
          Compliance & Settings
        </h1>
        <p className="text-[14px] opacity-70" style={{ color: 'var(--dash-muted)' }}>
          Manage your business identity, tax configuration, and LUT status.
        </p>
      </div>

      <SettingsForm profile={profile || {}} email={user.email || ''} />
    </div>
  )
}
