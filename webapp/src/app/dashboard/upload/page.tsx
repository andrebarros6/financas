'use client'

/**
 * Upload Page
 *
 * Allows users to upload SIRE CSV files and preview the results
 * before saving to the database
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CsvUploader } from '@/components/upload/CsvUploader'
import { ParseResultsPreview } from '@/components/upload/ParseResultsPreview'
import type { ParseResult } from '@/types/receipt'

export default function UploadPage() {
  const router = useRouter()
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleUploadComplete = (result: ParseResult) => {
    setParseResult(result)
    setErrorMessage(null)
  }

  const handleUploadError = (error: string) => {
    setErrorMessage(error)
    setParseResult(null)
  }

  const handleConfirmImport = async () => {
    if (!parseResult) return

    setIsSaving(true)

    try {
      // Send receipts to API for saving
      const response = await fetch('/api/receipts/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receipts: parseResult.receipts,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao importar recibos')
      }

      const data = await response.json()

      // Success! Redirect to dashboard
      router.push(`/dashboard?imported=${data.count}`)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao importar recibos'
      setErrorMessage(message)
      setIsSaving(false)
    }
  }

  const handleCancelImport = () => {
    setParseResult(null)
    setErrorMessage(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Importar Recibos</h1>
          <p className="text-gray-600 mt-2">
            Carregue o ficheiro CSV exportado do Portal das Finanças (SIRE)
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-medium text-red-900">Erro</p>
                <p className="text-sm text-red-700 mt-1 whitespace-pre-line">
                  {errorMessage}
                </p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="mt-3 text-sm text-red-700 hover:text-red-800 font-medium"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Upload or Preview */}
        {!parseResult ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <CsvUploader
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          </div>
        ) : (
          <ParseResultsPreview
            result={parseResult}
            onConfirm={handleConfirmImport}
            onCancel={handleCancelImport}
          />
        )}

        {/* Saving Overlay */}
        {isSaving && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">
                A guardar recibos...
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Por favor aguarde, isto pode demorar alguns segundos
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
