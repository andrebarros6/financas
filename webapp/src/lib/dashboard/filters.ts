import type { Receipt } from '@/hooks/useReceipts'
import type {
  TimeMode,
  DateRange,
  TimePeriodData,
  ClientData,
  StackedClientTimePeriod,
  SummaryStatsData,
} from './types'

/** Default date range: last 12 months rolling from today */
export function getDefaultDateRange(): DateRange {
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - 12)
  start.setDate(1) // start of month
  return { startDate: start, endDate: end }
}

/** Clamp a date range to at most `maxYears` years */
export function clampDateRange(range: DateRange, maxYears: number): DateRange {
  const maxStart = new Date(range.endDate)
  maxStart.setFullYear(maxStart.getFullYear() - maxYears)
  maxStart.setDate(1)

  if (range.startDate < maxStart) {
    return { startDate: maxStart, endDate: range.endDate }
  }
  return range
}

/** Filter receipts by date range (inclusive) */
export function filterByDateRange(receipts: Receipt[], range: DateRange): Receipt[] {
  return receipts.filter(r => {
    const date = new Date(r.dataTransacao)
    return date >= range.startDate && date <= range.endDate
  })
}

/** Filter receipts by a specific time period key */
export function filterByPeriod(
  receipts: Receipt[],
  periodKey: string,
  timeMode: TimeMode
): Receipt[] {
  return receipts.filter(r => {
    const date = new Date(r.dataTransacao)
    if (timeMode === 'year') {
      return String(date.getFullYear()) === periodKey
    }
    // month mode: periodKey is "YYYY-MM"
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    return key === periodKey
  })
}

/** Filter receipts by client NIF */
export function filterByClient(receipts: Receipt[], nif: string): Receipt[] {
  return receipts.filter(r => r.nifAdquirente === nif)
}

/** Get period key for a receipt */
function getPeriodKey(date: Date, timeMode: TimeMode): string {
  if (timeMode === 'year') {
    return String(date.getFullYear())
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/** Format a period key into a human-readable label */
function formatPeriodLabel(periodKey: string, timeMode: TimeMode): string {
  if (timeMode === 'year') {
    return periodKey
  }
  const [year, month] = periodKey.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' })
}

/** Aggregate receipts into time period buckets */
export function aggregateByTimePeriod(
  receipts: Receipt[],
  timeMode: TimeMode
): TimePeriodData[] {
  const byPeriod: Record<string, TimePeriodData> = {}

  for (const receipt of receipts) {
    const date = new Date(receipt.dataTransacao)
    const key = getPeriodKey(date, timeMode)

    if (!byPeriod[key]) {
      byPeriod[key] = {
        periodKey: key,
        label: formatPeriodLabel(key, timeMode),
        total: 0,
        count: 0,
      }
    }

    byPeriod[key].total += receipt.totalDocumento
    byPeriod[key].count += 1
  }

  return Object.values(byPeriod).sort((a, b) => a.periodKey.localeCompare(b.periodKey))
}

/** Aggregate receipts by client, sorted by total descending */
export function aggregateByClient(receipts: Receipt[], limit?: number): ClientData[] {
  const byClient: Record<string, ClientData> = {}

  for (const receipt of receipts) {
    const nif = receipt.nifAdquirente

    if (!byClient[nif]) {
      byClient[nif] = {
        nif,
        name: receipt.nomeAdquirente,
        total: 0,
        count: 0,
      }
    }

    byClient[nif].total += receipt.totalDocumento
    byClient[nif].count += 1
  }

  const sorted = Object.values(byClient).sort((a, b) => b.total - a.total)
  return limit ? sorted.slice(0, limit) : sorted
}

/** Aggregate receipts into stacked time-client structure */
export function aggregateStackedByTimeAndClient(
  receipts: Receipt[],
  timeMode: TimeMode
): StackedClientTimePeriod[] {
  const byPeriod: Record<string, StackedClientTimePeriod> = {}

  for (const receipt of receipts) {
    const date = new Date(receipt.dataTransacao)
    const key = getPeriodKey(date, timeMode)

    if (!byPeriod[key]) {
      byPeriod[key] = {
        periodKey: key,
        label: formatPeriodLabel(key, timeMode),
        clients: {},
      }
    }

    const nif = receipt.nifAdquirente
    byPeriod[key].clients[nif] = (byPeriod[key].clients[nif] || 0) + receipt.totalDocumento
  }

  return Object.values(byPeriod).sort((a, b) => a.periodKey.localeCompare(b.periodKey))
}

/** Compute summary stats from receipts */
export function computeSummaryStats(receipts: Receipt[]): SummaryStatsData {
  const uniqueNifs = new Set(receipts.map(r => r.nifAdquirente))
  return {
    totalReceipts: receipts.length,
    totalBilled: receipts.reduce((sum, r) => sum + r.totalDocumento, 0),
    uniqueClients: uniqueNifs.size,
  }
}

/** Get all unique years present in receipts, sorted ascending */
export function getAvailableYears(receipts: Receipt[]): number[] {
  const years = new Set(receipts.map(r => new Date(r.dataTransacao).getFullYear()))
  return Array.from(years).sort((a, b) => a - b)
}

/** Build a date range for a specific year */
export function getYearDateRange(year: number): DateRange {
  return {
    startDate: new Date(year, 0, 1),
    endDate: new Date(year, 11, 31, 23, 59, 59),
  }
}

/** Build a date range covering all available data */
export function getAllTimeDateRange(receipts: Receipt[]): DateRange {
  if (receipts.length === 0) return getDefaultDateRange()

  const dates = receipts.map(r => new Date(r.dataTransacao).getTime())
  return {
    startDate: new Date(Math.min(...dates)),
    endDate: new Date(Math.max(...dates)),
  }
}
