'use client'

/**
 * CSV File Uploader Component
 *
 * Features:
 * - Drag-and-drop interface
 * - Click to browse
 * - File type validation
 * - Preview of parse results
 */

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { parseSireCSV, validateSireCSV } from '@/lib/csv/sire-parser'
import type { ParseResult } from '@/types/receipt'

interface CsvUploaderProps {
  onUploadComplete: (result: ParseResult) => void
  onUploadError?: (error: string) => void
}

export function CsvUploader({ onUploadComplete, onUploadError }: CsvUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileContent = async (file: File) => {
    setFileName(file.name)
    setIsProcessing(true)

    try {
      // Read file content
      const text = await file.text()

      // First, validate structure
      const validation = validateSireCSV(text)
      if (!validation.valid) {
        const errorMessage = `Ficheiro CSV inválido:\n${validation.errors.join('\n')}`
        onUploadError?.(errorMessage)
        setIsProcessing(false)
        return
      }

      // Parse the CSV
      const result = parseSireCSV(text)

      // Check if we got any valid receipts
      if (!result.success || result.receipts.length === 0) {
        const errorMessage =
          result.errors.length > 0
            ? `Erro ao processar ficheiro:\n${result.errors[0].message}`
            : 'Nenhum recibo válido encontrado no ficheiro'
        onUploadError?.(errorMessage)
        setIsProcessing(false)
        return
      }

      // Success! Pass result to parent
      onUploadComplete(result)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Erro ao ler o ficheiro: ${error.message}`
          : 'Erro desconhecido ao processar o ficheiro'
      onUploadError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length === 0) return

    const file = files[0]

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      onUploadError?.('Por favor selecione um ficheiro CSV')
      return
    }

    await handleFileContent(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      onUploadError?.('Por favor selecione um ficheiro CSV')
      return
    }

    await handleFileContent(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-12
          transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {isProcessing ? (
            <>
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-gray-700">
                <p className="font-medium">A processar ficheiro...</p>
                {fileName && (
                  <p className="text-sm text-gray-500 mt-1">{fileName}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div className="text-gray-700">
                <p className="text-lg font-medium">
                  Arraste o ficheiro CSV do Portal das Finanças para aqui
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ou clique para selecionar
                </p>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Apenas ficheiros CSV do Portal das Finanças (SIRE)
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Como exportar do Portal das Finanças:</p>
        <ol className="list-decimal list-inside space-y-1 text-gray-500">
          <li>Aceda ao Portal das Finanças</li>
          <li>Procure "Facturas e Recibos" → "Consultar"</li>
          <li>Selecione o período pretendido</li>
          <li>Clique em "EXPORTAR TABELA"</li>
        </ol>
      </div>
    </div>
  )
}
