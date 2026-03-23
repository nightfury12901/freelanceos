'use client'

import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'

interface GeneratePDFButtonProps {
  invoiceId: string
  existingPdfUrl?: string | null
}

export function GeneratePDFButton({ invoiceId, existingPdfUrl }: GeneratePDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null | undefined>(existingPdfUrl)

  async function handleClick() {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/pdf`)
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.details || data.error || 'PDF generation failed')
      }
      
      setPdfUrl(data.pdf_url)
      window.open(data.pdf_url, '_blank', 'noopener,noreferrer')
    } catch (err: any) {
      console.error('[GeneratePDFButton]', err)
      alert(`Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
