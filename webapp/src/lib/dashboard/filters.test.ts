import { describe, expect, it } from 'vitest'
import type { Receipt } from '@/hooks/useReceipts'
import {
  getDefaultDateRange,
  clampDateRange,
  filterByDateRange,
  filterByPeriod,
  filterByClient,
  aggregateByTimePeriod,
  aggregateByClient,
  aggregateStackedByTimeAndClient,
  computeSummaryStats,
  getAvailableYears,
  getYearDateRange,
} from './filters'

function makeReceipt(overrides: Partial<Receipt> = {}): Receipt {
  return {
    id: '1',
    userId: 'user1',
    referencia: 'FR001',
    tipoDocumento: 'Fatura-Recibo',
    atcud: 'ATCUD001',
    situacao: 'Emitido',
    dataTransacao: new Date('2024-06-15'),
    motivoEmissao: null,
    dataEmissao: new Date('2024-06-15'),
    paisAdquirente: 'PORTUGAL',
    nifAdquirente: '123456789',
    nomeAdquirente: 'Cliente A',
    valorTributavel: 1000,
    valorIva: 0,
    impostoSeloRetencao: null,
    valorImpostoSelo: 0,
    valorIrs: 0,
    totalImpostos: null,
    totalComImpostos: 1000,
    totalRetencoes: 0,
    contribuicaoCultura: 0,
    totalDocumento: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

describe('getDefaultDateRange', () => {
  it('returns a range ending today', () => {
    const range = getDefaultDateRange()
    const today = new Date()
    expect(range.endDate.getFullYear()).toBe(today.getFullYear())
  })

  it('starts 12 months ago at the 1st of the month', () => {
    const range = getDefaultDateRange()
    expect(range.startDate.getDate()).toBe(1)
    const diffMonths =
      (range.endDate.getFullYear() - range.startDate.getFullYear()) * 12 +
      (range.endDate.getMonth() - range.startDate.getMonth())
    expect(diffMonths).toBe(12)
  })
})

describe('clampDateRange', () => {
  it('clamps a range exceeding maxYears', () => {
    const range = {
      startDate: new Date('2020-01-01'),
      endDate: new Date('2024-12-31'),
    }
    const clamped = clampDateRange(range, 1)
    expect(clamped.startDate.getFullYear()).toBe(2023)
    expect(clamped.endDate).toBe(range.endDate)
  })

  it('does not modify a range within maxYears', () => {
    const range = {
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-31'),
    }
    const clamped = clampDateRange(range, 1)
    expect(clamped.startDate).toBe(range.startDate)
  })
})

describe('filterByDateRange', () => {
  it('filters receipts within the range', () => {
    const receipts = [
      makeReceipt({ dataTransacao: new Date('2024-01-15') }),
      makeReceipt({ dataTransacao: new Date('2024-06-15') }),
      makeReceipt({ dataTransacao: new Date('2024-12-15') }),
    ]
    const range = {
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
    }
    const filtered = filterByDateRange(receipts, range)
    expect(filtered).toHaveLength(1)
  })
})

describe('filterByPeriod', () => {
  it('filters by year', () => {
    const receipts = [
      makeReceipt({ dataTransacao: new Date('2023-06-15') }),
      makeReceipt({ dataTransacao: new Date('2024-06-15') }),
    ]
    const filtered = filterByPeriod(receipts, '2024', 'year')
    expect(filtered).toHaveLength(1)
  })

  it('filters by month', () => {
    const receipts = [
      makeReceipt({ dataTransacao: new Date('2024-06-15') }),
      makeReceipt({ dataTransacao: new Date('2024-07-15') }),
    ]
    const filtered = filterByPeriod(receipts, '2024-06', 'month')
    expect(filtered).toHaveLength(1)
  })
})

describe('filterByClient', () => {
  it('filters by NIF', () => {
    const receipts = [
      makeReceipt({ nifAdquirente: '111' }),
      makeReceipt({ nifAdquirente: '222' }),
      makeReceipt({ nifAdquirente: '111' }),
    ]
    const filtered = filterByClient(receipts, '111')
    expect(filtered).toHaveLength(2)
  })
})

describe('aggregateByTimePeriod', () => {
  it('aggregates by year', () => {
    const receipts = [
      makeReceipt({ dataTransacao: new Date('2023-06-15'), totalDocumento: 100 }),
      makeReceipt({ dataTransacao: new Date('2024-03-15'), totalDocumento: 200 }),
      makeReceipt({ dataTransacao: new Date('2024-09-15'), totalDocumento: 300 }),
    ]
    const result = aggregateByTimePeriod(receipts, 'year')
    expect(result).toHaveLength(2)
    expect(result[0].periodKey).toBe('2023')
    expect(result[0].total).toBe(100)
    expect(result[1].periodKey).toBe('2024')
    expect(result[1].total).toBe(500)
  })

  it('aggregates by month', () => {
    const receipts = [
      makeReceipt({ dataTransacao: new Date('2024-06-15'), totalDocumento: 100 }),
      makeReceipt({ dataTransacao: new Date('2024-06-20'), totalDocumento: 200 }),
      makeReceipt({ dataTransacao: new Date('2024-07-15'), totalDocumento: 300 }),
    ]
    const result = aggregateByTimePeriod(receipts, 'month')
    expect(result).toHaveLength(2)
    expect(result[0].periodKey).toBe('2024-06')
    expect(result[0].total).toBe(300)
    expect(result[0].count).toBe(2)
    expect(result[1].periodKey).toBe('2024-07')
    expect(result[1].total).toBe(300)
  })

  it('sorts by period key', () => {
    const receipts = [
      makeReceipt({ dataTransacao: new Date('2024-12-15') }),
      makeReceipt({ dataTransacao: new Date('2024-01-15') }),
    ]
    const result = aggregateByTimePeriod(receipts, 'month')
    expect(result[0].periodKey).toBe('2024-01')
    expect(result[1].periodKey).toBe('2024-12')
  })
})

describe('aggregateByClient', () => {
  it('aggregates and sorts by total descending', () => {
    const receipts = [
      makeReceipt({ nifAdquirente: '111', nomeAdquirente: 'A', totalDocumento: 100 }),
      makeReceipt({ nifAdquirente: '222', nomeAdquirente: 'B', totalDocumento: 500 }),
      makeReceipt({ nifAdquirente: '111', nomeAdquirente: 'A', totalDocumento: 200 }),
    ]
    const result = aggregateByClient(receipts)
    expect(result).toHaveLength(2)
    expect(result[0].nif).toBe('222')
    expect(result[0].total).toBe(500)
    expect(result[1].nif).toBe('111')
    expect(result[1].total).toBe(300)
    expect(result[1].count).toBe(2)
  })

  it('respects limit', () => {
    const receipts = [
      makeReceipt({ nifAdquirente: '111', totalDocumento: 100 }),
      makeReceipt({ nifAdquirente: '222', totalDocumento: 200 }),
      makeReceipt({ nifAdquirente: '333', totalDocumento: 300 }),
    ]
    const result = aggregateByClient(receipts, 2)
    expect(result).toHaveLength(2)
    expect(result[0].nif).toBe('333')
  })
})

describe('aggregateStackedByTimeAndClient', () => {
  it('creates stacked data by period and client', () => {
    const receipts = [
      makeReceipt({ dataTransacao: new Date('2024-01-15'), nifAdquirente: '111', totalDocumento: 100 }),
      makeReceipt({ dataTransacao: new Date('2024-01-20'), nifAdquirente: '222', totalDocumento: 200 }),
      makeReceipt({ dataTransacao: new Date('2024-02-15'), nifAdquirente: '111', totalDocumento: 300 }),
    ]
    const result = aggregateStackedByTimeAndClient(receipts, 'month')
    expect(result).toHaveLength(2)
    expect(result[0].periodKey).toBe('2024-01')
    expect(result[0].clients['111']).toBe(100)
    expect(result[0].clients['222']).toBe(200)
    expect(result[1].periodKey).toBe('2024-02')
    expect(result[1].clients['111']).toBe(300)
  })
})

describe('computeSummaryStats', () => {
  it('computes correct stats', () => {
    const receipts = [
      makeReceipt({ nifAdquirente: '111', totalDocumento: 100 }),
      makeReceipt({ nifAdquirente: '222', totalDocumento: 200 }),
      makeReceipt({ nifAdquirente: '111', totalDocumento: 300 }),
    ]
    const stats = computeSummaryStats(receipts)
    expect(stats.totalReceipts).toBe(3)
    expect(stats.totalBilled).toBe(600)
    expect(stats.uniqueClients).toBe(2)
  })

  it('handles empty array', () => {
    const stats = computeSummaryStats([])
    expect(stats.totalReceipts).toBe(0)
    expect(stats.totalBilled).toBe(0)
    expect(stats.uniqueClients).toBe(0)
  })
})

describe('getAvailableYears', () => {
  it('returns sorted unique years', () => {
    const receipts = [
      makeReceipt({ dataTransacao: new Date('2024-06-15') }),
      makeReceipt({ dataTransacao: new Date('2022-06-15') }),
      makeReceipt({ dataTransacao: new Date('2024-01-15') }),
      makeReceipt({ dataTransacao: new Date('2023-06-15') }),
    ]
    const years = getAvailableYears(receipts)
    expect(years).toEqual([2022, 2023, 2024])
  })
})

describe('getYearDateRange', () => {
  it('returns full year range', () => {
    const range = getYearDateRange(2024)
    expect(range.startDate.getFullYear()).toBe(2024)
    expect(range.startDate.getMonth()).toBe(0)
    expect(range.startDate.getDate()).toBe(1)
    expect(range.endDate.getFullYear()).toBe(2024)
    expect(range.endDate.getMonth()).toBe(11)
    expect(range.endDate.getDate()).toBe(31)
  })
})
