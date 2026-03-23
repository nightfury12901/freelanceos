'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import type { ClientStatus } from '@/lib/supabase/types'

const T = {
  fg:       'var(--dash-fg)',
  muted:    'var(--dash-muted)',
  border:   'var(--dash-border)',
  surface:  'var(--dash-surface)',
  accent:   'var(--dash-accent)',
  danger:   'var(--dash-danger)',
} as const

const STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
  { value: 'prospect',  label: 'Prospect' },
  { value: 'active',    label: 'Active' },
  { value: 'on_hold',   label: 'On hold' },
  { value: 'completed', label: 'Completed' },
]

function Field({ label, children, description }: { label: string; children: React.ReactNode; description?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-semibold" style={{ color: T.muted }}>
        {label}
      </label>
      {children}
      {description && <p className="text-[11px] mt-1" style={{ color: 'var(--dash-muted)' }}>{description}</p>}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 8,
  border: `1px solid var(--dash-border)`,
  background: `var(--dash-bg)`,
  color: `var(--dash-fg)`,
  padding: '9px 12px',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'var(--font-sans)',
}

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const [form, setForm] = useState({
    name:    '',
    company: '',
    email:   '',
    phone:   '',
    role:    '',
    status:  'active' as ClientStatus,
    notes:   '',
    tags:    '',
    // Fiverr-like tracking
    project_title:       '',
    project_description: '',
    project_deadline:    '',
    progress_percent:    0,
  })

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
      setForm(prev => ({ ...prev, [key]: value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const tags = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...form, 
        tags,
        project_deadline: form.project_deadline || null 
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Something went wrong.')
      setLoading(false)
      return
    }

    router.push(`/dashboard/clients/${json.id}`)
    router.refresh()
  }

  return (
    <div className="max-w-3xl space-y-8 pb-20">

      {/* Header */}
      <div>
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium mb-5"
          style={{ color: T.muted }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to clients
        </Link>
        <h1
          className="text-[28px] font-serif leading-tight tracking-[-0.01em]"
          style={{ color: T.fg, fontFamily: 'var(--font-serif), Georgia, serif' }}
        >
          Add a client
        </h1>
        <p className="text-[14px] mt-1" style={{ color: T.muted }}>
          Set up their profile and initialize their project tracking.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Contact Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1" style={{ background: T.border }}></div>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>Client Profile</span>
            <div className="h-px flex-1" style={{ background: T.border }}></div>
          </div>

          <div
            className="rounded-[12px] p-6 space-y-5"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <div className="grid grid-cols-2 gap-5">
              <Field label="Full name *">
                <input
                  required
                  value={form.name}
                  onChange={set('name')}
                  placeholder="e.g. Jonas Kahnwald"
                  style={inputStyle}
                />
              </Field>
              <Field label="Business / Company">
                <input
                  value={form.company}
                  onChange={set('company')}
                  placeholder="Acme Inc."
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Professional Role">
              <input
                value={form.role}
                onChange={set('role')}
                placeholder="Product Manager"
                style={inputStyle}
              />
            </Field>

            <div className="grid grid-cols-2 gap-5">
              <Field label="Email Address">
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="jonas@gmail.com"
                  style={inputStyle}
                />
              </Field>
              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+91..."
                  style={inputStyle}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Section 2: Active Project (Fiverr-Style) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1" style={{ background: T.border }}></div>
            <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: T.accent }}>
              <Sparkles className="h-3 w-3" /> Active Project Tracking
            </span>
            <div className="h-px flex-1" style={{ background: T.border }}></div>
          </div>

          <div
            className="rounded-[12px] p-6 space-y-5"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <Field label="Project Title" description="What are you building for them?">
              <input
                value={form.project_title}
                onChange={set('project_title')}
                placeholder="e.g. Hero Section Redesign"
                style={inputStyle}
              />
            </Field>

            <Field label="Project Description">
              <textarea
                value={form.project_description}
                onChange={set('project_description')}
                rows={3}
                placeholder="Briefly describe the scope of work..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </Field>

            <div className="grid grid-cols-2 gap-5">
              <Field label="Deadline / Delivery Date">
                <input
                  type="date"
                  value={form.project_deadline}
                  onChange={set('project_deadline')}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                />
              </Field>
              <Field label="Current Progress (%)">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.progress_percent}
                    onChange={set('progress_percent')}
                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ background: T.border }}
                  />
                  <span className="text-[13px] font-mono min-w-[3ch]" style={{ color: T.fg }}>{form.progress_percent}%</span>
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* Section 3: Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1" style={{ background: T.border }}></div>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>Settings & Tags</span>
            <div className="h-px flex-1" style={{ background: T.border }}></div>
          </div>

          <div
            className="rounded-[12px] p-6 space-y-5"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <div className="grid grid-cols-2 gap-5">
              <Field label="Relationship Status">
                <select
                  value={form.status}
                  onChange={set('status')}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tags (comma separated)">
                <input
                  value={form.tags}
                  onChange={set('tags')}
                  placeholder="premium, retainer, etc"
                  style={inputStyle}
                />
              </Field>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t" style={{ borderTopColor: T.border }}>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-[8px] px-8 py-3 text-[14px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: T.accent, color: '#fff', opacity: loading ? 0.7 : 1 }}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Initializing...' : 'Add Client & Start Project'}
          </button>
          <Link
            href="/dashboard/clients"
            className="text-[14px] font-medium"
            style={{ color: T.muted }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
