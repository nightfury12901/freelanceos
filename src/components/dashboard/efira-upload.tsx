'use client'

import { useState } from 'react'
import { Upload, Loader2, CheckCircle2, FileVideo } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface EfiraUploadProps {
  invoiceId: string
  onSuccess?: () => void
}

export function EfiraUpload({ invoiceId, onSuccess }: EfiraUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File must be smaller than 5MB')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('invoiceId', invoiceId)
      formData.append('file', file)

      const res = await fetch('/api/efira', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to upload e-FIRA')
      }

      router.refresh()
      onSuccess?.()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Upload e-FIRA PDF"
        />
        <Button
          type="button"
          disabled={isUploading}
          variant="outline"
          className="w-full bg-slate-900 border-white/20 text-white hover:bg-slate-800 transition-colors pointer-events-none"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {isUploading ? 'Uploading...' : 'Upload e-FIRA'}
        </Button>
      </div>
      {error && <p className="text-xs text-red-400 font-medium px-1">{error}</p>}
    </div>
  )
}
