import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  FileText,
  FileSignature,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Zap,
  Users,
  CalendarClock,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Briefcase
} from 'lucide-react'
import { RevenueChart } from '@/components/ui/revenue-chart'

// ── Token shorthands ──────────────────────────────────────────────────────────
const T = {
  fg:           'var(--dash-fg)',
  muted:        'var(--dash-muted)',
  border:       'var(--dash-border)',
  surface:      'var(--dash-surface)',
  accent:       'var(--dash-accent)',
  accentMuted:  'var(--dash-accent-muted)',
  accentFg:     'var(--dash-accent-fg)',
  danger:       'var(--dash-danger)',
  dangerMuted:  'var(--dash-danger-muted)',
  success:      'var(--dash-success)',
  successMuted: 'var(--dash-success-muted)',
  bg:           'var(--dash-bg)',
} as const

// ── Replaced StatCard component with custom layout below ──────────────────

// ── Server Component ──────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users').select('*').eq('id', user.id).single() as { data: any; error: any }

  const firstName = profile?.name?.split(' ')[0] || user.email?.split('@')[0] || 'Partner'

  // Fetch Data
  const { data: invoicesRaw } = await supabase
    .from('invoices').select('id, type, total, created_at, client_name').eq('user_id', user.id)
  
  const { data: exportInvoicesRaw } = await supabase
    .from('invoices').select('id').eq('user_id', user.id).eq('type', 'export')
  
  const { data: efiraDocsRaw } = await supabase
    .from('documents').select('invoice_id').eq('user_id', user.id).eq('doc_type', 'efira')

  const { data: clientsRaw } = await supabase
    .from('clients').select('id, name, project_title, project_deadline, progress_percent, status').eq('user_id', user.id) as { data: any[] | null }

  // Processing Data
  const invoices = (invoicesRaw as any[]) || []
  const clients = clientsRaw || []
  const exportInvoices = (exportInvoicesRaw as any[]) || []
  const efiraDocs = (efiraDocsRaw as any[]) || []
  const efiraInvoiceIds = new Set(efiraDocs.map((d) => d.invoice_id))
  
  const pendingEfiras = exportInvoices.filter((inv) => !efiraInvoiceIds.has(inv.id)).length
  const ytdRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)
  
  const todayIso = new Date().toISOString()
  const activeProjects = clients
    .filter(c => c.project_deadline && c.status !== 'completed' && c.project_deadline >= todayIso.split('T')[0])
    .sort((a, b) => new Date(a.project_deadline).getTime() - new Date(b.project_deadline).getTime())
    .slice(0, 3)

  // Chart Data Processing (Last 6 Months)
  const chartData = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthYear = d.toLocaleString('en-US', { month: 'short' })
    const monthInvoices = invoices.filter(inv => {
       const invDate = new Date(inv.created_at)
       return invDate.getMonth() === d.getMonth() && invDate.getFullYear() === d.getFullYear()
    })
    
    chartData.push({
      month: monthYear,
      export: monthInvoices.filter(i => i.type === 'export').reduce((sum, i) => sum + Number(i.total), 0),
      domestic: monthInvoices.filter(i => i.type === 'domestic').reduce((sum, i) => sum + Number(i.total), 0),
      revenue: monthInvoices.reduce((sum, i) => sum + Number(i.total), 0)
    })
  }

  // Compliance Logic
  let score = 100
  if (!profile?.lut_filed && exportInvoices.length > 0) score -= 30
  if (pendingEfiras > 0) score -= pendingEfiras * 10
  if (!profile?.gstin) score -= 20
  score = Math.max(0, score)

  const isHealthy = score >= 80
  const lutFiled  = !!profile?.lut_filed

  return (
    <div className="space-y-8 pb-32">
      
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div>
          <h1
            className="text-[28px] leading-tight tracking-[-0.02em] font-serif font-black"
            style={{ color: T.fg, fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            Overview, {firstName}.
          </h1>
          <p className="text-[14px] mt-1 opacity-70" style={{ color: T.muted }}>
            Here is your financial and compliance pulse for the year.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/invoices/new"
            className="inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-[13px] font-bold shadow-sm transition-transform hover:scale-[1.02]"
            style={{ background: T.accent, color: '#fff' }}
          >
            <FileText className="h-4 w-4" />
            Issue Invoice
          </Link>
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-[13px] font-bold shadow-sm transition-all"
            style={{ background: T.surface, color: T.fg, border: `1px solid ${T.border}` }}
          >
            <Users className="h-4 w-4" style={{ color: T.muted }} />
            New Client
          </Link>
        </div>
      </div>

      {/* ── LUT Banner ──────────────────────────────────────────────────────── */}
      {!lutFiled && (
        <div
          className="flex items-center justify-between gap-4 rounded-[12px] px-6 py-4 animate-in fade-in slide-in-from-top-4"
          style={{ background: T.dangerMuted, border: `1px solid rgba(220,38,38,0.2)` }}
        >
          <div className="flex items-center gap-4">
            <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: T.danger }} />
            <div>
              <p className="text-[14px] font-bold leading-none mb-1" style={{ color: '#f87171' }}>LUT not filed for FY24-25</p>
              <p className="text-[13px] font-medium" style={{ color: '#ef4444', opacity: 0.8 }}>Action required before generating zero-rated export invoices.</p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className="shrink-0 text-[13px] font-bold px-4 py-2 rounded-[8px] shadow-sm transition-transform hover:scale-105"
            style={{ background: T.danger, color: '#fff' }}
          >
            Resolve Compliance
          </Link>
        </div>
      )}

      {/* ── KPI Row (Weighted Split) ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.2fr_1fr] gap-4">
         
         {/* Compliance Card */}
         <div className="p-6 flex flex-col justify-between rounded-[12px] transition-all hover:bg-white/[0.02]" style={{ border: `1px solid ${T.border}`, background: 'var(--dash-surface)' }}>
            <span className="text-[14px] font-medium tracking-tight mb-2" style={{ color: T.muted }}>Compliance</span>
            <div>
              <div className="flex items-baseline gap-0 mb-3">
                 <span className="text-[54px] md:text-[64px] font-serif font-medium leading-none tracking-tight" style={{ color: T.fg }}>{score}</span>
                 <span className="text-[24px] font-serif font-medium leading-none tracking-tight opacity-50" style={{ color: T.muted }}>/100</span>
              </div>
              <div className="h-[3px] w-full rounded-full overflow-hidden mb-2.5 bg-black/50 overflow-hidden" style={{ background: 'var(--dash-bg)' }}>
                 <div className="h-full rounded-full" style={{ width: `${score}%`, background: isHealthy ? '#84cc16' : T.danger }} />
              </div>
              <span className="text-[14px] font-medium" style={{ color: isHealthy ? T.fg : T.danger }}>{isHealthy ? "Healthy" : "Needs attention"}</span>
            </div>
         </div>
         
         {/* Revenue Card */}
         <div className="p-6 flex flex-col justify-between rounded-[12px] transition-all hover:bg-white/[0.02]" style={{ border: `1px solid ${T.border}`, background: 'var(--dash-surface)' }}>
            <span className="text-[14px] font-medium tracking-tight mb-2" style={{ color: T.muted }}>Revenue YTD</span>
            <div>
              <div className="text-[54px] md:text-[64px] font-serif font-medium leading-[0.9] tracking-tight mb-3" style={{ color: T.fg }}>
                 <span className="font-sans font-medium mr-1 text-[44px]">₹</span>{ytdRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[14px] font-medium" style={{ color: T.fg }}>{invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'}</span>
            </div>
         </div>

         {/* Stacked Cards */}
         <div className="flex flex-col gap-4">
            <div className="p-5 flex-1 flex flex-col justify-center rounded-[12px] transition-all hover:bg-white/[0.02]" style={{ border: `1px solid ${T.border}`, background: 'var(--dash-surface)' }}>
               <span className="text-[14px] font-medium tracking-tight mb-0.5" style={{ color: T.muted }}>Pending e-FIRA</span>
               <span className="text-[20px] font-bold tracking-tight" style={{ color: pendingEfiras > 0 ? T.danger : T.fg }}>
                  {pendingEfiras} — <span className="font-medium" style={{ color: pendingEfiras > 0 ? T.danger : T.fg }}>{pendingEfiras === 0 ? "reconciled" : "action needed"}</span>
               </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-center rounded-[12px] transition-all hover:bg-white/[0.02]" style={{ border: `1px solid ${T.border}`, background: 'var(--dash-surface)' }}>
               <span className="text-[14px] font-medium tracking-tight mb-0.5" style={{ color: T.muted }}>Active deadlines</span>
               <span className="text-[20px] font-bold tracking-tight" style={{ color: T.fg }}>
                  {activeProjects.length} critical
               </span>
            </div>
         </div>
      </div>

      {/* ── Revenue Chart Area (Ramp Style) ─────────────────────────────────── */}
      <div 
        className="rounded-[16px] overflow-hidden"
        style={{ background: T.surface, border: `1px solid ${T.border}` }}
      >
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: T.border }}>
           <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4" style={{ color: T.accent }} />
              <h2 className="text-[14px] font-bold" style={{ color: T.fg }}>Cash Flow & Invoicing</h2>
           </div>
           
           {/* Legend */}
           <div className="flex items-center gap-5 text-[11px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2" style={{ color: T.muted }}>
                 <div className="w-2.5 h-2.5 rounded-full" style={{ background: T.accent }} /> Domestic
              </div>
              <div className="flex items-center gap-2" style={{ color: T.muted }}>
                 <div className="w-2.5 h-2.5 rounded-full" style={{ background: T.success }} /> Export
              </div>
           </div>
        </div>
        
        <div className="p-6">
           <RevenueChart data={chartData} />
        </div>
      </div>

      {/* ── Tabular Data Row (Ledger Style) ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Active Deadlines */}
        <div className="rounded-[16px] overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: T.border }}>
             <h3 className="text-[13px] font-bold flex items-center gap-2" style={{ color: T.fg }}>
                <CalendarClock className="h-4 w-4" style={{ color: T.accentFg }} /> Upcoming Deadlines
             </h3>
             <Link href="/dashboard/clients" className="text-[12px] font-bold opacity-60 hover:opacity-100 transition-opacity" style={{ color: T.muted }}>View all</Link>
          </div>
          
          {activeProjects.length === 0 ? (
             <div className="p-10 text-center opacity-50">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-2" style={{ color: T.muted }} />
                <p className="text-[13px] font-medium" style={{ color: T.fg }}>No urgent deadlines.</p>
             </div>
          ) : (
            <div className="divide-y" style={{ borderColor: T.border }}>
              {activeProjects.map(proj => {
                 const days = Math.ceil((new Date(proj.project_deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
                 return (
                   <Link key={proj.id} href={`/dashboard/clients/${proj.id}`} className="group flex items-center justify-between p-5 transition-colors hover:bg-white/[0.02]">
                      <div className="min-w-0 pr-4 flex-1">
                        <p className="text-[14px] font-bold truncate mb-1" style={{ color: T.fg }}>{proj.project_title || "Untitled Project"}</p>
                        <p className="text-[12px] truncate opacity-70" style={{ color: T.muted }}>{proj.name}</p>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right w-24">
                           <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-1" style={{ color: T.muted }}>Progress</p>
                           <div className="flex items-center gap-2 justify-end">
                             <div className="h-1.5 w-12 rounded-full overflow-hidden" style={{ background: T.border }}>
                                <div className="h-full" style={{ width: `${proj.progress_percent}%`, background: T.accent }} />
                             </div>
                             <span className="text-[12px] font-bold font-mono" style={{ color: T.fg }}>{proj.progress_percent}%</span>
                           </div>
                        </div>
                        <div className="text-right w-20">
                          <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-1" style={{ color: T.muted }}>Due In</p>
                          <p className="text-[14px] font-bold" style={{ color: days <= 3 ? T.danger : T.fg }}>{days}d</p>
                        </div>
                      </div>
                   </Link>
                 )
              })}
            </div>
          )}
        </div>

        {/* Recent Invoices Ledger */}
        <div className="rounded-[16px] overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: T.border }}>
             <h3 className="text-[13px] font-bold flex items-center gap-2" style={{ color: T.fg }}>
                <ReceiptIcon className="h-4 w-4" style={{ color: T.success }} /> Recent Billing
             </h3>
             <Link href="/dashboard/invoices" className="text-[12px] font-bold opacity-60 hover:opacity-100 transition-opacity" style={{ color: T.muted }}>View ledger</Link>
          </div>
          
          {invoices.length === 0 ? (
             <div className="p-10 text-center opacity-50">
                <FileText className="h-6 w-6 mx-auto mb-2" style={{ color: T.muted }} />
                <p className="text-[13px] font-medium" style={{ color: T.fg }}>Ledger empty.</p>
             </div>
          ) : (
            <div className="divide-y" style={{ borderColor: T.border }}>
              {invoices.slice(0, 3).map((inv: any) => (
                 <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`} className="group flex items-center justify-between p-5 transition-colors hover:bg-white/[0.02]">
                    <div className="min-w-0 pr-4">
                      <p className="text-[14px] font-bold truncate mb-1" style={{ color: T.fg }}>{inv.client_name}</p>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm" style={{ background: inv.type === 'export' ? T.successMuted : T.border, color: inv.type === 'export' ? T.success : T.muted }}>
                            {inv.type}
                         </span>
                         <span className="text-[11px] font-medium opacity-60" style={{ color: T.muted }}>
                            {new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' }).format(new Date(inv.created_at))}
                         </span>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[15px] font-black font-mono tracking-tight" style={{ color: T.fg }}>₹{Number(inv.total).toLocaleString('en-IN')}</p>
                       <div className="text-[12px] font-bold flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: T.accentFg }}>
                          View <ArrowUpRight className="h-3 w-3" />
                       </div>
                    </div>
                 </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function ReceiptIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
      <path d="M12 17V7"/>
    </svg>
  )
}
