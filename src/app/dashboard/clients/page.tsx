import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Plus, ArrowRight, Calendar } from 'lucide-react'
import type { ClientStatus } from '@/lib/supabase/types'

const T = {
  fg:          'var(--dash-fg)',
  muted:       'var(--dash-muted)',
  border:      'var(--dash-border)',
  surface:     'var(--dash-surface)',
  accent:      'var(--dash-accent)',
  accentFg:    'var(--dash-accent-fg)',
  danger:      'var(--dash-danger)',
  success:     'var(--dash-success)',
} as const

const STATUS_LABELS: Record<ClientStatus, string> = {
  active:    'Active',
  on_hold:   'On hold',
  completed: 'Completed',
  prospect:  'Prospect',
}

const STATUS_COLORS: Record<ClientStatus, { color: string; bg: string }> = {
  active:    { color: 'var(--dash-success)',  bg: 'var(--dash-success-muted)' },
  on_hold:   { color: 'var(--dash-accent)',   bg: 'var(--dash-accent-muted)' },
  completed: { color: 'var(--dash-muted)',    bg: 'var(--dash-border)' },
  prospect:  { color: '#818cf8',              bg: '#1e1b4b' },
}

function StatusPill({ status }: { status: ClientStatus }) {
  const { color, bg } = STATUS_COLORS[status] ?? STATUS_COLORS.active
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color, background: bg }}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: any[] | null }

  const rows = clients ?? []

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-[28px] font-serif leading-tight tracking-[-0.01em]"
            style={{ color: T.fg, fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            Client Ecosystem
          </h1>
          <p className="text-[13px] mt-1" style={{ color: T.muted }}>
            {rows.length === 0
              ? 'No active client relationships found.'
              : `Managing ${rows.length} ${rows.length === 1 ? 'client' : 'clients'} across various project stages.`}
          </p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-[13px] font-bold transition-transform hover:scale-[1.02]"
          style={{ background: T.accent, color: '#fff' }}
        >
          <Plus className="h-4 w-4" />
          Add New Client
        </Link>
      </div>

      {/* Empty state */}
      {rows.length === 0 && (
        <div
          className="rounded-[12px] px-8 py-20 text-center"
          style={{ background: T.surface, border: `1px solid ${T.border}` }}
        >
          <div className="mx-auto w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ background: T.border }}>
             <Plus className="h-6 w-6" style={{ color: T.muted }} />
          </div>
          <p className="text-[16px] font-semibold mb-2" style={{ color: T.fg }}>
            Your roster is empty
          </p>
          <p className="text-[13px] mb-8 max-w-sm mx-auto" style={{ color: T.muted }}>
            Start adding clients to track project progress, manage invoices, and generate AI-powered price estimates.
          </p>
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center gap-2 rounded-[8px] px-6 py-2.5 text-[13px] font-bold transition-all"
            style={{ background: T.accent, color: '#fff' }}
          >
            Initialize First Project
          </Link>
        </div>
      )}

      {/* Client List */}
      {rows.length > 0 && (
        <div
          className="rounded-[12px] overflow-hidden"
          style={{ background: T.surface, border: `1px solid ${T.border}` }}
        >
          {/* Table header */}
          <div
            className="grid px-6 py-4 text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{
              color: T.muted,
              borderBottom: `1px solid ${T.border}`,
              gridTemplateColumns: '1.8fr 1.5fr 1fr 0.8fr 0.8fr 40px',
            }}
          >
            <span>Entity / Principal</span>
            <span>Active Project</span>
            <span>Project Health</span>
            <span>Total Revenue</span>
            <span>Status</span>
            <span />
          </div>

          {rows.map((client, i) => (
            <div key={client.id}>
              <Link
                href={`/dashboard/clients/${client.id}`}
                className="group grid items-center px-6 py-5 transition-all duration-150 hover:bg-[var(--dash-surface-hover)]"
                style={{ gridTemplateColumns: '1.8fr 1.5fr 1fr 0.8fr 0.8fr 40px' }}
              >
                {/* Principal Identity */}
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] text-[13px] font-bold"
                    style={{ background: 'var(--dash-accent-muted)', color: 'var(--dash-accent-fg)' }}
                  >
                    {initials(client.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold truncate" style={{ color: T.fg }}>{client.name}</p>
                    <p className="text-[12px] truncate" style={{ color: T.muted }}>{client.company || client.role || 'Independent'}</p>
                  </div>
                </div>

                {/* Active Project Tracking */}
                <div className="min-w-0 pr-4">
                  <p className="text-[13px] font-medium truncate" style={{ color: client.project_title ? T.fg : T.muted }}>
                    {client.project_title || 'No active project'}
                  </p>
                  {client.project_deadline && (
                    <div className="flex items-center gap-1.5 mt-1 text-[11px]" style={{ color: T.muted }}>
                      <Calendar className="h-3 w-3" />
                      {new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' }).format(new Date(client.project_deadline))}
                    </div>
                  )}
                </div>

                {/* Progress Visualizer */}
                <div className="pr-10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold" style={{ color: T.fg }}>{client.progress_percent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: T.border }}>
                    <div 
                      className="h-full transition-all duration-500 ease-out" 
                      style={{ 
                        width: `${client.progress_percent}%`, 
                        background: client.progress_percent === 100 ? T.success : T.accent 
                      }} 
                    />
                  </div>
                </div>

                {/* Financials */}
                <p
                  className="text-[14px] font-bold font-mono"
                  style={{ color: client.total_billed > 0 ? T.fg : T.muted, fontFamily: 'var(--font-mono), monospace' }}
                >
                  {client.total_billed > 0
                    ? `₹${Number(client.total_billed).toLocaleString('en-IN')}`
                    : '—'}
                </p>

                {/* Status Badge */}
                <div>
                  <StatusPill status={client.status} />
                </div>

                {/* Visual Cue */}
                <ArrowRight
                  className="h-4 w-4 justify-self-end transition-transform duration-150 group-hover:translate-x-[4px]"
                  style={{ color: T.muted }}
                />
              </Link>
              {i < rows.length - 1 && <hr style={{ borderColor: T.border, margin: 0, opacity: 0.5 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
