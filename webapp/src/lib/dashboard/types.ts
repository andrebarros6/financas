import type { Receipt } from '@/hooks/useReceipts'

export type DashboardTab = 'overview' | 'per-client' | 'total-per-client' | 'time-detail' | 'receipts' | 'year-comparison'

export type TimeMode = 'month' | 'year'

export interface DateRange {
  startDate: Date
  endDate: Date
}

/** Cross-filter state for the Overview tab */
export type CrossFilter =
  | { type: 'none' }
  | { type: 'time'; periodKey: string }
  | { type: 'client'; nif: string; name: string }

export interface TimePeriodData {
  periodKey: string  // "2024-03" or "2024"
  label: string      // "Mar 2024" or "2024"
  total: number
  count: number
}

export interface ClientData {
  nif: string
  name: string
  total: number
  count: number
}

export interface StackedClientTimePeriod {
  periodKey: string
  label: string
  clients: Record<string, number>  // nif -> amount
}

export interface SummaryStatsData {
  totalReceipts: number
  totalBilled: number
  uniqueClients: number
}
