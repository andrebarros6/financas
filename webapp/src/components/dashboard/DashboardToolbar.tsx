'use client'

import { useState } from 'react'
import type { DashboardTab, TimeMode, DateRange } from '@/lib/dashboard/types'
import { getDefaultDateRange, getYearDateRange, getAllTimeDateRange } from '@/lib/dashboard/filters'
import type { Receipt } from '@/hooks/useReceipts'

interface DashboardToolbarProps {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  timeMode: TimeMode
  onTimeModeChange: (mode: TimeMode) => void
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  availableYears: number[]
  isPro: boolean
  receipts: Receipt[]
}

type TimeRangeOption = 'last-12' | 'all' | 'custom' | number

const TABS: { key: DashboardTab; label: string; proOnly?: boolean }[] = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'time-detail', label: 'Detalhe Temporal' },
  { key: 'total-per-client', label: 'Detalhe Clientes' },
  { key: 'per-client', label: 'Período x Cliente' },
  { key: 'year-comparison', label: 'Comparação Anual', proOnly: true },
  { key: 'receipts', label: 'Recibos' },
]

const MONTHS_PT: string[] = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function DashboardToolbar({
  activeTab,
  onTabChange,
  timeMode,
  onTimeModeChange,
  dateRange,
  onDateRangeChange,
  availableYears,
  isPro,
  receipts,
}: DashboardToolbarProps) {
  const [isCustomMode, setIsCustomMode] = useState(false)

  // Determine current selection for the time range dropdown
  const currentTimeRange = (): TimeRangeOption => {
    if (isCustomMode) return 'custom'
    const defaultRange = getDefaultDateRange()
    if (
      dateRange.startDate.getFullYear() === defaultRange.startDate.getFullYear() &&
      dateRange.startDate.getMonth() === defaultRange.startDate.getMonth() &&
      dateRange.endDate.getFullYear() === defaultRange.endDate.getFullYear() &&
      dateRange.endDate.getMonth() === defaultRange.endDate.getMonth()
    ) {
      return 'last-12'
    }
    // Check if it's a specific year
    for (const year of availableYears) {
      if (
        dateRange.startDate.getFullYear() === year &&
        dateRange.startDate.getMonth() === 0 &&
        dateRange.endDate.getFullYear() === year &&
        dateRange.endDate.getMonth() === 11
      ) {
        return year
      }
    }
    // Check if it matches "all time"
    if (isPro && receipts.length > 0) {
      const allRange = getAllTimeDateRange(receipts)
      if (
        dateRange.startDate.getTime() === allRange.startDate.getTime() &&
        dateRange.endDate.getTime() === allRange.endDate.getTime()
      ) {
        return 'all'
      }
    }
    return 'custom'
  }

  const selected = currentTimeRange()

  const handleTimeRangeChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomMode(true)
      return
    }
    setIsCustomMode(false)
    if (value === 'last-12') {
      onDateRangeChange(getDefaultDateRange())
    } else if (value === 'all') {
      onDateRangeChange(getAllTimeDateRange(receipts))
    } else {
      const year = parseInt(value)
      onDateRangeChange(getYearDateRange(year))
    }
  }

  const handleCustomStartChange = (month: number, year: number) => {
    const newStart = new Date(year, month, 1)
    if (newStart <= dateRange.endDate) {
      onDateRangeChange({ startDate: newStart, endDate: dateRange.endDate })
    }
  }

  const handleCustomEndChange = (month: number, year: number) => {
    const newEnd = new Date(year, month + 1, 0, 23, 59, 59)
    if (newEnd >= dateRange.startDate) {
      onDateRangeChange({ startDate: dateRange.startDate, endDate: newEnd })
    }
  }

  // Year range for custom selects: from earliest available year to current year
  const customYearOptions = (() => {
    const currentYear = new Date().getFullYear()
    const minYear = availableYears.length > 0 ? Math.min(...availableYears) : currentYear
    const years: number[] = []
    for (let y = minYear; y <= currentYear; y++) years.push(y)
    return years
  })()

  // For free users, determine the allowed year (most recent)
  const maxAllowedYear = availableYears.length > 0
    ? Math.max(...availableYears)
    : new Date().getFullYear()

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {TABS.map(tab => {
          const locked = tab.proOnly && !isPro
          return (
            <button
              key={tab.key}
              onClick={() => !locked && onTabChange(tab.key)}
              title={locked ? 'Disponível no plano Pro' : undefined}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : locked
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {locked && (
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )
        })}
      </div>

      {/* Time Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Month / Year toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onTimeModeChange('month')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeMode === 'month'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => onTimeModeChange('year')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeMode === 'year'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Anual
          </button>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-sm text-gray-600">Período:</label>
          <select
            value={String(selected)}
            onChange={e => handleTimeRangeChange(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="last-12">Últimos 12 meses</option>
            {isPro && <option value="all">Todo o período</option>}
            {availableYears.map(year => {
              const isLocked = !isPro && year < maxAllowedYear
              return (
                <option key={year} value={year} disabled={isLocked}>
                  {year}{isLocked ? ' (Pro)' : ''}
                </option>
              )
            })}
            <option value="custom">Personalizado...</option>
          </select>

          {/* Custom month/year selects — shown when "Personalizado" is active */}
          {selected === 'custom' && (
            <>
              <span className="text-sm text-gray-500">de</span>
              <select
                value={dateRange.startDate.getMonth()}
                onChange={e => handleCustomStartChange(Number(e.target.value), dateRange.startDate.getFullYear())}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {MONTHS_PT.map((name, i) => (
                  <option key={i} value={i}>{name}</option>
                ))}
              </select>
              <select
                value={dateRange.startDate.getFullYear()}
                onChange={e => handleCustomStartChange(dateRange.startDate.getMonth(), Number(e.target.value))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {customYearOptions.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <span className="text-sm text-gray-500">até</span>
              <select
                value={dateRange.endDate.getMonth()}
                onChange={e => handleCustomEndChange(Number(e.target.value), dateRange.endDate.getFullYear())}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {MONTHS_PT.map((name, i) => (
                  <option key={i} value={i}>{name}</option>
                ))}
              </select>
              <select
                value={dateRange.endDate.getFullYear()}
                onChange={e => handleCustomEndChange(dateRange.endDate.getMonth(), Number(e.target.value))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {customYearOptions.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
