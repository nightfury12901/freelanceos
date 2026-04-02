import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Mail, Phone, Tag, Receipt } from 'lucide-react'
import type { ClientStatus } from '@/lib/supabase/types'
import { ClientActions } from '@/components/ui/client-actions'
import { ProjectTracker } from '@/components/ui/project-tracker'
import { PricingEstimator } from '@/components/ui/pricing-estimator'

const T = {
  fg:          'var(--dash-fg)',
  muted:       'var(--dash-muted)',
  border:      'var(--dash-border)',
  surface:     'var(--dash-surface)',
  accent:      'var(--dash-accent)',
  accentFg:    'var(--dash-accent-fg)',
  success:     'var(--dash-success)',
} as const

const STATUS_LABELS: Record<ClientStatus, string> = {
  active:    'Active Relationship',
  on_hold:   'On Standby',
  completed: 'Project Finalized',
  prospect:  'Onboarding / Opportunity',
}

const STATUS_COLORS: Record<ClientStatus, { color: string; bg: string }> = {
  active:    { color: 'var(--dash-success)', bg: 'var(--dash-success-muted)' },
  on_hold:   { color: 'var(--dash-accent)',  bg: 'var(--dash-accent-muted)' },
  completed: { color: 'var(--dash-muted)',   bg: 'var(--dash-border)' },
  prospect:  { color: '#818cf8',             bg: '#1e1b4b' },
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single() as { data: any }

  if (!client) notFound()

  // Invoices for this client
  const { data: invoicesRaw } = await supabase
    .from('invoices')
    .select('id, type, total, gst_amount, created_at, client_name')
    .eq('user_id', user.id)
    .ilike('client_name', `%${client.name}%`)
    .order('created_at', { ascending: false })
    .limit(5)

  const invoices = (invoicesRaw as any[]) ?? []
  const { color, bg } = STATUS_COLORS[client.status as ClientStatus] ?? STATUS_COLORS.active

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">

      {/* Primary Navigation & Control */}
      <div className="flex items-center justify-between gap-6 pb-6 border-b" style={{ borderColor: T.border }}>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard/clients"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:bg-white/5 border border-white/10"
            style={{ color: T.muted }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-[14px] font-bold tracking-tight mb-0.5" style={{ color: T.fg }}>Project Management Hub</h1>
            <p className="text-[12px] opacity-60" style={{ color: T.muted }}>Detailed tracking for {client.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/invoices/new?clientName=${encodeURIComponent(client.name)}&clientGstin=${encodeURIComponent(client.client_gstin || '')}&clientAddress=${encodeURIComponent(client.company || '')}`}
            className="inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-[13px] font-bold transition-all hover:scale-[1.02] shadow-sm active:scale-[0.98]"
            style={{ background: T.accent, color: '#fff' }}
          >
            <Receipt className="h-4 w-4" />
            Issue Invoice
          </Link>
          <ClientActions clientId={client.id} currentStatus={client.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left / Central Column: The Core Pulse (Fiverr Level) */}
        <div className="lg:col-span-2 space-y-8">
           <ProjectTracker 
             clientId={client.id}
             initialProgress={client.progress_percent || 0}
             initialMilestones={client.milestones || []}
             projectTitle={client.project_title}
             projectDescription={client.project_description}
             projectDeadline={client.project_deadline}
           />

           {/* Financial Audit Trail */}
           <div
            className="rounded-[16px] overflow-hidden"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: T.border }}>
              <p className="text-[12px] font-bold uppercase tracking-widest opacity-60">Financial Track Record</p>
              <div className="text-[11px] font-mono" style={{ color: T.muted }}>Lifetime ₹{client.total_billed.toLocaleString('en-IN')}</div>
            </div>

            {invoices.length === 0 ? (
              <div className="px-6 py-12 text-center opacity-40">
                <Receipt className="h-8 w-8 mx-auto mb-3" style={{ color: T.muted }} />
                <p className="text-[14px]">Financial relations not yet established.</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: T.border }}>
                {invoices.map((inv: any) => (
                  <Link
                    key={inv.id}
                    href={`/dashboard/invoices/${inv.id}`}
                    className="flex items-center gap-6 px-6 py-5 group transition-all hover:bg-white/[0.02]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-widest opacity-40 mb-1">Generated</p>
                      <p className="text-[13px] font-medium" style={{ color: T.fg }}>{new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(inv.created_at))}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[16px] font-mono font-bold" style={{ color: T.fg }}>₹{Number(inv.total).toLocaleString('en-IN')}</p>
                       <p className="text-[11px]" style={{ color: T.muted }}>{inv.type === 'export' ? 'Zero-Rated / LUT' : 'Standard GST'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
           </div>
        </div>

        {/* Right Sidebar: Context & AI Intelligence */}
        <div className="space-y-8">
           {/* Principal Profile Card */}
           <div
            className="rounded-[16px] p-6 lg:p-8"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-[20px] text-[24px] font-black mb-5"
                style={{ background: 'var(--dash-accent-muted)', color: 'var(--dash-accent-fg)' }}
              >
                {initials(client.name)}
              </div>
              <h2 className="text-[20px] font-serif font-black mb-1" style={{ color: T.fg }}>{client.name}</h2>
              <p className="text-[13px] font-medium opacity-60 mb-5">{client.role || client.company || 'Private Relationship'}</p>
              
              <span
                className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-8"
                style={{ color, background: bg }}
              >
                {STATUS_LABELS[client.status as ClientStatus]}
              </span>
            </div>

            <div className="space-y-6 pt-6 border-t" style={{ borderColor: T.border }}>
               {client.email && (
                 <a href={`mailto:${client.email}`} className="flex items-center gap-3 transition-colors hover:text-[var(--dash-accent)]">
                    <Mail className="h-4 w-4 opacity-40" />
                    <span className="text-[13px] font-medium truncate">{client.email}</span>
                 </a>
               )}
               {client.phone && (
                 <a href={`tel:${client.phone}`} className="flex items-center gap-3 transition-colors hover:text-[var(--dash-accent)]">
                    <Phone className="h-4 w-4 opacity-40" />
                    <span className="text-[13px] font-medium">{client.phone}</span>
                 </a>
               )}
            </div>

            {/* Client Tags */}
            {client.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {client.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest rounded-[6px] px-2.5 py-1.5"
                    style={{ background: T.border, color: T.muted }}
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
           </div>

           {/* AI Pricing Advisor (Powered by Groq) */}
           <PricingEstimator 
             projectTitle={client.project_title} 
             projectDescription={client.project_description} 
           />

           {/* Administrative Notes */}
           {client.notes && (
            <div
              className="rounded-[16px] p-6"
              style={{ background: T.surface, border: `1px solid ${T.border}` }}
            >
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4 opacity-60">Strategic Context</h4>
              <p className="text-[13px] leading-relaxed opacity-80 italic" style={{ color: T.fg }}>
                &quot;{client.notes}&quot;
              </p>
            </div>
           )}
        </div>

      </div>
    </div>
  )
}
