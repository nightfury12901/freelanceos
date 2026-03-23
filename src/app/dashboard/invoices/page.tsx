import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import { Badge } from '@/components/ui/badge'
import { GeneratePDFButton } from '@/components/ui/generate-pdf-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

function formatAmount(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(n)
}

// ── Server Component ──────────────────────────────────────────────────────────

export default async function InvoicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: invoices, error } = await (supabase as ReturnType<typeof createClient> extends Promise<infer C> ? C : never extends never ? typeof supabase : typeof supabase)
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  type InvoiceRow = Database['public']['Tables']['invoices']['Row']

  if (error) {
    console.error('[InvoicesPage] fetch error:', error)
  }

  const rows = (invoices ?? []) as InvoiceRow[]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {rows.length === 0
              ? 'No invoices yet. Create your first one.'
              : `${rows.length} invoice${rows.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all hover:bg-teal-600 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]"
        >
          <Plus className="h-4 w-4" />
          Create Invoice
        </Link>
      </div>

      {/* Empty State */}
      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur py-20 gap-4">
          <div className="rounded-full bg-teal-500/10 p-4">
            <FileText className="h-8 w-8 text-teal-400" />
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-white">No invoices yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Generate a GST-compliant invoice in under a minute.
            </p>
          </div>
          <Link
            href="/dashboard/invoices/new"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" />
            Create your first invoice
          </Link>
        </div>
      )}

      {/* Invoice Table */}
      {rows.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Client</TableHead>
                <TableHead className="text-slate-400 font-medium">Type</TableHead>
                <TableHead className="text-slate-400 font-medium">Subtotal</TableHead>
                <TableHead className="text-slate-400 font-medium">GST</TableHead>
                <TableHead className="text-slate-400 font-medium">Total</TableHead>
                <TableHead className="text-slate-400 font-medium">Date</TableHead>
                <TableHead className="text-slate-400 font-medium">PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((invoice) => {
                const subtotal = invoice.total - invoice.gst_amount
                return (
                  <TableRow
                    key={invoice.id}
                    className="border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="font-medium text-white">
                      {invoice.client_name}
                      {invoice.client_gstin && (
                        <span className="ml-2 text-xs text-slate-500">
                          {invoice.client_gstin}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {invoice.type === 'export' ? (
                        <Badge className="bg-teal-500/15 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20">
                          Export / LUT
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20">
                          Domestic
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-slate-300 tabular-nums">
                      {formatAmount(subtotal)}
                    </TableCell>

                    <TableCell className="text-slate-300 tabular-nums">
                      {formatAmount(invoice.gst_amount)}
                    </TableCell>

                    <TableCell className="font-semibold text-white tabular-nums">
                      {formatAmount(invoice.total)}
                    </TableCell>

                    <TableCell className="text-slate-400 text-sm">
                      {formatDate(invoice.created_at)}
                    </TableCell>

                    <TableCell>
                      <GeneratePDFButton
                        invoiceId={invoice.id}
                        existingPdfUrl={invoice.pdf_url}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
