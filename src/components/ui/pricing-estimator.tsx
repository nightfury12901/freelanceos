'use client'

import { useState } from 'react'
import { Sparkles, Loader2, IndianRupee, Info, Lightbulb } from 'lucide-react'

const T = {
  fg:          'var(--dash-fg)',
  muted:       'var(--dash-muted)',
  border:      'var(--dash-border)',
  surface:     'var(--dash-surface)',
  accent:      'var(--dash-accent)',
  bg:          'var(--dash-bg)',
} as const

interface Estimate {
  low: number
  high: number
  currency: string
  rationale: string
  tips: string[]
}

export function PricingEstimator({ projectTitle, projectDescription }: { projectTitle?: string | null, projectDescription?: string | null }) {
  const [loading, setLoading] = useState(false)
  const [estimate, setEstimate] = useState<Estimate | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function getEstimate() {
    if (!projectTitle || !projectDescription) {
      alert('Define a project title and description first to get an accurate estimate.')
      return
    }

    setLoading(true)
    setError(null)
    setEstimate(null)

    try {
      const res = await fetch('/api/clients/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectTitle, projectDescription }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI Estimator failed')
      setEstimate(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div 
        className="rounded-[16px] p-6 text-center group transition-all"
        style={{ background: 'linear-gradient(135deg, var(--dash-surface) 0%, var(--dash-accent-muted) 100%)', border: `1px solid ${T.border}` }}
      >
        <div className="flex justify-center mb-3">
          <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
            <Sparkles className="h-5 w-5" style={{ color: T.accent }} />
          </div>
        </div>
        <h3 className="text-[15px] font-bold mb-1" style={{ color: T.fg }}>Fair Service Pricing</h3>
        <p className="text-[12px] mb-6 leading-tight max-w-[200px] mx-auto opacity-70" style={{ color: T.muted }}>
          Powered by Llama 3 70B & market data for Indian freelancers.
        </p>
        
        <button 
          onClick={getEstimate}
          disabled={loading || !projectTitle}
          className="w-full py-2 rounded-lg text-[13px] font-bold transition-all hover:scale-[1.02] shadow-sm disabled:opacity-50"
          style={{ background: T.accent, color: '#fff' }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Estimate Price Range'}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg border bg-red-500/5 text-red-500 text-[11px] font-medium" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      {estimate && (
        <div 
          className="rounded-[16px] p-6 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500"
          style={{ background: T.surface, border: `1px solid ${T.border}` }}
        >
           <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="h-4 w-4" style={{ color: T.accent }} />
              <span className="text-[14px] font-bold" style={{ color: T.fg }}>Estimated Range</span>
           </div>
           
           <div className="text-[28px] font-mono font-black tracking-tight" style={{ color: T.fg }}>
              ₹{estimate.low.toLocaleString('en-IN')}<span className="opacity-30 mx-1">—</span>₹{estimate.high.toLocaleString('en-IN')}
           </div>

           <div className="space-y-4 pt-4 border-t" style={{ borderColor: T.border }}>
              <div>
                <div className="flex items-center gap-2 mb-1.5 opacity-60">
                   <Info className="h-3 w-3" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Rationale</span>
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: T.muted }}>{estimate.rationale}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 opacity-60">
                   <Lightbulb className="h-3 w-3" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Pricing Strategy</span>
                </div>
                <ul className="space-y-1.5">
                  {estimate.tips.map((tip, i) => (
                    <li key={i} className="text-[11px] flex gap-2" style={{ color: T.fg }}>
                       <span className="opacity-30">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
