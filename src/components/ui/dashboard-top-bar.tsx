'use client'

import { RefreshCw, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const ranges = ['Today', 'This week', 'This month', 'This year']

export function DashboardTopBar() {
  const [range, setRange] = useState('Today')
  const [open, setOpen] = useState(false)

  return (
    <div
      className="flex items-center justify-between px-6 py-3 shrink-0 border-b"
      style={{
        borderColor: 'var(--dash-border)',
        background: 'transparent',
      }}
    >
      {/* Left: breadcrumb row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--dash-muted)' }}>
          <span>Dashboards</span>
          <span>/</span>
          <span className="font-semibold" style={{ color: 'var(--dash-fg)' }}>Overview</span>
        </div>
      </div>

      {/* Right: date range + icons */}
      <div className="flex items-center gap-2">
        {/* Date picker */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold transition-colors hover:bg-white/5"
            style={{
              background: 'var(--dash-surface)',
              border: '1px solid var(--dash-border)',
              color: 'var(--dash-fg)',
            }}
          >
            {range}
            <ChevronDown className="h-3 w-3" style={{ color: 'var(--dash-muted)' }} />
          </button>
          {open && (
            <div
              className="absolute right-0 top-full mt-1 w-36 rounded-[8px] py-1 z-50 shadow-xl"
              style={{
                background: 'var(--dash-surface)',
                border: '1px solid var(--dash-border)',
              }}
            >
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRange(r); setOpen(false) }}
                  className="w-full text-left px-3 py-2 text-[12px] font-medium transition-colors hover:bg-white/5"
                  style={{ color: r === range ? 'var(--dash-accent)' : 'var(--dash-fg)' }}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Refresh button */}
        <button
          onClick={() => window.location.reload()}
          className="p-1.5 rounded-[6px] transition-colors hover:bg-white/5"
          style={{ color: 'var(--dash-muted)' }}
          aria-label="Refresh data"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
