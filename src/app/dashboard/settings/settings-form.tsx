'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { updateProfile } from './actions'

const T = {
  fg:           'var(--dash-fg)',
  muted:        'var(--dash-muted)',
  border:       'var(--dash-border)',
  surface:      'var(--dash-surface)',
  accent:       'var(--dash-accent)',
  success:      'var(--dash-success)',
  danger:       'var(--dash-danger)',
  dangerMuted:  'var(--dash-danger-muted)',
} as const

function Field({ label, description, children }: { label: string, description?: string, children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
       <label className="block text-[12px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>
         {label}
       </label>
       {children}
       {description && <p className="text-[11px] opacity-70 mt-1" style={{ color: T.muted }}>{description}</p>}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  borderRadius: '8px',
  border: `1px solid ${T.border}`,
  background: 'var(--dash-bg)',
  color: T.fg,
  padding: '10px 14px',
  fontSize: '14px',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'border-color 0.2s',
}

export function SettingsForm({ profile, email }: { profile: any, email: string }) {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    gstin: profile?.gstin || '',
    profession: profile?.profession || '',
    lut_filed: profile?.lut_filed || false
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSaved(false)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('gstin', formData.gstin)
      data.append('profession', formData.profession)
      data.append('lut_filed', formData.lut_filed.toString())

      const res = await updateProfile(data)
      if (res?.error) throw new Error(res.error)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
       {/* ── Email Info (Readonly) ──────────────────────── */}
       <div 
         className="rounded-[16px] p-6 flex items-center gap-4"
         style={{ background: T.surface, border: `1px solid ${T.border}` }}
       >
         <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
           <ShieldCheck className="h-5 w-5" style={{ color: T.accent }} />
         </div>
         <div>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-0.5" style={{ color: T.muted }}>Authenticated Account</p>
            <p className="text-[15px] font-bold" style={{ color: T.fg }}>{email}</p>
         </div>
       </div>

       {/* ── Settings Form ───────────────────────────── */}
       <form onSubmit={handleSubmit} className="space-y-6">
          <div 
             className="rounded-[16px] p-8 space-y-6"
             style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
             <h2 className="text-[18px] font-serif font-black mb-6" style={{ color: T.fg }}>Business Profile</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Field label="Legal / Full Name">
                 <input 
                   name="name"
                   value={formData.name}
                   onChange={handleChange}
                   placeholder="e.g. John Doe"
                   style={inputStyle}
                 />
               </Field>
               
               <Field label="Profession / Role">
                 <input 
                   name="profession"
                   value={formData.profession}
                   onChange={handleChange}
                   placeholder="e.g. Software Consultant"
                   style={inputStyle}
                 />
               </Field>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t" style={{ borderColor: T.border }}>
               <Field 
                  label="GSTIN (Optional)" 
                  description="Required if you plan on generating valid tax invoices."
               >
                 <input 
                   name="gstin"
                   value={formData.gstin}
                   onChange={handleChange}
                   placeholder="22ABCDE1234F1Z5"
                   style={{ ...inputStyle, fontFamily: 'var(--font-mono), monospace' }}
                 />
               </Field>
             </div>

             <div className="pt-6 border-t" style={{ borderColor: T.border }}>
                <div 
                  className="rounded-[12px] p-6 transition-colors"
                  style={{ 
                    border: `1px solid ${formData.lut_filed ? 'rgba(22, 163, 74, 0.2)' : T.border}`,
                    background: formData.lut_filed ? 'var(--dash-success-muted)' : 'transparent'
                  }}
                >
                   <label className="flex items-start gap-4 cursor-pointer">
                      <div className="relative flex items-center mt-0.5">
                         <input 
                           type="checkbox"
                           name="lut_filed"
                           checked={formData.lut_filed}
                           onChange={handleChange}
                           className="peer h-5 w-5 appearance-none rounded-[6px] border border-white/20 bg-white/5 checked:bg-green-500 checked:border-green-500 transition-all"
                         />
                         <CheckCircle2 className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-black h-3.5 w-3.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div>
                         <p className="text-[14px] font-bold mb-1" style={{ color: formData.lut_filed ? T.success : T.fg }}>LUT filed for current FY</p>
                         <p className="text-[12px] leading-relaxed max-w-lg" style={{ color: formData.lut_filed ? T.success : T.muted, opacity: formData.lut_filed ? 0.9 : 0.7 }}>
                           By checking this box, you confirm that you have an active Letter of Undertaking (LUT) for the current financial year. This allows you to generate zero-rated Export invoices without IGST.
                         </p>
                      </div>
                   </label>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
               type="submit"
               disabled={loading}
               className="inline-flex items-center gap-2 rounded-[8px] px-8 py-3 text-[14px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
               style={{ background: T.accent, color: '#fff' }}
             >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Saving...' : 'Save Settings'}
             </button>

             {saved && (
               <span className="flex items-center gap-1.5 text-[13px] font-bold animate-in fade-in" style={{ color: T.success }}>
                  <CheckCircle2 className="h-4 w-4" /> Profile saved
               </span>
             )}
             
             {error && (
               <span className="flex items-center gap-1.5 text-[13px] font-bold rounded-[6px] px-3 py-1.5" style={{ background: T.dangerMuted, color: T.danger }}>
                  <AlertTriangle className="h-4 w-4" /> {error}
               </span>
             )}
          </div>
       </form>
    </div>
  )
}
