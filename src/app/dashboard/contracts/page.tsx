import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, FileSignature, ArrowUpRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import { Badge } from '@/components/ui/badge'
import { GenerateContractPDFBtn } from '@/components/ui/generate-contract-pdf-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type ContractRow = Database['public']['Tables']['contracts']['Row']

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

const TEMPLATE_NAMES: Record<string, string> = {
  nda: "Non-Disclosure Agreement (NDA)",
  sow: "Statement of Work (SOW)",
  retainer: "Retainer Agreement",
}

export default async function ContractsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: contracts, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[ContractsPage] fetch error:', error)
  }

  const rows = (contracts ?? []) as ContractRow[]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Contracts
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {rows.length === 0
              ? 'No contracts generated yet.'
              : `${rows.length} contract${rows.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <Link
          href="/dashboard/contracts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all hover:bg-teal-600 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]"
        >
          <Plus className="h-4 w-4" />
          Create Contract
        </Link>
      </div>

      {/* Empty State */}
      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur py-20 gap-4">
          <div className="rounded-full bg-teal-500/10 p-4">
            <FileSignature className="h-8 w-8 text-teal-400" />
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-white">Protect your work</p>
            <p className="mt-1 text-sm text-slate-400 max-w-sm">
              Generate bulletproof NDAs, Statements of Work, and Retainer agreements in seconds.
            </p>
          </div>
          <Link
            href="/dashboard/contracts/new"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" />
            Create your first contract
          </Link>
        </div>
      )}

      {/* Contracts Table */}
      {rows.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Type</TableHead>
                <TableHead className="text-slate-400 font-medium">Client Info</TableHead>
                <TableHead className="text-slate-400 font-medium">Date Generated</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Document</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((contract) => {
                // Ignore TS any on fields here for simplicity
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fields = contract.fields_json as any

                return (
                  <TableRow
                    key={contract.id}
                    className="border-white/10 hover:bg-white/5 transition-colors"
                  >
                     <TableCell>
                        <Badge className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20">
                          {TEMPLATE_NAMES[contract.template_type] || contract.template_type.toUpperCase()}
                        </Badge>
                    </TableCell>

                    <TableCell className="font-medium text-white">
                      {fields.clientName || 'Unknown Client'}
                    </TableCell>

                    <TableCell className="text-slate-400 text-sm">
                      {formatDate(contract.created_at)}
                    </TableCell>

                    <TableCell className="text-right">
                      {contract.pdf_url ? (
                        <a
                          href={contract.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-end gap-1 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors ml-auto"
                        >
                          Download
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      ) : (
                        <GenerateContractPDFBtn contractId={contract.id} />
                      )}
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
