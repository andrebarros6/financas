/**
 * Types for receipt data and CSV parsing
 */

/**
 * Parsed receipt from SIRE CSV file (before database insertion)
 * Uses camelCase to match JavaScript conventions
 */
export interface ParsedReceipt {
  // Document identification
  referencia: string
  tipoDocumento: string
  atcud: string
  situacao: string
  // Dates
  dataTransacao: Date
  motivoEmissao: string | null
  dataEmissao: Date
  // Client info
  paisAdquirente: string | null
  nifAdquirente: string
  nomeAdquirente: string
  // Financial values (in euros)
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
}

/**
 * Result of parsing a SIRE CSV file
 */
export interface ParseResult {
  success: boolean
  receipts: ParsedReceipt[]
  errors: ParseError[]
  stats: ParseStats
}

/**
 * Statistics about the parsed CSV
 */
export interface ParseStats {
  totalRows: number
  parsedSuccessfully: number
  skippedCancelled: number
  skippedInvalid: number
}

/**
 * Error details for a single row that failed to parse
 */
export interface ParseError {
  line: number
  field: string
  message: string
  rawValue: string
}

/**
 * Result of validating a CSV file before parsing
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * SIRE CSV column headers (in order)
 */
export const SIRE_CSV_HEADERS = [
  'Referência',
  'Tipo Documento',
  'ATCUD',
  'Situação',
  'Data da Transação',
  'Motivo Emissão',
  'Data de Emissão',
  'País do Adquirente',
  'NIF Adquirente',
  'Nome do Adquirente',
  'Valor Tributável (em euros)',
  'Valor do IVA (em euros)',
  'Imposto do Selo como Retenção na Fonte',
  'Valor do Imposto do Selo (em euros)',
  'Valor do IRS (em euros)',
  'Total de Impostos (em euros)',
  'Total com Impostos (em euros)',
  'Total de Retenções na Fonte (em euros)',
  'Contribuição Cultura (em euros)',
  'Total do Documento (em euros)',
] as const

export const SIRE_CSV_COLUMN_COUNT = 20

/**
 * Document status values
 */
export type DocumentStatus = 'Emitido' | 'Anulado'

/**
 * Document types
 */
export type DocumentType = 'Fatura-Recibo' | 'Fatura' | string
