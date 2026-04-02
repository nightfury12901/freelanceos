'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface DonutProps {
  export: number
  domestic: number
  totalInvoices: number
}

const COLORS = ['#22c55e', '#16a34a', '#166534', '#052e16']

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-[8px] px-3 py-2 shadow-xl"
        style={{
          background: 'rgba(10, 15, 12, 0.95)',
          border: '1px solid var(--dash-border)',
        }}
      >
        <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--dash-muted)' }}>
          {payload[0].name}
        </p>
        <p className="text-[14px] font-mono font-bold" style={{ color: 'var(--dash-fg)' }}>
          ₹{Number(payload[0].value).toLocaleString('en-IN')}
        </p>
      </div>
    )
  }
  return null
}

export function RevenueDonut({ export: exportRev, domestic, totalInvoices }: DonutProps) {
  const total = exportRev + domestic
  const hasData = total > 0

  const data = hasData
    ? [
        { name: 'Export', value: exportRev },
        { name: 'Domestic', value: domestic },
      ]
    : [
        { name: 'Export', value: 1 },
        { name: 'Domestic', value: 1 },
      ]

  return (
    <div className="relative w-full" style={{ height: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={84}
            paddingAngle={3}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={hasData ? COLORS[index % COLORS.length] : '#1e2420'}
              />
            ))}
          </Pie>
          {hasData && <Tooltip content={<CustomTooltip />} />}
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ top: 0 }}
      >
        <span className="text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--dash-muted)' }}>
          Total
        </span>
        <span className="text-[22px] font-bold font-mono leading-tight" style={{ color: 'var(--dash-fg)' }}>
          {totalInvoices > 999 ? `${(totalInvoices / 1000).toFixed(1)}k` : totalInvoices}
        </span>
        <span className="text-[10px] font-medium" style={{ color: 'var(--dash-muted)' }}>
          invoices
        </span>
      </div>
    </div>
  )
}
