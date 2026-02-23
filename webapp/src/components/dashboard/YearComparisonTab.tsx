'use client'

import { useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import type { Receipt } from '@/hooks/useReceipts'
import { getYearDateRange, filterByDateRange } from '@/lib/dashboard/filters'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const MONTHS_PT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

// Colour palette for each year slot
const YEAR_COLORS = [
  { bg: 'rgba(99, 102, 241, 0.7)',  border: 'rgba(99, 102, 241, 1)',  dot: 'bg-indigo-500',  label: 'text-indigo-600' },
  { bg: 'rgba(34, 197, 94, 0.7)',   border: 'rgba(34, 197, 94, 1)',   dot: 'bg-green-500',   label: 'text-green-600' },
  { bg: 'rgba(249, 115, 22, 0.7)',  border: 'rgba(249, 115, 22, 1)',  dot: 'bg-orange-500',  label: 'text-orange-600' },
  { bg: 'rgba(236, 72, 153, 0.7)',  border: 'rgba(236, 72, 153, 1)',  dot: 'bg-pink-500',    label: 'text-pink-600' },
  { bg: 'rgba(14, 165, 233, 0.7)',  border: 'rgba(14, 165, 233, 1)',  dot: 'bg-sky-500',     label: 'text-sky-600' },
]

interface YearComparisonTabProps {
  receipts: Receipt[]
  availableYears: number[]
}

function pct(current: number, previous: number): string | null {
  if (previous === 0) return null
  const p = ((current - previous) / previous) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

function fmt(value: number) {
  return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
}

export function YearComparisonTab({ receipts, availableYears }: YearComparisonTabProps) {
  const latestYear = availableYears[availableYears.length - 1] ?? new Date().getFullYear()
  const prevYear = availableYears[availableYears.length - 2] ?? latestYear - 1

  const [selectedYears, setSelectedYears] = useState<number[]>([prevYear, latestYear])

  function addYear() {
    // Pick a year not already selected, preferring the oldest available
    const next = availableYears.find(y => !selectedYears.includes(y))
    if (next !== undefined) setSelectedYears(prev => [...prev, next])
  }

  function removeYear(index: number) {
    setSelectedYears(prev => prev.filter((_, i) => i !== index))
  }

  function updateYear(index: number, year: number) {
    setSelectedYears(prev => prev.map((y, i) => (i === index ? year : y)))
  }

  // Build monthly totals and aggregates for each selected year
  const yearData = useMemo(() => {
    return selectedYears.map(year => {
      const filtered = filterByDateRange(receipts, getYearDateRange(year))
      const monthly = Array(12).fill(0)
      for (const r of filtered) {
        monthly[new Date(r.dataTransacao).getMonth()] += r.totalDocumento
      }
      const total = monthly.reduce((s, v) => s + v, 0)
      const count = filtered.length
      return { year, monthly, total, count }
    })
  }, [receipts, selectedYears])

  const canAddMore = selectedYears.length < YEAR_COLORS.length &&
    availableYears.some(y => !selectedYears.includes(y))

  const chartData = {
    labels: MONTHS_PT,
    datasets: yearData.map((d, i) => {
      const color = YEAR_COLORS[i % YEAR_COLORS.length]
      return {
        label: String(d.year),
        data: d.monthly,
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 1,
        borderRadius: 4,
      }
    }),
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${fmt(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: value => `${Number(value).toLocaleString('pt-PT')}€` },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: { grid: { display: false } },
    },
  }

  // Reference year for deltas = first selected year
  const ref = yearData[0]

  return (
    <div className="space-y-6">
      {/* Year pickers */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mr-2">Comparação Anual</h2>
          {selectedYears.map((year, i) => {
            const color = YEAR_COLORS[i % YEAR_COLORS.length]
            return (
              <div key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-400 font-medium text-sm">vs</span>}
                <span className={`w-3 h-3 rounded-sm inline-block ${color.dot}`} />
                <select
                  value={year}
                  onChange={e => updateYear(i, Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {availableYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                {selectedYears.length > 2 && (
                  <button
                    onClick={() => removeYear(i)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
                    title="Remover ano"
                  >
                    ×
                  </button>
                )}
              </div>
            )
          })}
          {canAddMore && (
            <button
              onClick={addYear}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 border border-dashed border-gray-300 hover:border-gray-400 rounded-lg px-3 py-1.5 transition-colors"
            >
              + Adicionar ano
            </button>
          )}
        </div>

        {/* Chart */}
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
      </div>

      {/* Summary cards — one per year, delta relative to first year */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total billed */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-3">Total Faturado</p>
          <div className="space-y-2">
            {yearData.map((d, i) => {
              const color = YEAR_COLORS[i % YEAR_COLORS.length]
              return (
                <div key={d.year} className="flex items-baseline justify-between">
                  <p className={`text-xs font-medium ${color.label}`}>{d.year}</p>
                  <p className="text-base font-bold text-gray-900">{fmt(d.total)}</p>
                </div>
              )
            })}
          </div>
          {yearData.length >= 2 && ref.total > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
              {yearData.slice(1).map((d, i) => {
                const color = YEAR_COLORS[(i + 1) % YEAR_COLORS.length]
                const delta = pct(d.total, ref.total)
                const pos = d.total >= ref.total
                return delta ? (
                  <div key={d.year} className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${pos ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {pos ? '▲' : '▼'} {delta}
                    </span>
                    <span className={`text-xs ${color.label}`}>{d.year}</span>
                    <span className="text-xs text-gray-400">vs {ref.year}</span>
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>

        {/* Receipt count */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-3">Número de Recibos</p>
          <div className="space-y-2">
            {yearData.map((d, i) => {
              const color = YEAR_COLORS[i % YEAR_COLORS.length]
              return (
                <div key={d.year} className="flex items-baseline justify-between">
                  <p className={`text-xs font-medium ${color.label}`}>{d.year}</p>
                  <p className="text-base font-bold text-gray-900">{d.count}</p>
                </div>
              )
            })}
          </div>
          {yearData.length >= 2 && ref.count > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
              {yearData.slice(1).map((d, i) => {
                const color = YEAR_COLORS[(i + 1) % YEAR_COLORS.length]
                const delta = pct(d.count, ref.count)
                const pos = d.count >= ref.count
                return delta ? (
                  <div key={d.year} className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${pos ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {pos ? '▲' : '▼'} {delta}
                    </span>
                    <span className={`text-xs ${color.label}`}>{d.year}</span>
                    <span className="text-xs text-gray-400">vs {ref.year}</span>
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>

        {/* Avg per receipt */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-3">Média por Recibo</p>
          <div className="space-y-2">
            {yearData.map((d, i) => {
              const color = YEAR_COLORS[i % YEAR_COLORS.length]
              const avg = d.count > 0 ? d.total / d.count : 0
              return (
                <div key={d.year} className="flex items-baseline justify-between">
                  <p className={`text-xs font-medium ${color.label}`}>{d.year}</p>
                  <p className="text-base font-bold text-gray-900">{d.count > 0 ? fmt(avg) : '—'}</p>
                </div>
              )
            })}
          </div>
          {yearData.length >= 2 && ref.count > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
              {yearData.slice(1).map((d, i) => {
                const color = YEAR_COLORS[(i + 1) % YEAR_COLORS.length]
                if (d.count === 0) return null
                const refAvg = ref.total / ref.count
                const dAvg = d.total / d.count
                const delta = pct(dAvg, refAvg)
                const pos = dAvg >= refAvg
                return delta ? (
                  <div key={d.year} className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${pos ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {pos ? '▲' : '▼'} {delta}
                    </span>
                    <span className={`text-xs ${color.label}`}>{d.year}</span>
                    <span className="text-xs text-gray-400">vs {ref.year}</span>
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>
      </div>

      {/* Month-by-month table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Detalhe Mensal</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Mês</th>
                {yearData.map((d, i) => {
                  const color = YEAR_COLORS[i % YEAR_COLORS.length]
                  return (
                    <th key={d.year} className={`px-6 py-3 text-xs font-medium uppercase tracking-wide text-right ${color.label}`}>
                      {d.year}
                    </th>
                  )
                })}
                {yearData.length >= 2 && (
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide text-right">
                    Variação
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MONTHS_PT.map((month, i) => {
                const refVal = yearData[0]?.monthly[i] ?? 0
                const lastVal = yearData[yearData.length - 1]?.monthly[i] ?? 0
                const d = pct(lastVal, refVal)
                const pos = lastVal >= refVal
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{month}</td>
                    {yearData.map(yd => (
                      <td key={yd.year} className="px-6 py-3 text-right text-gray-700">
                        {yd.monthly[i] > 0 ? fmt(yd.monthly[i]) : '—'}
                      </td>
                    ))}
                    {yearData.length >= 2 && (
                      <td className="px-6 py-3 text-right">
                        {d ? (
                          <span className={`font-medium ${pos ? 'text-green-600' : 'text-red-600'}`}>{d}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold border-t border-gray-200">
                <td className="px-6 py-3 text-gray-900">Total</td>
                {yearData.map((d, i) => {
                  const color = YEAR_COLORS[i % YEAR_COLORS.length]
                  return (
                    <td key={d.year} className={`px-6 py-3 text-right ${color.label}`}>
                      {fmt(d.total)}
                    </td>
                  )
                })}
                {yearData.length >= 2 && (
                  <td className="px-6 py-3 text-right">
                    {(() => {
                      const refTotal = yearData[0]?.total ?? 0
                      const lastTotal = yearData[yearData.length - 1]?.total ?? 0
                      const d = pct(lastTotal, refTotal)
                      const pos = lastTotal >= refTotal
                      return d ? (
                        <span className={pos ? 'text-green-700' : 'text-red-700'}>{d}</span>
                      ) : null
                    })()}
                  </td>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
