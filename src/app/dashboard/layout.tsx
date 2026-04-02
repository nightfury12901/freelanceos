import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/ui/dashboard-nav'
import { UserMenu } from '@/components/ui/user-menu'
import { Particles } from '@/components/ui/particles'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  const userEmail = session.user.email ?? ''

  return (
    <div
      className="flex min-h-screen"
      style={{ background: 'var(--dash-bg)', color: 'var(--dash-fg)' }}
    >
      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside
        className="fixed left-0 top-0 bottom-0 z-40 w-[220px] flex flex-col"
        style={{
          background: 'var(--dash-sidebar-bg)',
          borderRight: '1px solid var(--dash-sidebar-border)',
        }}
      >
        {/* Logo */}
        <div
          className="flex h-14 items-center px-5 shrink-0"
          style={{ borderBottom: '1px solid var(--dash-sidebar-border)' }}
        >
          <div className="flex items-center gap-2">
            {/* Wordmark */}
            <span
              className="text-[15px] font-semibold tracking-[-0.01em]"
              style={{ color: 'var(--dash-sidebar-fg)', fontFamily: 'var(--font-sans)' }}
            >
              Freelance
              <span style={{ color: 'var(--dash-accent)' }}>OS</span>
            </span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          <DashboardNav />
        </div>

        {/* User */}
        <div
          className="shrink-0 p-3"
          style={{ borderTop: '1px solid var(--dash-sidebar-border)' }}
        >
          <UserMenu email={userEmail} />
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <main
        className="ml-[220px] flex-1 min-h-screen relative overflow-hidden"
        style={{ background: 'var(--dash-bg)' }}
      >
        <div className="fixed inset-0 z-0 opacity-30" style={{ pointerEvents: 'none' }}>
           <Particles moveParticlesOnHover={true} />
        </div>
        {/* Green ambient glow — top right, matches reference */}
        <div
          className="fixed z-0 pointer-events-none"
          style={{
            top: '-120px',
            right: '-80px',
            width: '520px',
            height: '520px',
            background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 h-screen flex flex-col overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
