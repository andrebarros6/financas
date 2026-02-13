'use client'

import { useMemo } from 'react'
import type { Receipt } from '@/hooks/useReceipts'
import type { CrossFilter, TimeMode } from '@/lib/dashboard/types'
import {
  aggregateByTimePeriod,
  filterByPeriod,
  filterByClient,
} from '@/lib/dashboard/filters'
import { TimeIncomeChart } from '@/components/charts/TimeIncomeChart'
import { ClientIncomeChart } from '@/components/charts/ClientIncomeChart'

interface OverviewTabProps {
  receipts: Receipt[]
  timeMode: TimeMode
  crossFilter: CrossFilter
  onCrossFilterChange: (filter: CrossFilter) => void
}

export function OverviewTab({
  receipts,
  timeMode,
  crossFilter,
  onCrossFilterChange,
}: OverviewTabProps) {
  // Compute time data — filtered by client if a client cross-filter is active
  const timeData = useMemo(() => {
    const filteredReceipts =
      crossFilter.type === 'client'
        ? filterByClient(receipts, crossFilter.nif)
        : receipts
    return aggregateByTimePeriod(filteredReceipts, timeMode)
  }, [receipts, timeMode, crossFilter])

  // Compute client receipts — filtered by period if a time cross-filter is active
  const clientReceipts = useMemo(() => {
    if (crossFilter.type === 'time') {
      return filterByPeriod(receipts, crossFilter.periodKey, timeMode)
    }
    return receipts
  }, [receipts, crossFilter, timeMode])

  const handleTimeBarClick = (periodKey: string | null) => {
    if (periodKey === null) {
      onCrossFilterChange({ type: 'none' })
    } else {
      onCrossFilterChange({ type: 'time', periodKey })
    }
  }

  const handleClientBarClick = (nif: string | null, name: string) => {
    if (nif === null) {
      onCrossFilterChange({ type: 'none' })
    } else {
      onCrossFilterChange({ type: 'client', nif, name })
    }
  }

  const activeFilterLabel =
    crossFilter.type === 'time'
      ? `Período: ${timeData.find(d => d.periodKey === crossFilter.periodKey)?.label ?? crossFilter.periodKey}`
      : crossFilter.type === 'client'
        ? `Cliente: ${crossFilter.name}`
        : null

  return (
    <div className="space-y-6">
      {/* Active filter indicator */}
      {crossFilter.type !== 'none' && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <span className="text-sm text-green-800">
            Filtro ativo — {activeFilterLabel}
          </span>
          <button
            onClick={() => onCrossFilterChange({ type: 'none' })}
            className="ml-auto text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
          >
            Limpar filtro
          </button>
        </div>
      )}

      {/* Charts in a responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeIncomeChart
          data={timeData}
          selectedPeriodKey={crossFilter.type === 'time' ? crossFilter.periodKey : null}
          onBarClick={handleTimeBarClick}
        />
        <ClientIncomeChart
          receipts={clientReceipts}
          limit={5}
          selectedNif={crossFilter.type === 'client' ? crossFilter.nif : null}
          onBarClick={handleClientBarClick}
        />
      </div>
    </div>
  )
}
