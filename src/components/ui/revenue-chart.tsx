'use client'

import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { AlertCircle } from 'lucide-react'

const T = {
  fg:          'var(--dash-fg)',
  muted:       'var(--dash-muted)',
  border:      'var(--dash-border)',
  surface:     'var(--dash-surface)',
  accent:      'var(--dash-accent)',
  success:     'var(--dash-success)',
} as const

interface ChartData {
  month: string
  revenue: number
  export: number
  domestic: number
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div 
        className="rounded-[8px] p-3 shadow-xl backdrop-blur-md" 
        style={{ background: 'rgba(20, 20, 18, 0.85)', border: `1px solid ${T.border}` }}
      >
        <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: T.muted }}>{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6">
               <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: T.fg }}>
                 <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                 {entry.name}
               </span>
               <span className="text-[13px] font-mono font-bold" style={{ color: T.fg }}>
                 ₹{entry.value.toLocaleString('en-IN')}
               </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function RevenueChart({ data }: { data: ChartData[] }) {
  // If we have literally 0 data across the board, show empty state
  const totalRevenue = useMemo(() => data.reduce((acc, curr) => acc + curr.revenue, 0), [data])

  if (totalRevenue === 0) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center rounded-[12px] border border-dashed" style={{ borderColor: T.border, background: 'var(--dash-surface-hover)' }}>
         <AlertCircle className="h-6 w-6 mb-3 opacity-40" style={{ color: T.muted }} />
         <p className="text-[13px] font-medium" style={{ color: T.fg }}>No revenue data yet.</p>
         <p className="text-[12px] opacity-70" style={{ color: T.muted }}>Issue an invoice to see your cash flow.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[320px] pt-4 pb-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={T.accent} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={T.accent} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExport" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={T.success} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={T.success} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="var(--dash-border)" 
            opacity={0.4} 
          />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: T.muted, fontSize: 11, fontFamily: 'var(--font-mono)' }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: T.muted, fontSize: 11, fontFamily: 'var(--font-mono)' }}
            tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
             type="monotone" 
             dataKey="export" 
             name="Export"
             stackId="1"
             stroke={T.success} 
             fillOpacity={1} 
             fill="url(#colorExport)" 
             strokeWidth={2}
          />
          <Area 
             type="monotone" 
             dataKey="domestic" 
             name="Domestic"
             stackId="1"
             stroke={T.accent} 
             fillOpacity={1} 
             fill="url(#colorTotal)" 
             strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
