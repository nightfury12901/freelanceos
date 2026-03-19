import { createClient } from '@/lib/supabase/server'
import { Skeleton } from '@/components/ui/skeleton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const email = session?.user?.email

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Welcome back, {email}
        </h1>
        <p className="text-slate-400">
          Compliance dashboard coming in next phase.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Metric Cards Skeletons */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between space-y-0 text-slate-400 pb-2">
              <Skeleton className="h-4 w-1/2 bg-white/10" />
              <Skeleton className="h-4 w-4 rounded-full bg-white/10" />
            </div>
            <div className="pt-2">
              <Skeleton className="h-8 w-1/3 bg-white/10 mb-2" />
              <Skeleton className="h-3 w-2/3 bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
