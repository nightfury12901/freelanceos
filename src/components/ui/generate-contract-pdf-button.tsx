'use client'

import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'

interface GenerateContractBtnProps {
  contractId: string
  existingPdfUrl?: string | null
}

export function GenerateContractPDFBtn({ contractId, existingPdfUrl }: GenerateContractBtnProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null | undefined>(existingPdfUrl)

  async function handleClick() {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/contracts/${contractId}/pdf`)
      if (!res.ok) throw new Error('PDF generation failed')
      const { pdf_url } = await res.json()
      setPdfUrl(pdf_url)
      window.open(pdf_url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('[GenerateContractPDFBtn]', err)
      alert('Could not generate PDF. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Generating…
        </>
      ) : pdfUrl ? (
        <>
          <FileDown className="h-3 w-3" />
          Download
        </>
      ) : (
        <>
          <FileDown className="h-3 w-3" />
          Generate PDF
        </>
      )}
    </button>
  )
}
