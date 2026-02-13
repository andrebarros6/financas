/**
 * Tests for SIRE CSV parser
 */

import { describe, expect, it } from 'vitest'
import {
  parseSireCSV,
  validateSireCSV,
  isSireCSV,
  parseEuropeanDecimal,
  parseDate,
  removeBOM,
} from './sire-parser'
import { SIRE_CSV_HEADERS } from '@/types/receipt'

describe('parseEuropeanDecimal', () => {
  it('parses simple decimal', () => {
    expect(parseEuropeanDecimal('1,50')).toBe(1.5)
  })

  it('parses decimal with thousands separator', () => {
    expect(parseEuropeanDecimal('1.391,61')).toBe(1391.61)
  })

  it('parses multiple thousands separators', () => {
    expect(parseEuropeanDecimal('1.000.000,50')).toBe(1000000.5)
  })

  it('parses zero', () => {
    expect(parseEuropeanDecimal('0,00')).toBe(0)
  })

  it('handles empty string', () => {
    expect(parseEuropeanDecimal('')).toBe(0)
  })

  it('handles whitespace', () => {
    expect(parseEuropeanDecimal('  ')).toBe(0)
  })

  it('throws on invalid format', () => {
    expect(() => parseEuropeanDecimal('invalid')).toThrow('Formato decimal inválido')
  })

  it('parses integer without decimal part', () => {
    expect(parseEuropeanDecimal('1000')).toBe(1000)
  })
})

describe('parseDate', () => {
  it('parses valid ISO date', () => {
    const date = parseDate('2024-01-15')
    expect(date.getFullYear()).toBe(2024)
    expect(date.getMonth()).toBe(0) // January is 0
    expect(date.getDate()).toBe(15)
  })

  it('throws on empty string', () => {
    expect(() => parseDate('')).toThrow('Data é obrigatória')
  })

  it('throws on invalid date', () => {
    expect(() => parseDate('invalid')).toThrow('Formato de data inválido')
  })

  it('throws on wrong format', () => {
    expect(() => parseDate('15/01/2024')).toThrow('Formato de data inválido')
  })
})

describe('removeBOM', () => {
  it('removes BOM character', () => {
    const withBOM = '\uFEFFtest'
    expect(removeBOM(withBOM)).toBe('test')
  })

  it('leaves normal text unchanged', () => {
    expect(removeBOM('test')).toBe('test')
  })

  it('handles empty string', () => {
    expect(removeBOM('')).toBe('')
  })
})

describe('isSireCSV', () => {
  it('identifies valid SIRE CSV', () => {
    const validCSV = `Referência;Tipo Documento;ATCUD;Situação
FR001;Fatura;ATCUD001;Emitido`
    expect(isSireCSV(validCSV)).toBe(true)
  })

  it('identifies valid SIRE CSV with BOM', () => {
    const validCSV = `\uFEFFReferência;Tipo Documento;ATCUD;Situação
FR001;Fatura;ATCUD001;Emitido`
    expect(isSireCSV(validCSV)).toBe(true)
  })

  it('rejects CSV with wrong headers', () => {
    const invalidCSV = `Name;Type;Code;Status
FR001;Fatura;ATCUD001;Emitido`
    expect(isSireCSV(invalidCSV)).toBe(false)
  })

  it('rejects empty file', () => {
    expect(isSireCSV('')).toBe(false)
  })

  it('rejects file with only header', () => {
    const onlyHeader = 'Referência;Tipo Documento;ATCUD'
    expect(isSireCSV(onlyHeader)).toBe(false)
  })
})

describe('validateSireCSV', () => {
  it('validates correct CSV structure', () => {
    const header = SIRE_CSV_HEADERS.join(';')
    const dataLine = 'FR001;Fatura;ATCUD001;Emitido;;2024-01-15;2024-01-15;PORTUGAL;123456789;Cliente;1000,00;0,00;;0,00;0,00;0,00;1000,00;0,00;0,00;1000,00'
    const csv = `${header}\n${dataLine}`

    const result = validateSireCSV(csv)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects empty file', () => {
    const result = validateSireCSV('')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('O ficheiro CSV está vazio')
  })

  it('rejects file with only header', () => {
    const header = SIRE_CSV_HEADERS.join(';')
    const result = validateSireCSV(header)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      'O ficheiro CSV contém apenas o cabeçalho, sem dados'
    )
  })

  it('rejects wrong number of columns', () => {
    const result = validateSireCSV('Col1;Col2;Col3\nData1;Data2;Data3')
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('Número de colunas incorreto')
  })

  it('rejects wrong header names', () => {
    const wrongHeaders = [...SIRE_CSV_HEADERS]
    wrongHeaders[0] = 'Wrong Header'
    const csv = `${wrongHeaders.join(';')}\ndata;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data`

    const result = validateSireCSV(csv)
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('Cabeçalho do CSV inválido')
  })

  it('handles BOM character', () => {
    const header = SIRE_CSV_HEADERS.join(';')
    const dataLine = 'FR001;Fatura;ATCUD001;Emitido;;2024-01-15;2024-01-15;PORTUGAL;123456789;Cliente;1000,00;0,00;;0,00;0,00;0,00;1000,00;0,00;0,00;1000,00'
    const csv = `\uFEFF${header}\n${dataLine}`

    const result = validateSireCSV(csv)
    expect(result.valid).toBe(true)
  })
})

describe('parseSireCSV', () => {
  it('parses valid CSV with multiple receipts', () => {
    const header = SIRE_CSV_HEADERS.join(';')
    const lines = [
      'FR001;Fatura-Recibo;ATCUD001;Emitido;;2024-01-15;2024-01-15;PORTUGAL;123456789;Cliente A;1.000,00;230,00;;0,00;250,00;480,00;1.230,00;250,00;0,00;980,00',
      'FR002;Fatura;ATCUD002;Emitido;;2024-02-20;2024-02-20;PORTUGAL;987654321;Cliente B;2.500,50;575,12;;0,00;625,13;1.200,25;3.075,62;625,13;0,00;2.450,49',
    ]
    const csv = `${header}\n${lines.join('\n')}`

    const result = parseSireCSV(csv)

    expect(result.success).toBe(true)
    expect(result.receipts).toHaveLength(2)
    expect(result.stats.parsedSuccessfully).toBe(2)
    expect(result.stats.totalRows).toBe(2)

    // Check first receipt
    const receipt1 = result.receipts[0]
    expect(receipt1.referencia).toBe('FR001')
    expect(receipt1.atcud).toBe('ATCUD001')
    expect(receipt1.nomeAdquirente).toBe('Cliente A')
    expect(receipt1.valorTributavel).toBe(1000)
    expect(receipt1.valorIva).toBe(230)
    expect(receipt1.totalDocumento).toBe(980)

    // Check date parsing
    expect(receipt1.dataTransacao.getFullYear()).toBe(2024)
    expect(receipt1.dataTransacao.getMonth()).toBe(0) // January
  })

  it('skips cancelled receipts', () => {
    const header = SIRE_CSV_HEADERS.join(';')
    const lines = [
      'FR001;Fatura-Recibo;ATCUD001;Emitido;;2024-01-15;2024-01-15;PORTUGAL;123456789;Cliente A;1.000,00;0,00;;0,00;0,00;0,00;1.000,00;0,00;0,00;1.000,00',
      'FR002;Fatura-Recibo;ATCUD002;Anulado;;2024-02-20;2024-02-20;PORTUGAL;987654321;Cliente B;500,00;0,00;;0,00;0,00;0,00;500,00;0,00;0,00;500,00',
      'FR003;Fatura-Recibo;ATCUD003;Emitido;;2024-03-25;2024-03-25;PORTUGAL;111222333;Cliente C;2.000,00;0,00;;0,00;0,00;0,00;2.000,00;0,00;0,00;2.000,00',
    ]
    const csv = `${header}\n${lines.join('\n')}`

    const result = parseSireCSV(csv)

    expect(result.success).toBe(true)
    expect(result.receipts).toHaveLength(2)
    expect(result.stats.skippedCancelled).toBe(1)
    expect(result.stats.parsedSuccessfully).toBe(2)
  })

  it('detects duplicate ATCUD', () => {
    const header = SIRE_CSV_HEADERS.join(';')
    const lines = [
      'FR001;Fatura-Recibo;ATCUD001;Emitido;;2024-01-15;2024-01-15;PORTUGAL;123456789;Cliente A;1.000,00;0,00;;0,00;0,00;0,00;1.000,00;0,00;0,00;1.000,00',
      'FR002;Fatura-Recibo;ATCUD001;Emitido;;2024-02-20;2024-02-20;PORTUGAL;987654321;Cliente B;500,00;0,00;;0,00;0,00;0,00;500,00;0,00;0,00;500,00',
    ]
    const csv = `${header}\n${lines.join('\n')}`

    const result = parseSireCSV(csv)

    expect(result.receipts).toHaveLength(1) // Only first one
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].field).toBe('ATCUD')
    expect(result.errors[0].message).toContain('duplicado')
    expect(result.stats.skippedInvalid).toBe(1)
  })

  it('handles parsing errors gracefully', () => {
    const header = SIRE_CSV_HEADERS.join(';')
    const lines = [
      'FR001;Fatura-Recibo;ATCUD001;Emitido;;2024-01-15;2024-01-15;PORTUGAL;123456789;Cliente A;1.000,00;0,00;;0,00;0,00;0,00;1.000,00;0,00;0,00;1.000,00',
      'FR002;Fatura-Recibo;ATCUD002;Emitido;;INVALID-DATE;2024-02-20;PORTUGAL;987654321;Cliente B;500,00;0,00;;0,00;0,00;0,00;500,00;0,00;0,00;500,00',
      'FR003;Fatura-Recibo;ATCUD003;Emitido;;2024-03-25;2024-03-25;PORTUGAL;111222333;Cliente C;2.000,00;0,00;;0,00;0,00;0,00;2.000,00;0,00;0,00;2.000,00',
    ]
    const csv = `${header}\n${lines.join('\n')}`

    const result = parseSireCSV(csv)

    expect(result.success).toBe(true) // Still successful as we got some valid receipts
    expect(result.receipts).toHaveLength(2) // First and third
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].line).toBe(3) // Second data line
    expect(result.stats.skippedInvalid).toBe(1)
  })

  it('rejects invalid CSV structure', () => {
    const result = parseSireCSV('Invalid CSV content')

    expect(result.success).toBe(false)
    expect(result.receipts).toHaveLength(0)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].field).toBe('header')
  })

  it('handles BOM character', () => {
    const header = SIRE_CSV_HEADERS.join(';')
    const line = 'FR001;Fatura-Recibo;ATCUD001;Emitido;;2024-01-15;2024-01-15;PORTUGAL;123456789;Cliente A;1.000,00;0,00;;0,00;0,00;0,00;1.000,00;0,00;0,00;1.000,00'
    const csv = `\uFEFF${header}\n${line}`

    const result = parseSireCSV(csv)

    expect(result.success).toBe(true)
    expect(result.receipts).toHaveLength(1)
  })

  it('handles empty optional fields', () => {
    const header = SIRE_CSV_HEADERS.join(';')
    const line = 'FR001;Fatura-Recibo;ATCUD001;Emitido;;2024-01-15;2024-01-15;;123456789;Cliente A;1.000,00;0,00;;0,00;0,00;;1.000,00;0,00;0,00;1.000,00'
    const csv = `${header}\n${line}`

    const result = parseSireCSV(csv)

    expect(result.success).toBe(true)
    expect(result.receipts).toHaveLength(1)
    expect(result.receipts[0].paisAdquirente).toBeNull()
    expect(result.receipts[0].totalImpostos).toBeNull()
  })

  it('rejects missing required fields', () => {
    const header = SIRE_CSV_HEADERS.join(';')
    // Missing ATCUD (empty)
    const line = 'FR001;Fatura-Recibo;;Emitido;;2024-01-15;2024-01-15;PORTUGAL;123456789;Cliente A;1.000,00;0,00;;0,00;0,00;0,00;1.000,00;0,00;0,00;1.000,00'
    const csv = `${header}\n${line}`

    const result = parseSireCSV(csv)

    expect(result.receipts).toHaveLength(0)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].message).toContain('ATCUD é obrigatório')
  })
})
