'use client'

import { useMemo, useState } from 'react'
import type { Receipt } from '@/hooks/useReceipts'
import type { TimeMode } from '@/lib/dashboard/types'
import { aggregateStackedByTimeAndClient, aggregateByClient, filterByPeriod } from '@/lib/dashboard/filters'
import { StackedTimeClientChart } from '@/components/charts/StackedTimeClientChart'
import { getClientColor } from '@/lib/dashboard/colors'

interface PerClientTabProps {
  receipts: Receipt[]
  timeMode: TimeMode
}

export function PerClientTab({ receipts, timeMode }: PerClientTabProps) {
  const stackedData = useMemo(
    () => aggregateStackedByTimeAndClient(receipts, timeMode),
    [receipts, timeMode]
  )

  // All clients sorted by total (used for color assignment and checkbox order)
  const sortedClients = useMemo(
    () => aggregateByClient(receipts),
    [receipts]
  )

  const allNifs = useMemo(
    () => new Set(sortedClients.map(c => c.nif)),
    [sortedClients]
  )

  const [selectedNifs, setSelectedNifs] = useState<Set<string> | null>(null)
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string | null>(null)

  // null means "all selected" (default)
  const effectiveSelected = selectedNifs ?? allNifs
  const allSelected = effectiveSelected.size === allNifs.size

  // Client amounts filtered by selected period (for the sidebar)
  const filteredClients = useMemo(() => {
    if (!selectedPeriodKey) return sortedClients
    const periodReceipts = filterByPeriod(receipts, selectedPeriodKey, timeMode)
    return aggregateByClient(periodReceipts)
  }, [receipts, selectedPeriodKey, timeMode, sortedClients])

  // Map of nif -> filtered total for quick lookup
  const filteredTotalMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const c of filteredClients) {
      map[c.nif] = c.total
    }
    return map
  }, [filteredClients])

  const toggleClient = (nif: string) => {
    const current = new Set(effectiveSelected)
    if (current.has(nif)) {
      current.delete(nif)
    } else {
      current.add(nif)
    }
    setSelectedNifs(current.size === allNifs.size ? null : current)
  }

  const selectAll = () => setSelectedNifs(null)
  const selectNone = () => setSelectedNifs(new Set())

  const selectedPeriodLabel = selectedPeriodKey
    ? stackedData.find(d => d.periodKey === selectedPeriodKey)?.label ?? selectedPeriodKey
    : null

  return (
    <div className="space-y-3">
      {selectedPeriodKey && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <span className="text-sm text-green-800">
            Filtro ativo — Período: {selectedPeriodLabel}
          </span>
          <button
            onClick={() => setSelectedPeriodKey(null)}
            className="ml-auto text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
          >
            Limpar filtro
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        <StackedTimeClientChart
          data={stackedData}
          receipts={receipts}
          selectedNifs={effectiveSelected}
          showLegend={false}
          selectedPeriodKey={selectedPeriodKey}
          onPeriodClick={setSelectedPeriodKey}
        />
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Clientes</h3>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                disabled={allSelected}
                className="text-xs text-green-700 hover:text-green-900 disabled:text-gray-300 font-medium transition-colors"
              >
                Todos
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={selectNone}
                disabled={effectiveSelected.size === 0}
                className="text-xs text-green-700 hover:text-green-900 disabled:text-gray-300 font-medium transition-colors"
              >
                Nenhum
              </button>
            </div>
          </div>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {sortedClients.map((client, index) => {
              const isSelected = effectiveSelected.has(client.nif)
              const displayTotal = filteredTotalMap[client.nif] ?? 0
              return (
                <label
                  key={client.nif}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                    isSelected ? 'bg-gray-50' : 'opacity-50'
                  } hover:bg-gray-100`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleClient(client.nif)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: getClientColor(index) }}
                  />
                  <span className="text-sm text-gray-700 truncate flex-1" title={client.name}>
                    {client.name}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {displayTotal.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
