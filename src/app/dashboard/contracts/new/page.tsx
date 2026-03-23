'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const contractSchema = z.object({
  template_type: z.enum(['nda', 'sow', 'retainer'] as const),
  fields_json: z.object({
    clientName: z.string().min(2, 'Client Name is required'),
    effectiveDate: z.string().min(1, 'Effective Date is required'),
    governingLaw: z.string().min(1, 'Governing Law is required'),
    projectScope: z.string().optional(),
    compensation: z.string().optional(),
    duration: z.string().optional(),
  }),
})

type ContractFormValues = z.infer<typeof contractSchema>

export default function NewContractPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      template_type: 'nda',
      fields_json: {
        clientName: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        governingLaw: 'India',
        projectScope: '',
        compensation: '',
        duration: '',
      },
    },
  })

  const templateType = watch('template_type')

  async function onSubmit(data: ContractFormValues) {
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error('Failed to create contract')
      }

      router.push('/dashboard/contracts')
      router.refresh()
    } catch (err) {
      console.error(err)
      setErrorMsg('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/contracts"
          className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            Build Contract
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </h1>
          <p className="text-sm text-slate-400">
            Generate bulletproof legal agreements in seconds.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-2xl overflow-hidden p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {errorMsg && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm font-medium border border-red-500/20">
              {errorMsg}
            </div>
          )}

          {/* Type Selection */}
          <div className="space-y-4">
            <Label className="text-base text-white">Select Agreement Type</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'nda', label: 'NDA', desc: 'Non-Disclosure Agreement' },
                { id: 'sow', label: 'SOW', desc: 'Statement of Work' },
                { id: 'retainer', label: 'Retainer', desc: 'Monthly Support' },
              ].map((type) => (
                <label
                  key={type.id}
                  className={`relative flex flex-col p-4 cursor-pointer rounded-xl border transition-all ${
                    templateType === type.id
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    value={type.id}
                    className="sr-only"
                    {...register('template_type')}
                  />
                  <span className="font-semibold">{type.label}</span>
                  <span className="text-xs mt-1 opacity-80">{type.desc}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Core Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client / Company Name</Label>
              <Input
                id="clientName"
                placeholder="Acme Corp LLC"
                className="bg-black/20 border-white/10 text-white"
                {...register('fields_json.clientName')}
              />
              {errors.fields_json?.clientName && (
                <p className="text-xs text-red-400 mt-1">{errors.fields_json.clientName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                id="effectiveDate"
                type="date"
                className="bg-black/20 border-white/10 text-white block w-full"
                {...register('fields_json.effectiveDate')}
              />
              {errors.fields_json?.effectiveDate && (
                <p className="text-xs text-red-400 mt-1">{errors.fields_json.effectiveDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="governingLaw">Governing Law (Jurisdiction)</Label>
              <Input
                id="governingLaw"
                placeholder="India / Delaware / UK"
                className="bg-black/20 border-white/10 text-white"
                {...register('fields_json.governingLaw')}
              />
            </div>
          </div>

          {/* Dynamic Extra Fields for SOW & Retainer */}
          {templateType !== 'nda' && (
            <div className="space-y-6 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <Label htmlFor="projectScope">Scope of Services</Label>
                <textarea
                  id="projectScope"
                  placeholder="Describe exactly what services you will provide..."
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  {...register('fields_json.projectScope')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compensation">Compensation / Fee Structure</Label>
                <Input
                  id="compensation"
                  placeholder={templateType === 'retainer' ? '$2,000/month flat fee' : 'Fixed fee of $5,000'}
                  className="bg-black/20 border-white/10 text-white"
                  {...register('fields_json.compensation')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Timeline / Duration</Label>
                <Input
                  id="duration"
                  placeholder={templateType === 'retainer' ? '6 months minimum commitment' : 'Delivery within 45 days'}
                  className="bg-black/20 border-white/10 text-white"
                  {...register('fields_json.duration')}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Contract'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
