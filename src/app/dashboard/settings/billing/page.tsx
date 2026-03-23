import { redirect } from 'next/navigation'
import { Check, ShieldCheck, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CheckoutButton } from '@/components/ui/checkout-button'

export default async function BillingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('plan_tier')
    .eq('id', user.id)
    .single() as { data: any; error: any }

  const isPro = profile?.plan_tier === 'pro'

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Billing & Subscription
        </h1>
        <p className="text-slate-400">
          Manage your subscription and billing details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* FREE PLAN */}
        <div className={`relative rounded-3xl border p-8 bg-white/5 backdrop-blur shadow-xl flex flex-col ${!isPro ? 'border-amber-500/50' : 'border-white/10'}`}>
          {!isPro && (
            <div className="absolute top-0 right-6 -translate-y-1/2">
              <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Current Plan
              </span>
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-white mb-2">Free Starter</h2>
          <p className="text-slate-400 text-sm mb-6">Perfect for trying out the platform.</p>
          
          <div className="mb-8">
            <span className="text-4xl font-black text-white">₹0</span>
            <span className="text-slate-500 font-medium">/month</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Up to 3 Invoices per month</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Standard Domestic Billing</span>
            </li>
            <li className="flex items-center gap-3 text-slate-500">
              <div className="h-5 w-5 border border-slate-700 rounded-full shrink-0 flex items-center justify-center. "></div>
              <span>No e-FIRA Tracking</span>
            </li>
            <li className="flex items-center gap-3 text-slate-500">
              <div className="h-5 w-5 border border-slate-700 rounded-full shrink-0 flex items-center justify-center. "></div>
              <span>No Contracts Engine</span>
            </li>
          </ul>

          <button disabled className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold disabled:opacity-50 transition-colors">
            {isPro ? 'Downgrade to Free' : 'Active'}
          </button>
        </div>

        {/* PRO PLAN */}
        <div className={`relative rounded-3xl border p-8 bg-gradient-to-br from-indigo-900/40 to-indigo-900/10 backdrop-blur shadow-2xl flex flex-col ${isPro ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-indigo-500/30'}`}>
          {isPro && (
             <div className="absolute top-0 right-6 -translate-y-1/2">
              <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Active Plan
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-6 w-6 text-indigo-400 fill-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Pro Freelancer</h2>
          </div>
          <p className="text-indigo-200 text-sm mb-6">Everything you need to run your freelance business.</p>
          
          <div className="mb-8">
            <span className="text-4xl font-black text-white">₹999</span>
            <span className="text-indigo-300 font-medium">/month</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1 text-sm text-indigo-100">
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Unlimited Invoices (Domestic & Export)</span>
            </li>
             <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Unlimited Contract Generation (NDA/SOW)</span>
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Automated e-FIRA Reconciliation</span>
            </li>
             <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>LUT Tracking & Reminders</span>
            </li>
          </ul>

          {isPro ? (
            <button disabled className="w-full py-3 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 font-semibold cursor-default">
              You are on Pro
            </button>
          ) : (
            <CheckoutButton />
          )}
        </div>
      </div>
    </div>
  )
}
