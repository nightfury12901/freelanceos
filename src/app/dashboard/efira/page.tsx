import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileCheck, FileX, HelpCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import { Badge } from '@/components/ui/badge'
import { EfiraUpload } from '@/components/dashboard/efira-upload'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type InvoiceRow = Database['public']['Tables']['invoices']['Row']
type DocumentRow = Database['public']['Tables']['documents']['Row']

interface EfiraStatusResponse extends InvoiceRow {
  efira_document: DocumentRow | null
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}


export default async function EfiraTrackerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Fetch directly instead of using the API route since Server Components support async
  const [invoicesRes, docsRes] = await Promise.all([
    supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'export')
      .order('created_at', { ascending: false }) as unknown as Promise<{ data: InvoiceRow[] | null; error: any }>,
    supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .eq('doc_type', 'efira') as unknown as Promise<{ data: DocumentRow[] | null; error: any }>,
  ])

  if (invoicesRes.error) console.error(invoicesRes.error)
  if (docsRes.error) console.error(docsRes.error)

  const rows = (invoicesRes.data ?? []).map((inv) => ({
    ...inv,
    efira_document: docsRes.data?.find((d) => d.invoice_id === inv.id) ?? null,
  })) as EfiraStatusResponse[]

  const pendingCount = rows.filter((r) => !r.efira_document).length
  const completedCount = rows.length - pendingCount

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            e-FIRA Tracker
            <span className="group relative cursor-help">
              <HelpCircle className="h-4 w-4 text-slate-500 hover:text-teal-400 transition-colors" />
              <div className="pointer-events-none absolute -top-2 left-6 w-64 opacity-0 transition-opacity group-hover:opacity-100 bg-slate-800 text-xs text-slate-300 p-2 rounded-md border border-white/10 shadow-xl z-50">
                Foreign Inward Remittance Advice. Compulsory evidence required by RBI to prove export proceeds were realized in convertible foreign exchange.
              </div>
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track foreign remittance certificates for your export invoices.
          </p>
        </div>
        
        {/* Stats Row Header */}
        <div className="hidden md:flex gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 backdrop-blur">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Pending</div>
            <div className="text-xl font-bold text-amber-400">{pendingCount}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 backdrop-blur">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Completed</div>
            <div className="text-xl font-bold text-emerald-400">{completedCount}</div>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur py-20 gap-4">
          <div className="rounded-full bg-slate-800 p-4">
            <FileCheck className="h-8 w-8 text-slate-400" />
          </div>
          <div className="text-center max-w-sm">
            <p className="text-base font-medium text-white">No export invoices found</p>
            <p className="mt-2 text-sm text-slate-400">
              e-FIRAs are only tracked for &quot;Export (LUT)&quot; invoices. Create one to start tracking.
            </p>
          </div>
          <Link
            href="/dashboard/invoices/new"
            className="mt-4 bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create Export Invoice
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Invoice Date</TableHead>
                <TableHead className="text-slate-400 font-medium">Client Info</TableHead>
                <TableHead className="text-slate-400 font-medium">Total Value</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">e-FIRA Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-white/10 hover:bg-white/5 transition-colors"
                >
                  <TableCell className="text-slate-300">
                    {formatDate(row.created_at)}
                  </TableCell>

                  <TableCell className="font-medium text-white">
                    {row.client_name}
                    <div className="text-xs font-normal text-slate-500 mt-0.5">
                      INV: {row.id.slice(-6).toUpperCase()}
                    </div>
                  </TableCell>

                  <TableCell className="text-slate-300 tabular-nums font-semibold">
                    {/* Re-use INR or generic formatter depending on project setting */}
                    ${row.total.toLocaleString()} 
                  </TableCell>

                  <TableCell>
                    {row.efira_document ? (
                      <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 px-2.5">
                        <FileCheck className="w-3 h-3 mr-1.5" /> Uploaded
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 px-2.5">
                        <FileX className="w-3 h-3 mr-1.5" /> Pending
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {row.efira_document ? (
                      <div className="flex justify-end pr-2">
                        {/* 
                          Since documents bucket is private, we stored the storage path in file_url.
                          To make it downloadable without a dynamic router here, we'll point to an API wrapper.
                          For now, a simple 'Manage' button or pseudo-link.
                        */}
                        <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                          Verified <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ) : (
                      <div className="max-w-[140px] ml-auto">
                        <EfiraUpload invoiceId={row.id} />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
