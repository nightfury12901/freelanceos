import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/ui/dashboard-nav'
import { UserMenu } from '@/components/ui/user-menu'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] border-r border-white/10 bg-[#0f172a]/95 backdrop-blur">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6">
            <h2 className="text-xl font-bold text-teal-400">FreelanceOS</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <DashboardNav />
          </div>

          <div className="border-t border-white/10 p-4">
            <UserMenu email={session.user.email!} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[240px] flex-1">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
