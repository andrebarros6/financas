/**
 * Hook for fetching and managing receipts
 */

import { useState, useEffect } from 'react'

export interface Receipt {
  id: string
  userId: string
  referencia: string
  tipoDocumento: string
  atcud: string
  situacao: string
  dataTransacao: Date
  motivoEmissao: string | null
  dataEmissao: Date
  paisAdquirente: string | null
  nifAdquirente: string
  nomeAdquirente: string
  valorTributavel: number
  valorIva: number
  impostoSeloRetencao: number | null
  valorImpostoSelo: number
  valorIrs: number
  totalImpostos: number | null
  totalComImpostos: number
  totalRetencoes: number
  contribuicaoCultura: number
  totalDocumento: number
  createdAt: Date
  updatedAt: Date
}

interface UseReceiptsOptions {
  year?: string
  client?: string
  startDate?: string
  endDate?: string
}

interface UseReceiptsResult {
  receipts: Receipt[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useReceipts(options: UseReceiptsOptions = {}): UseReceiptsResult {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReceipts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (options.year) params.append('year', options.year)
      if (options.client) params.append('client', options.client)
      if (options.startDate) params.append('startDate', options.startDate)
      if (options.endDate) params.append('endDate', options.endDate)

      const url = `/api/receipts${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao carregar recibos')
      }

      const data = await response.json()

      // Transform date strings back to Date objects
      const transformedReceipts = data.receipts.map((receipt: any) => ({
        ...receipt,
        dataTransacao: new Date(receipt.dataTransacao),
        dataEmissao: new Date(receipt.dataEmissao),
        createdAt: new Date(receipt.createdAt),
        updatedAt: new Date(receipt.updatedAt),
      }))

      setReceipts(transformedReceipts)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReceipts()
  }, [options.year, options.client, options.startDate, options.endDate])

  return {
    receipts,
    isLoading,
    error,
    refetch: fetchReceipts,
  }
}
