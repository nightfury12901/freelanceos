import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { RevenueChart } from '@/components/ui/revenue-chart'
import { RevenueDonut } from '@/components/ui/revenue-donut'
import { DashboardTopBar } from '@/components/ui/dashboard-top-bar'
import { DashboardRightPanel } from '@/components/ui/dashboard-right-panel'

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

// ── Server Component ──────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users').select('*').eq('id', user.id).single() as { data: any; error: any }

  const firstName = profile?.name?.split(' ')[0] || user.email?.split('@')[0] || 'Partner'

  // ── Fetch Data ────────────────────────────────────────────────────────────
  const { data: invoicesRaw } = await supabase
    .from('invoices')
    .select('id, type, total, created_at, client_name')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: exportInvoicesRaw } = await supabase
    .from('invoices').select('id').eq('user_id', user.id).eq('type', 'export')

  const { data: efiraDocsRaw } = await supabase
    .from('documents').select('invoice_id').eq('user_id', user.id).eq('doc_type', 'efira')

  const { data: clientsRaw } = await supabase
    .from('clients')
    .select('id, name, project_title, project_deadline, progress_percent, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: any[] | null }

  // ── Process Data ─────────────────────────────────────────────────────────
  const invoices = (invoicesRaw as any[]) || []
  const clients = clientsRaw || []
  const exportInvoices = (exportInvoicesRaw as any[]) || []
  const efiraDocs = (efiraDocsRaw as any[]) || []
  const efiraInvoiceIds = new Set(efiraDocs.map((d) => d.invoice_id))

  const pendingEfiras = exportInvoices.filter((inv) => !efiraInvoiceIds.has(inv.id)).length
  const ytdRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)
  const exportRevenue = invoices
    .filter((i) => i.type === 'export')
    .reduce((sum, i) => sum + (Number(i.total) || 0), 0)
  const domesticRevenue = invoices
    .filter((i) => i.type === 'domestic')
    .reduce((sum, i) => sum + (Number(i.total) || 0), 0)

  const todayIso = new Date().toISOString()
  const activeProjects = clients
    .filter(c => c.project_deadline && c.status !== 'completed' && c.project_deadline >= todayIso.split('T')[0])
    .sort((a, b) => new Date(a.project_deadline).getTime() - new Date(b.project_deadline).getTime())

  // Chart Data — last 6 months
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
      revenue: monthInvoices.reduce((sum, i) => sum + Number(i.total), 0),
    })
  }

  // Compliance
  let score = 100
  if (!profile?.lut_filed && exportInvoices.length > 0) score -= 30
  if (pendingEfiras > 0) score -= pendingEfiras * 10
  if (!profile?.gstin) score -= 20
  score = Math.max(0, score)

  const isHealthy = score >= 80
  const lutFiled = !!profile?.lut_filed

  // KPI stat cards
  const kpiCards = [
    {
      id: 'ytd-revenue',
      label: 'YTD Revenue',
      value: `₹${ytdRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      sub: `${invoices.length} total invoices`,
      trend: '+',
      trendText: 'All time',
      icon: <TrendingUp className="h-4 w-4" />,
      accent: T.accent,
    },
    {
      id: 'export-revenue',
      label: 'Export Revenue',
      value: `₹${exportRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      sub: `${exportInvoices.length} export invoices`,
      trend: '',
      trendText: 'vs domestic',
      icon: <Zap className="h-4 w-4" />,
      accent: T.accentFg,
    },
    {
      id: 'compliance-score',
      label: 'Compliance Score',
      value: `${score}%`,
      sub: isHealthy ? 'Healthy — no action needed' : 'Needs attention',
      trend: isHealthy ? '✓' : '!',
      trendText: `Goal: 100%`,
      icon: <ShieldCheck className="h-4 w-4" />,
      accent: isHealthy ? T.accent : T.danger,
      gauge: true,
      gaugeValue: score,
    },
    {
      id: 'active-clients',
      label: 'Active Clients',
      value: String(clients.length),
      sub: `${activeProjects.length} with deadlines`,
      trend: clients.length > 0 ? '+' : '',
      trendText: 'total added',
      icon: <Users className="h-4 w-4" />,
      accent: T.accentFg,
    },
  ]

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ── Center scroll area ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <DashboardTopBar />

        <div className="p-6 space-y-5">

          {/* ── Page header ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-[22px] font-bold leading-tight tracking-[-0.02em]"
                style={{ color: T.fg }}
              >
                Overview
              </h1>
              <p className="text-[13px] mt-0.5" style={{ color: T.muted }}>
                Welcome back, {firstName}. Here&apos;s your financial pulse.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/invoices/new"
                className="inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-[12px] font-bold shadow-sm transition-opacity hover:opacity-90"
                style={{ background: T.accent, color: '#000' }}
              >
                <FileText className="h-3.5 w-3.5" />
                Issue Invoice
              </Link>
              <Link
                href="/dashboard/clients/new"
                className="inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-[12px] font-bold shadow-sm transition-all"
                style={{ background: T.surface, color: T.fg, border: `1px solid ${T.border}` }}
              >
                <Users className="h-3.5 w-3.5" style={{ color: T.muted }} />
                New Client
              </Link>
            </div>
          </div>

          {/* ── LUT Banner ───────────────────────────────────────────────── */}
          {!lutFiled && (
            <div
              className="flex items-center justify-between gap-4 rounded-[10px] px-5 py-3"
              style={{ background: T.dangerMuted, border: `1px solid rgba(220,38,38,0.2)` }}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: T.danger }} />
                <div>
                  <p className="text-[13px] font-bold" style={{ color: '#f87171' }}>LUT not filed for FY24-25</p>
                  <p className="text-[12px] font-medium opacity-80" style={{ color: '#ef4444' }}>Action required before generating zero-rated export invoices.</p>
                </div>
              </div>
              <Link
                href="/dashboard/settings"
                className="shrink-0 text-[12px] font-bold px-3 py-1.5 rounded-[7px] shadow-sm"
                style={{ background: T.danger, color: '#fff' }}
              >
                Resolve
              </Link>
            </div>
          )}

          {/* ── 4 KPI Stat Cards ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((card) => (
              <div
                key={card.id}
                className="rounded-[12px] p-4 flex flex-col gap-3 transition-colors hover:bg-white/[0.02]"
                style={{ background: T.surface, border: `1px solid ${T.border}` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium" style={{ color: T.muted }}>{card.label}</span>
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-[6px]"
                    style={{ background: T.accentMuted, color: card.accent }}
                  >
                    {card.icon}
                  </div>
                </div>
                <div>
                  <div
                    className="text-[26px] font-bold tracking-tight leading-none mb-1"
                    style={{ color: T.fg }}
                  >
                    {card.value}
                  </div>
                  {card.gauge && (
                    <div className="h-1 w-full rounded-full overflow-hidden mb-1.5" style={{ background: T.border }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${card.gaugeValue}%`, background: card.accent }}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: card.accent }}>
                      {card.trend}
                    </span>
                    <span className="text-[11px]" style={{ color: T.muted }}>{card.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Middle row: Donut + Mini-cards + Area chart ──────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_1fr] gap-4">

            {/* Sales Overview (Donut) */}
            <div
              className="rounded-[12px] p-5"
              style={{ background: T.surface, border: `1px solid ${T.border}` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[13px] font-bold" style={{ color: T.fg }}>Revenue Breakdown</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: T.accentMuted, color: T.accentFg }}>
                  ₹{ytdRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })} total
                </span>
              </div>

              <RevenueDonut
                export={exportRevenue}
                domestic={domesticRevenue}
                totalInvoices={invoices.length}
              />

              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { label: 'Export', value: exportRevenue, color: '#22c55e' },
                  { label: 'Domestic', value: domesticRevenue, color: '#16a34a' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-[8px] px-3 py-2"
                    style={{ background: T.bg, border: `1px solid ${T.border}` }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-[11px] font-medium" style={{ color: T.muted }}>{item.label}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold" style={{ color: T.fg }}>
                      ₹{item.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini stat cards */}
            <div className="flex flex-col gap-4">
              {/* New invoices this month */}
              <div
                className="flex-1 rounded-[12px] p-5 flex flex-col justify-between"
                style={{ background: T.surface, border: `1px solid ${T.border}` }}
              >
                <div>
                  <p className="text-[12px] font-medium mb-1" style={{ color: T.muted }}>New invoices</p>
                  <p className="text-[28px] font-bold leading-none" style={{ color: T.fg }}>
                    {invoices.filter(inv => {
                      const d = new Date(inv.created_at)
                      const now = new Date()
                      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                    }).length}
                  </p>
                </div>
                <p className="text-[11px] font-medium" style={{ color: T.muted }}>This month</p>
              </div>

              {/* Pending eFIRA */}
              <div
                className="flex-1 rounded-[12px] p-5 flex flex-col justify-between"
                style={{ background: T.surface, border: `1px solid ${T.border}` }}
              >
                <div>
                  <p className="text-[12px] font-medium mb-1" style={{ color: T.muted }}>Pending e-FIRA</p>
                  <p
                    className="text-[28px] font-bold leading-none"
                    style={{ color: pendingEfiras > 0 ? T.danger : T.accent }}
                  >
                    {pendingEfiras}
                  </p>
                </div>
                <p className="text-[11px] font-medium" style={{ color: pendingEfiras > 0 ? T.danger : T.muted }}>
                  {pendingEfiras === 0 ? 'All reconciled' : 'Action needed'}
                </p>
              </div>
            </div>

            {/* Revenue Area Chart */}
            <div
              className="rounded-[12px] p-5"
              style={{ background: T.surface, border: `1px solid ${T.border}` }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[13px] font-bold" style={{ color: T.fg }}>Total Revenue</h2>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5" style={{ color: T.muted }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: T.accent }} />
                    Domestic
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: T.muted }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: T.success }} />
                    Export
                  </div>
                </div>
              </div>
              <RevenueChart data={chartData} />
            </div>
          </div>

          {/* ── Bottom row: Client table + CTA card ──────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

            {/* Client / Invoice table */}
            <div
              className="rounded-[12px] overflow-hidden"
              style={{ background: T.surface, border: `1px solid ${T.border}` }}
            >
              <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: T.border }}>
                <h3 className="text-[13px] font-bold" style={{ color: T.fg }}>Client list</h3>
                <Link
                  href="/dashboard/clients"
                  className="text-[11px] font-bold opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: T.muted }}
                >
                  View all
                </Link>
              </div>

              {/* Table header */}
              <div
                className="grid grid-cols-[1fr_120px_140px] px-5 py-2 border-b text-[11px] font-bold uppercase tracking-widest"
                style={{ borderColor: T.border, color: T.muted }}
              >
                <span>Name</span>
                <span>Deadline</span>
                <span className="text-right">Progress</span>
              </div>

              {/* Table rows */}
              {clients.length === 0 ? (
                <div className="p-10 text-center opacity-50">
                  <CheckCircle2 className="h-6 w-6 mx-auto mb-2" style={{ color: T.muted }} />
                  <p className="text-[13px] font-medium" style={{ color: T.fg }}>No clients yet.</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: T.border }}>
                  {clients.slice(0, 5).map((c: any) => {
                    const initials = c.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
                    const days = c.project_deadline
                      ? Math.ceil((new Date(c.project_deadline).getTime() - Date.now()) / 86400000)
                      : null
                    return (
                      <Link
                        key={c.id}
                        href={`/dashboard/clients/${c.id}`}
                        className="group grid grid-cols-[1fr_120px_140px] px-5 py-3 items-center transition-colors hover:bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                            style={{ background: T.accentMuted, color: T.accentFg }}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold truncate" style={{ color: T.fg }}>{c.name}</p>
                            <p className="text-[11px] truncate opacity-60" style={{ color: T.muted }}>{c.project_title || 'No project'}</p>
                          </div>
                        </div>
                        <span className="text-[12px] font-mono" style={{ color: days !== null && days <= 3 ? T.danger : T.muted }}>
                          {days !== null ? `${days}d` : '—'}
                        </span>
                        <div className="flex items-center gap-2 justify-end">
                          <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: T.border }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${c.progress_percent || 0}%`, background: T.accent }}
                            />
                          </div>
                          <span className="text-[11px] font-mono font-bold w-8 text-right" style={{ color: T.fg }}>
                            {c.progress_percent || 0}%
                          </span>
                          <ArrowUpRight
                            className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity"
                            style={{ color: T.accentFg }}
                          />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Compliance CTA Card */}
            <div
              className="rounded-[12px] p-5 flex flex-col justify-between overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, #0a2818 0%, #0d3a22 50%, #052e16 100%)`,
                border: `1px solid rgba(34,197,94,0.2)`,
              }}
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 80% 20%, rgba(34,197,94,0.15) 0%, transparent 60%)',
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
                    Compliance
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-[48px] font-black leading-none" style={{ color: '#e8e6e1' }}>
                    {score}
                  </span>
                  <span className="text-[20px] font-bold ml-1 opacity-50" style={{ color: '#e8e6e1' }}>/100</span>
                </div>
                <p className="text-[13px] font-medium leading-snug mb-4" style={{ color: 'rgba(232,230,225,0.7)' }}>
                  {isHealthy
                    ? 'Your compliance health is excellent. Keep it up!'
                    : 'Some compliance items need your attention to keep your profile healthy.'}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-2">
                <Link
                  href="/dashboard/settings"
                  className="flex-1 rounded-[8px] py-2.5 text-[12px] font-bold text-center transition-opacity hover:opacity-90"
                  style={{ background: '#22c55e', color: '#000' }}
                >
                  {isHealthy ? 'View Status' : 'Fix Issues'}
                </Link>
                {isHealthy && (
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-[8px]"
                    style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ──────────────────────────────────────────────────────── */}
      <DashboardRightPanel
        recentInvoices={invoices.slice(0, 5)}
        pendingEfiras={pendingEfiras}
        recentClients={clients.slice(0, 5)}
        complianceScore={score}
      />
    </div>
  )
}
