'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import type { ClientStatus } from '@/lib/supabase/types'

const STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
  { value: 'prospect',  label: 'Prospect' },
  { value: 'active',    label: 'Active' },
  { value: 'on_hold',   label: 'On hold' },
  { value: 'completed', label: 'Completed' },
]

const T = {
  muted:  'var(--dash-muted)',
  border: 'var(--dash-border)',
  danger: 'var(--dash-danger)',
  accent: 'var(--dash-accent)',
  surface:'var(--dash-surface)',
  bg:     'var(--dash-bg)',
  fg:     'var(--dash-fg)',
} as const

export function ClientActions({
  clientId,
  currentStatus,
}: {
  clientId: string
  currentStatus: ClientStatus
}) {
  const router  = useRouter()
  const [status, setStatus]     = useState<ClientStatus>(currentStatus)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function updateStatus(newStatus: ClientStatus) {
    setStatus(newStatus)
    setSaving(true)
    await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setSaving(false)
    router.refresh()
  }

  async function deleteClient() {
    if (!confirm('Delete this client? This cannot be undone.')) return
    setDeleting(true)
    await fetch(`/api/clients/${clientId}`, { method: 'DELETE' })
    router.push('/dashboard/clients')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* Status picker */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value as ClientStatus)}
          className="appearance-none rounded-[7px] px-3 py-1.5 text-[12px] font-medium pr-6 cursor-pointer"
          style={{
            background: T.bg,
            border: `1px solid ${T.border}`,
            color: T.fg,
            fontFamily: 'var(--font-sans)',
          }}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {saving && (
          <Loader2 className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin" style={{ color: T.muted }} />
        )}
      </div>

      {/* Delete */}
      <button
        onClick={deleteClient}
        disabled={deleting}
        className="flex items-center justify-center h-8 w-8 rounded-[7px] transition-colors"
        style={{
          border: `1px solid ${T.border}`,
          background: T.surface,
          color: T.muted,
        }}
        title="Delete client"
      >
        {deleting
          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
          : <Trash2 className="h-3.5 w-3.5" />
        }
      </button>
    </div>
  )
}
