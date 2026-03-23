'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Circle, Loader2, Sparkles, Plus, Trash2 } from 'lucide-react'

const T = {
  fg:          'var(--dash-fg)',
  muted:       'var(--dash-muted)',
  border:      'var(--dash-border)',
  surface:     'var(--dash-surface)',
  accent:      'var(--dash-accent)',
  success:     'var(--dash-success)',
} as const

interface Milestone {
  id: string
  label: string
  done: boolean
}

export function ProjectTracker({ 
  clientId, 
  initialProgress, 
  initialMilestones,
  projectTitle,
  projectDescription,
  projectDeadline
}: { 
  clientId: string
  initialProgress: number
  initialMilestones: Milestone[]
  projectTitle?: string | null
  projectDescription?: string | null
  projectDeadline?: string | null
}) {
  const router = useRouter()
  const [progress, setProgress] = useState(initialProgress)
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones || [])
  const [isUpdating, setIsUpdating] = useState(false)
  const [newMilestone, setNewMilestone] = useState('')

  async function updateProgress(newVal: number) {
    setProgress(newVal)
    setIsUpdating(true)
    await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress_percent: newVal }),
    })
    setIsUpdating(false)
    router.refresh()
  }

  async function toggleMilestone(id: string) {
    const updated = milestones.map(m => m.id === id ? { ...m, done: !m.done } : m)
    setMilestones(updated)
    
    // Auto-calculate progress if user wants
    const doneCount = updated.filter(m => m.done).length
    const autoProgress = updated.length > 0 ? Math.round((doneCount / updated.length) * 100) : progress
    setProgress(autoProgress)

    setIsUpdating(true)
    await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestones: updated, progress_percent: autoProgress }),
    })
    setIsUpdating(false)
    router.refresh()
  }

  async function addMilestone() {
    if (!newMilestone.trim()) return
    const m: Milestone = { id: Math.random().toString(36).slice(2, 9), label: newMilestone.trim(), done: false }
    const updated = [...milestones, m]
    setMilestones(updated)
    setNewMilestone('')

    setIsUpdating(true)
    await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestones: updated }),
    })
    setIsUpdating(false)
    router.refresh()
  }

  async function deleteMilestone(id: string) {
    const updated = milestones.filter(m => m.id !== id)
    setMilestones(updated)
    setIsUpdating(true)
    await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestones: updated }),
    })
    setIsUpdating(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* progress circle / bar */}
      <div 
        className="rounded-[16px] p-8 relative overflow-hidden group"
        style={{ background: T.surface, border: `1px solid ${T.border}` }}
      >
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 mb-3" style={{ color: T.accent }}>
              <Sparkles className="h-3.5 w-3.5" /> Project Pulse
              {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
            </span>
            <h2 className="text-[24px] font-serif font-bold tracking-tight mb-2" style={{ color: T.fg }}>
              {projectTitle || "Untitled Initiative"}
            </h2>
            <p className="text-[14px] leading-relaxed max-w-lg" style={{ color: T.muted }}>
              {projectDescription || "Define your scope of work to track progress efficiently."}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 translate-y-[-10px]">
             <div className="text-[48px] font-serif font-black tracking-tighter" style={{ color: progress === 100 ? T.success : T.fg }}>
                {progress}<span className="text-[24px] font-sans opacity-40">%</span>
             </div>
             {projectDeadline && (
               <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  Due {new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' }).format(new Date(projectDeadline))}
               </div>
             )}
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="mt-8 h-2.5 w-full rounded-full overflow-hidden relative" style={{ background: T.border }}>
           <div 
              className="h-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ width: `${progress}%`, background: progress === 100 ? T.success : T.accent }}
           />
        </div>

        {/* Interactive Slider Overlay (invisible but usable) */}
        <input 
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => updateProgress(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
          title="Adjust Progress"
        />
      </div>

      {/* Milestones / Fiverr Checklist */}
      <div 
        className="rounded-[16px] p-6 lg:p-8"
        style={{ background: T.surface, border: `1px solid ${T.border}` }}
      >
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-[16px] font-bold tracking-tight" style={{ color: T.fg }}>Project Milestones</h3>
           <div className="text-[12px] font-medium" style={{ color: T.muted }}>
              {milestones.filter(m => m.done).length} of {milestones.length} completed
           </div>
        </div>

        <div className="space-y-3">
          {milestones.map((m) => (
            <div 
              key={m.id}
              className="flex items-center gap-4 group/item"
            >
              <button 
                onClick={() => toggleMilestone(m.id)}
                className="shrink-0 transition-transform active:scale-90"
                style={{ color: m.done ? T.success : T.muted }}
              >
                {m.done ? <CheckCircle2 className="h-5 w-5 fill-current bg-transparent" /> : <Circle className="h-5 w-5" />}
              </button>
              
              <div 
                className="flex-1 flex items-center justify-between py-3 px-4 rounded-[10px] transition-all border border-transparent hover:bg-white/[0.02]"
                style={{ background: m.done ? 'var(--dash-success-muted)' : 'var(--dash-border)', opacity: m.done ? 0.7 : 1 }}
              >
                 <span className={`text-[13px] font-medium ${m.done ? 'line-through' : ''}`} style={{ color: m.done ? T.success : T.fg }}>
                    {m.label}
                 </span>
                 <button 
                    onClick={() => deleteMilestone(m.id)}
                    className="opacity-0 group-hover/item:opacity-100 p-1 rounded-md hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-all"
                 >
                    <Trash2 className="h-3.5 w-3.5" />
                 </button>
              </div>
            </div>
          ))}

          {/* Add Milestone */}
          <div className="flex items-center gap-4 pt-4 mt-4 border-t" style={{ borderColor: T.border }}>
             <div className="w-5 shrink-0" />
             <div className="flex-1 flex items-center gap-2">
                <input 
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
                  placeholder="Define next phase..."
                  className="flex-1 bg-transparent text-[13px] outline-none"
                  style={{ color: T.fg }}
                />
                <button 
                   onClick={addMilestone}
                   disabled={!newMilestone.trim()}
                   className="p-1.5 rounded-[6px] transition-all disabled:opacity-30"
                   style={{ background: T.accent, color: '#fff' }}
                >
                   <Plus className="h-4 w-4" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
