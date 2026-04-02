import {
  Bell,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Mail,
  Phone,
  MoreHorizontal,
} from 'lucide-react'

function timeAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins} minutes ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} ${hrs === 1 ? 'hour' : 'hours'} ago`
    const days = Math.floor(hrs / 24)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  } catch {
    return 'Recently'
  }
}

interface Notification {
  icon: React.ReactNode
  text: string
  sub: string
}

interface Activity {
  initials: string
  color: string
  text: string
  time: string
}

interface Contact {
  name: string
  initials: string
  color: string
  active?: boolean
}

interface RightPanelProps {
  // Recent invoices → Notifications
  recentInvoices: Array<{
    id: string
    client_name: string
    total: number
    type: string
    created_at: string
  }>
  // Pending eFIRA count → Notification
  pendingEfiras: number
  // Recent clients → Activities + Contacts
  recentClients: Array<{
    id: string
    name: string
    project_title?: string
    created_at?: string
    status?: string
  }>
  // Compliance score → Activity
  complianceScore: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  '#22c55e', '#16a34a', '#15803d', '#166534',
  '#14532d', '#1a7a4a', '#0f6b3e',
]

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}


// ─── Sub-components ──────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[13px] font-bold mb-3" style={{ color: 'var(--dash-fg)' }}>
      {children}
    </h3>
  )
}

function NotificationRow({ icon, text, sub }: Notification) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'var(--dash-accent-muted)', color: 'var(--dash-accent)' }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold leading-snug" style={{ color: 'var(--dash-fg)' }}>
          {text}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--dash-muted)' }}>
          {sub}
        </p>
      </div>
    </div>
  )
}

function ActivityRow({ initials: ini, color, text, time }: Activity) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{ background: color, color: '#fff' }}
      >
        {ini}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium leading-snug truncate" style={{ color: 'var(--dash-fg)' }}>
          {text}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--dash-muted)' }}>
          {time}
        </p>
      </div>
    </div>
  )
}

function ContactRow({ name, initials: ini, color, active }: Contact) {
  return (
    <div
      className="flex items-center gap-3 mb-2 rounded-[8px] px-2 py-1.5 transition-colors"
      style={active ? { background: 'var(--dash-surface)', border: '1px solid var(--dash-border)' } : {}}
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{ background: color, color: '#fff' }}
      >
        {ini}
      </div>
      <span className="flex-1 text-[12px] font-medium truncate" style={{ color: 'var(--dash-fg)' }}>
        {name}
      </span>
      {active ? (
        <div className="flex items-center gap-1.5">
          <button
            className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            style={{ color: 'var(--dash-accent)', background: 'var(--dash-accent-muted)' }}
            aria-label={`Email ${name}`}
          >
            <Mail className="h-2.5 w-2.5" />
          </button>
          <button
            className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            style={{ color: 'var(--dash-accent)', background: 'var(--dash-accent-muted)' }}
            aria-label={`Call ${name}`}
          >
            <Phone className="h-2.5 w-2.5" />
          </button>
        </div>
      ) : (
        <button
          className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-white/5"
          style={{ color: 'var(--dash-muted)' }}
          aria-label="More options"
        >
          <MoreHorizontal className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function DashboardRightPanel({
  recentInvoices,
  pendingEfiras,
  recentClients,
  complianceScore,
}: RightPanelProps) {
  // Build notifications from real data
  const notifications: Notification[] = []

  if (recentInvoices[0]) {
    notifications.push({
      icon: <DollarSign className="h-3.5 w-3.5" />,
      text: `Invoice issued to ${recentInvoices[0].client_name}`,
      sub: timeAgo(recentInvoices[0].created_at),
    })
  }
  if (recentInvoices[1]) {
    notifications.push({
      icon: <FileText className="h-3.5 w-3.5" />,
      text: `${recentInvoices[1].type.toUpperCase()} invoice — ₹${Number(recentInvoices[1].total).toLocaleString('en-IN')}`,
      sub: timeAgo(recentInvoices[1].created_at),
    })
  }
  if (pendingEfiras > 0) {
    notifications.push({
      icon: <AlertCircle className="h-3.5 w-3.5" />,
      text: `${pendingEfiras} e-FIRA${pendingEfiras > 1 ? 's' : ''} pending reconciliation`,
      sub: 'Action needed',
    })
  }
  if (recentClients[0]) {
    notifications.push({
      icon: <UserPlus className="h-3.5 w-3.5" />,
      text: `${recentClients[0].name} added as a client`,
      sub: 'Recently',
    })
  }
  if (complianceScore >= 80) {
    notifications.push({
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      text: 'Compliance health is good',
      sub: `Score: ${complianceScore}/100`,
    })
  }

  // Pad if empty
  if (notifications.length === 0) {
    notifications.push({
      icon: <Bell className="h-3.5 w-3.5" />,
      text: 'No recent activity',
      sub: 'Issue an invoice to get started',
    })
  }

  // Build activities
  const activities: Activity[] = recentInvoices.slice(0, 3).map((inv, i) => ({
    initials: initials(inv.client_name),
    color: AVATAR_COLORS[i % AVATAR_COLORS.length],
    text: `Invoice #${inv.id.slice(0, 6).toUpperCase()} — ${inv.client_name}`,
    time: timeAgo(inv.created_at),
  }))

  recentClients.slice(0, 2).forEach((c, i) => {
    activities.push({
      initials: initials(c.name),
      color: AVATAR_COLORS[(i + 3) % AVATAR_COLORS.length],
      text: `Client "${c.name}" added`,
      time: 'Recently',
    })
  })

  // Build contacts
  const contacts: Contact[] = recentClients.slice(0, 5).map((c, i) => ({
    name: c.name,
    initials: initials(c.name),
    color: AVATAR_COLORS[i % AVATAR_COLORS.length],
    active: i === 2, // highlight the middle one like reference
  }))

  return (
    <div
      className="w-[280px] shrink-0 h-full overflow-y-auto border-l"
      style={{
        background: 'var(--dash-surface)',
        borderColor: 'var(--dash-border)',
      }}
    >
      <div className="p-4">

        {/* Notifications */}
        <SectionTitle>Notifications</SectionTitle>
        <div className="mb-5">
          {notifications.slice(0, 4).map((n, i) => (
            <NotificationRow key={i} {...n} />
          ))}
        </div>

        <div className="border-t mb-4" style={{ borderColor: 'var(--dash-border)' }} />

        {/* Activities */}
        <SectionTitle>Activities</SectionTitle>
        <div className="mb-5">
          {activities.length > 0 ? (
            activities.slice(0, 4).map((a, i) => (
              <ActivityRow key={i} {...a} />
            ))
          ) : (
            <p className="text-[12px]" style={{ color: 'var(--dash-muted)' }}>
              No recent activity yet.
            </p>
          )}
        </div>

        <div className="border-t mb-4" style={{ borderColor: 'var(--dash-border)' }} />

        {/* Contacts */}
        <SectionTitle>Contacts of your clients</SectionTitle>
        <div>
          {contacts.length > 0 ? (
            contacts.map((c, i) => (
              <ContactRow key={i} {...c} />
            ))
          ) : (
            <p className="text-[12px]" style={{ color: 'var(--dash-muted)' }}>
              No clients added yet.
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
