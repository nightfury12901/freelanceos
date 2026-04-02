'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Trash2, ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

import { INDIAN_STATES, SAC_OPTIONS, GST_RATE_OPTIONS } from '@/lib/constants'

// UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Zod Schema
const invoiceItemSchema = z.object({
  name: z.string().min(1, "Item description is required"),
  sac: z.string().min(1, "SAC code is required"),
  rate: z.number(),
  amount: z.number().min(1, "Amount must be greater than 0"),
})

const invoiceFormSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  clientAddress: z.string().min(5, "Address must be at least 5 characters"),
  clientGstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format").optional().or(z.literal("")),
  clientStateCode: z.string().min(2, "State Code is required"),
  type: z.enum(["domestic", "export"]),
  lutNumber: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
}).superRefine((data, ctx) => {
  if (data.type === 'export' && (!data.lutNumber || data.lutNumber.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "LUT Number is required for export invoices",
      path: ["lutNumber"]
    })
  }
})

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>

export default function NewInvoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      type: "domestic",
      clientName: searchParams.get('clientName') || "",
      clientAddress: searchParams.get('clientAddress') || "",
      clientGstin: searchParams.get('clientGstin') || "",
      clientStateCode: searchParams.get('clientStateCode') || "27", // Default to MH
      lutNumber: "",
      items: [{ name: "", sac: "998314", rate: 18, amount: 0 }],
    },
  })

  // Re-sync values if searchParams change (rare but helpful if navigating between clients)
  useEffect(() => {
    if (searchParams.get('clientName')) {
      form.setValue('clientName', searchParams.get('clientName') || "")
    }
    if (searchParams.get('clientAddress')) {
      form.setValue('clientAddress', searchParams.get('clientAddress') || "")
    }
    if (searchParams.get('clientGstin')) {
      form.setValue('clientGstin', searchParams.get('clientGstin') || "")
    }
    if (searchParams.get('clientStateCode')) {
      form.setValue('clientStateCode', searchParams.get('clientStateCode') || "27")
    }
  }, [searchParams, form])

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  })

  const invoiceType = form.watch("type")

  async function onSubmit(data: InvoiceFormValues) {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body?.error ?? 'Failed to create invoice')
      }

      router.push('/dashboard/invoices')
      router.refresh()
    } catch (error) {
      console.error('[NewInvoicePage] submit error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate totals for preview
  const items = form.watch("items")
  const subtotal = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0)
  const gstTotal = items.reduce((acc, item) => acc + ((Number(item.amount) || 0) * (Number(item.rate) || 0) / 100), 0)
  const total = subtotal + gstTotal

  return (
    <div className="mx-auto max-w-4xl py-10 px-4 md:px-8 pb-24">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Link href="/dashboard/invoices" className="text-sm font-medium text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Invoices
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-2">New Invoice</h1>
          <p className="text-sm text-slate-400">Create a compliant GST or LUT export invoice.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-xl p-6 sm:p-10">
        {submitError && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3">
             <div className="mt-0.5"><div className="w-5 h-5 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center font-bold text-xs">!</div></div>
             <div>
               <h3 className="font-semibold text-sm">Action Blocked</h3>
               <p className="text-sm mt-1">{submitError}</p>
             </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Invoice Type */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Invoice Attributes</h2>
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Invoice Type</FormLabel>
                    <div className="flex p-1 bg-black/40 rounded-xl w-max border border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("domestic")
                          form.getValues("items").forEach((_, index) => {
                            form.setValue(`items.${index}.rate` as any, 18)
                          })
                        }}
                        className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                          field.value === "domestic" 
                          ? "bg-teal-500 text-white shadow-md" 
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        Standard Domestic
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("export")
                          form.getValues("items").forEach((_, index) => {
                            form.setValue(`items.${index}.rate` as any, 0)
                          })
                        }}
                        className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                          field.value === "export" 
                          ? "bg-teal-500 text-white shadow-md" 
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        Export (LUT) Zero-Rated
                      </button>
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <AnimatePresence>
                {invoiceType === "export" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <FormField
                      control={form.control}
                      name="lutNumber"
                      render={({ field }) => (
                        <FormItem className="pt-2">
                          <FormLabel className="text-slate-300">Letter of Undertaking (LUT) Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. AD270423XXXXXXX" {...field} className="max-w-md bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-teal-500/50" />
                          </FormControl>
                          <FormDescription className="text-slate-500">Must be active for the current FY to export without IGST payment.</FormDescription>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Client Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Client Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Client Name / Business</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp LLC" {...field} className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-teal-500/50" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientGstin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Client GSTIN (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="27XXXXX0000X1Z5" {...field} className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-teal-500/50 uppercase" />
                      </FormControl>
                      <FormDescription className="text-slate-500">Leave blank for B2C invoices.</FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-slate-300">Billing Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Export Lane, Global City, Country" {...field} className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-teal-500/50" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientStateCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Place of Supply (State)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/20 border-white/10 text-white focus:border-teal-500/50">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 bg-slate-900 border-white/10 text-white">
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state.code} value={state.code} className="focus:bg-teal-500/20 focus:text-white cursor-pointer">
                              {state.code} - {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h2 className="text-lg font-semibold text-white">Line Items</h2>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => append({ name: "", sac: "998314", rate: invoiceType === 'export' ? 0 : 18, amount: 0 })}
                  className="bg-transparent border-white/10 text-slate-300 hover:text-white hover:border-teal-500/50 hover:bg-teal-500/10"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <motion.div 
                    key={field.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col md:flex-row gap-4 items-start bg-black/20 p-4 rounded-xl border border-white/5"
                  >
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1 w-full">
                          <FormLabel className="text-xs text-slate-400">Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Consulting Services" {...field} className="bg-white/5 border-white/10 text-white focus:border-teal-500/50" />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`items.${index}.sac`}
                      render={({ field }) => (
                        <FormItem className="w-full md:w-36">
                          <FormLabel className="text-xs text-slate-400">SAC Code</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-teal-500/50">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                              {SAC_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="focus:bg-teal-500/20 focus:text-white cursor-pointer">
                                  {opt.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.rate`}
                      render={({ field }) => (
                        <FormItem className="w-full md:w-28">
                          <FormLabel className="text-xs text-slate-400">GST Rate</FormLabel>
                          <Select 
                            disabled={invoiceType === 'export'} 
                            onValueChange={(val) => field.onChange(Number(val))} 
                            value={String(field.value || 0)}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white disabled:opacity-50 disabled:bg-black/50 focus:border-teal-500/50">
                                <SelectValue placeholder="Rate" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                              {GST_RATE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={String(opt.value)} className="focus:bg-teal-500/20 focus:text-white cursor-pointer">
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="w-full md:w-40">
                          <FormLabel className="text-xs text-slate-400">Amount (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              {...field} 
                              onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                              className="bg-white/5 border-white/10 text-white focus:border-teal-500/50" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="mt-6 md:mt-[30px] shrink-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="flex flex-col items-end pt-6 border-t border-white/10 space-y-3">
              <div className="flex justify-between w-full max-w-sm text-sm text-slate-400 font-medium">
                <span>Subtotal</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-sm text-sm text-slate-400 font-medium">
                <span>GST / Taxes</span>
                <span>₹ {gstTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-sm text-xl font-bold text-white border-t border-white/10 pt-3 mt-1">
                <span>Total Amount</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-4 pt-10 pb-4">
              <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting} className="text-slate-400 hover:text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-teal-500 text-white hover:bg-teal-600 shadow-[0_4px_14px_0_rgba(20,184,166,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(20,184,166,0.5)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save as Draft
                  </>
                )}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}
