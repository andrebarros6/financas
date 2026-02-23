/**
 * CSV Parser for SIRE format (AT Portal export)
 *
 * Handles:
 * - Semicolon delimiter
 * - European decimal format (1.391,61 → 1391.61)
 * - UTF-8 BOM character
 * - 20 columns with Portuguese headers
 */

import type {
  ParsedReceipt,
  ParseResult,
  ParseError,
  ParseStats,
  ValidationResult,
} from '@/types/receipt'
import { SIRE_CSV_HEADERS, SIRE_CSV_COLUMN_COUNT } from '@/types/receipt'

/**
 * Parse European decimal format to number
 * Converts "1.391,61" → 1391.61, "2.500" → 2500, "937,87" → 937.87
 */
export function parseEuropeanDecimal(value: string): number {
  if (!value || value.trim() === '') return 0

  const trimmed = value.trim()

  // If value contains a comma it's unambiguously European (comma = decimal separator)
  if (trimmed.includes(',')) {
    // Remove all dots (thousands separators), replace comma with dot
    const normalized = trimmed.replace(/\./g, '').replace(',', '.')
    const parsed = parseFloat(normalized)
    if (isNaN(parsed)) throw new Error(`Formato decimal inválido: ${value}`)
    return parsed
  }

  // No comma: dots can only be thousands separators (e.g. "2.500", "1.000")
  // or there are no separators at all (plain integer like "175")
  const normalized = trimmed.replace(/\./g, '')
  const parsed = parseFloat(normalized)

  if (isNaN(parsed)) {
    throw new Error(`Formato decimal inválido: ${value}`)
  }

  return parsed
}

/**
 * Parse date in YYYY-MM-DD format
 */
export function parseDate(value: string): Date {
  if (!value || value.trim() === '') {
    throw new Error('Data é obrigatória')
  }

  const date = new Date(value.trim())
  if (isNaN(date.getTime())) {
    throw new Error(`Formato de data inválido: ${value}`)
  }

  return date
}

/**
 * Remove UTF-8 BOM character if present
 */
export function removeBOM(text: string): string {
  if (text.charCodeAt(0) === 0xFEFF) {
    return text.slice(1)
  }
  return text
}

/**
 * Parse a field that may be empty, a text flag (e.g. "Não"), or a numeric value.
 * Returns null for empty or non-numeric content, otherwise parses as a number.
 */
function parseOptionalNumeric(value: string): number | null {
  const trimmed = value?.trim() ?? ''
  if (!trimmed) return null
  // Attempt to parse — if the field contains text like "Não", it won't be numeric
  try {
    return parseEuropeanDecimal(trimmed)
  } catch {
    return null
  }
}

/**
 * Parse a single CSV line into a receipt object
 */
function parseReceiptLine(fields: string[], lineNumber: number): ParsedReceipt {
  // Validate field count
  if (fields.length !== SIRE_CSV_COLUMN_COUNT) {
    throw new Error(
      `Esperado ${SIRE_CSV_COLUMN_COUNT} campos, encontrado ${fields.length}`
    )
  }

  const receipt: ParsedReceipt = {
    // Document identification
    referencia: fields[0].trim(),
    tipoDocumento: fields[1].trim(),
    atcud: fields[2].trim(),
    situacao: fields[3].trim(),

    // Dates
    motivoEmissao: fields[4].trim() || null,
    dataTransacao: parseDate(fields[5]),
    dataEmissao: parseDate(fields[6]),

    // Client info
    paisAdquirente: fields[7].trim() || null,
    nifAdquirente: fields[8].trim(),
    nomeAdquirente: fields[9].trim(),

    // Financial values
    valorTributavel: parseEuropeanDecimal(fields[10]),
    valorIva: parseEuropeanDecimal(fields[11]),
    // Col 12 can be empty, a number, or a text flag like "Não" — treat non-numeric as null
    impostoSeloRetencao: parseOptionalNumeric(fields[12]),
    valorImpostoSelo: parseEuropeanDecimal(fields[13]),
    valorIrs: parseEuropeanDecimal(fields[14]),
    totalImpostos: fields[15].trim() ? parseEuropeanDecimal(fields[15]) : null,
    totalComImpostos: parseEuropeanDecimal(fields[16]),
    totalRetencoes: parseEuropeanDecimal(fields[17]),
    contribuicaoCultura: parseEuropeanDecimal(fields[18]),
    totalDocumento: parseEuropeanDecimal(fields[19]),
  }

  // Validate required fields
  if (!receipt.atcud) {
    throw new Error('ATCUD é obrigatório')
  }

  if (!receipt.nifAdquirente) {
    throw new Error('NIF do Adquirente é obrigatório')
  }

  return receipt
}

/**
 * Validate CSV file structure
 * Checks headers and basic format without full parsing
 */
export function validateSireCSV(csvContent: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  }

  // Remove BOM if present
  const cleanContent = removeBOM(csvContent)

  // Split into lines
  const lines = cleanContent.split(/\r?\n/).filter(line => line.trim() !== '')

  if (lines.length === 0) {
    result.valid = false
    result.errors.push('O ficheiro CSV está vazio')
    return result
  }

  if (lines.length === 1) {
    result.valid = false
    result.errors.push('O ficheiro CSV contém apenas o cabeçalho, sem dados')
    return result
  }

  // Parse header
  const headerLine = lines[0]
  const headers = headerLine.split(';').map(h => h.trim())

  // Validate headers
  if (headers.length !== SIRE_CSV_COLUMN_COUNT) {
    result.valid = false
    result.errors.push(
      `Número de colunas incorreto: esperado ${SIRE_CSV_COLUMN_COUNT}, encontrado ${headers.length}`
    )
    return result
  }

  // Check each header
  const headerMismatches: string[] = []
  SIRE_CSV_HEADERS.forEach((expected, index) => {
    if (headers[index] !== expected) {
      headerMismatches.push(
        `Coluna ${index + 1}: esperado "${expected}", encontrado "${headers[index] || '(vazio)'}"`
      )
    }
  })

  if (headerMismatches.length > 0) {
    result.valid = false
    result.errors.push('Cabeçalho do CSV inválido:')
    result.errors.push(...headerMismatches)
  }

  // Check first data line has correct number of fields
  if (result.valid && lines.length > 1) {
    const firstDataLine = lines[1]
    const fields = firstDataLine.split(';')
    if (fields.length !== SIRE_CSV_COLUMN_COUNT) {
      result.warnings.push(
        `Primeira linha de dados tem ${fields.length} campos (esperado ${SIRE_CSV_COLUMN_COUNT})`
      )
    }
  }

  return result
}

/**
 * Main CSV parser function
 *
 * @param csvContent - Raw CSV file content as string
 * @returns Parsed receipts with errors and statistics
 */
export function parseSireCSV(csvContent: string): ParseResult {
  const receipts: ParsedReceipt[] = []
  const errors: ParseError[] = []
  const stats: ParseStats = {
    totalRows: 0,
    parsedSuccessfully: 0,
    skippedCancelled: 0,
    skippedInvalid: 0,
  }

  // First, validate the structure
  const validation = validateSireCSV(csvContent)
  if (!validation.valid) {
    return {
      success: false,
      receipts: [],
      errors: [
        {
          line: 1,
          field: 'header',
          message: validation.errors.join('\n'),
          rawValue: '',
        },
      ],
      stats,
    }
  }

  // Remove BOM if present
  const cleanContent = removeBOM(csvContent)

  // Split into lines
  const lines = cleanContent.split(/\r?\n/).filter(line => line.trim() !== '')

  // Skip header, process data lines
  stats.totalRows = lines.length - 1

  // Track duplicates
  const seenAtcuds = new Set<string>()

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const lineNumber = i + 1

    try {
      // Split by semicolon
      const fields = line.split(';')

      // Parse the line
      const receipt = parseReceiptLine(fields, lineNumber)

      // Check if cancelled (Situação: Anulado)
      if (receipt.situacao === 'Anulado') {
        stats.skippedCancelled++
        continue
      }

      // Check for duplicates (by ATCUD)
      if (seenAtcuds.has(receipt.atcud)) {
        errors.push({
          line: lineNumber,
          field: 'ATCUD',
          message: 'Recibo duplicado (ATCUD já existe no ficheiro)',
          rawValue: receipt.atcud,
        })
        stats.skippedInvalid++
        continue
      }

      seenAtcuds.add(receipt.atcud)
      receipts.push(receipt)
      stats.parsedSuccessfully++
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      errors.push({
        line: lineNumber,
        field: 'unknown',
        message: errorMessage,
        rawValue: line.substring(0, 50) + '...', // First 50 chars
      })
      stats.skippedInvalid++
    }
  }

  return {
    success: receipts.length > 0,
    receipts,
    errors,
    stats,
  }
}

/**
 * Quick check if a file appears to be a SIRE CSV
 * Lightweight check before full parsing
 */
export function isSireCSV(content: string): boolean {
  const cleanContent = removeBOM(content)
  const lines = cleanContent.split(/\r?\n/)

  if (lines.length < 2) return false

  const headerLine = lines[0]
  const headers = headerLine.split(';').map(h => h.trim())

  // Check if first 3 headers match (good enough heuristic)
  return (
    headers.length >= 3 &&
    headers[0] === 'Referência' &&
    headers[1] === 'Tipo Documento' &&
    headers[2] === 'ATCUD'
  )
}
