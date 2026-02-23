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
import { getYearDateRange, filterByDateRange, aggregateByTimePeriod } from '@/lib/dashboard/filters'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const MONTHS_PT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
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

export function YearComparisonTab({ receipts, availableYears }: YearComparisonTabProps) {
  const latestYear = availableYears[availableYears.length - 1] ?? new Date().getFullYear()
  const prevYear = availableYears[availableYears.length - 2] ?? latestYear - 1

  const [yearA, setYearA] = useState(prevYear)
  const [yearB, setYearB] = useState(latestYear)

  const receiptsA = useMemo(
    () => filterByDateRange(receipts, getYearDateRange(yearA)),
    [receipts, yearA]
  )
  const receiptsB = useMemo(
    () => filterByDateRange(receipts, getYearDateRange(yearB)),
    [receipts, yearB]
  )

  // Build month-indexed totals (0–11) for each year
  const monthlyA = useMemo(() => {
    const totals = Array(12).fill(0)
    for (const r of receiptsA) {
      totals[new Date(r.dataTransacao).getMonth()] += r.totalDocumento
    }
    return totals
  }, [receiptsA])

  const monthlyB = useMemo(() => {
    const totals = Array(12).fill(0)
    for (const r of receiptsB) {
      totals[new Date(r.dataTransacao).getMonth()] += r.totalDocumento
    }
    return totals
  }, [receiptsB])

  const totalA = monthlyA.reduce((s, v) => s + v, 0)
  const totalB = monthlyB.reduce((s, v) => s + v, 0)
  const countA = receiptsA.length
  const countB = receiptsB.length

  const chartData = {
    labels: MONTHS_PT,
    datasets: [
      {
        label: String(yearA),
        data: monthlyA,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: String(yearB),
        data: monthlyB,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed.y ?? 0
            return `${ctx.dataset.label}: ${value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `${Number(value).toLocaleString('pt-PT')}€`,
        },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: { grid: { display: false } },
    },
  }

  const delta = pct(totalB, totalA)
  const deltaPositive = totalB >= totalA

  return (
    <div className="space-y-6">
      {/* Year pickers */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 flex-wrap mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mr-2">Comparação Anual</h2>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" />
            <select
              value={yearA}
              onChange={e => setYearA(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <span className="text-gray-400 font-medium">vs</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
            <select
              value={yearB}
              onChange={e => setYearB(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total billed */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-3">Total Faturado</p>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xs text-indigo-600 font-medium mb-0.5">{yearA}</p>
              <p className="text-xl font-bold text-gray-900">
                {totalA.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-600 font-medium mb-0.5">{yearB}</p>
              <p className="text-xl font-bold text-gray-900">
                {totalB.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
          </div>
          {delta && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span
                className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full ${
                  deltaPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {deltaPositive ? '▲' : '▼'} {delta}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs {yearA}</span>
            </div>
          )}
        </div>

        {/* Receipt count */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-3">Número de Recibos</p>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xs text-indigo-600 font-medium mb-0.5">{yearA}</p>
              <p className="text-xl font-bold text-gray-900">{countA}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-600 font-medium mb-0.5">{yearB}</p>
              <p className="text-xl font-bold text-gray-900">{countB}</p>
            </div>
          </div>
          {countA > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span
                className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full ${
                  countB >= countA ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {countB >= countA ? '▲' : '▼'} {pct(countB, countA)}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs {yearA}</span>
            </div>
          )}
        </div>

        {/* Avg per receipt */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-3">Média por Recibo</p>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xs text-indigo-600 font-medium mb-0.5">{yearA}</p>
              <p className="text-xl font-bold text-gray-900">
                {countA > 0
                  ? (totalA / countA).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
                  : '—'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-600 font-medium mb-0.5">{yearB}</p>
              <p className="text-xl font-bold text-gray-900">
                {countB > 0
                  ? (totalB / countB).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
                  : '—'}
              </p>
            </div>
          </div>
          {countA > 0 && countB > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span
                className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full ${
                  totalB / countB >= totalA / countA ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {totalB / countB >= totalA / countA ? '▲' : '▼'} {pct(totalB / countB, totalA / countA)}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs {yearA}</span>
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
                <th className="px-6 py-3 text-xs font-medium text-indigo-600 uppercase tracking-wide text-right">{yearA}</th>
                <th className="px-6 py-3 text-xs font-medium text-green-600 uppercase tracking-wide text-right">{yearB}</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide text-right">Variação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MONTHS_PT.map((month, i) => {
                const a = monthlyA[i]
                const b = monthlyB[i]
                const d = pct(b, a)
                const pos = b >= a
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{month}</td>
                    <td className="px-6 py-3 text-right text-gray-600">
                      {a > 0 ? a.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' }) : '—'}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-900 font-medium">
                      {b > 0 ? b.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' }) : '—'}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {d ? (
                        <span className={`font-medium ${pos ? 'text-green-600' : 'text-red-600'}`}>
                          {d}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold border-t border-gray-200">
                <td className="px-6 py-3 text-gray-900">Total</td>
                <td className="px-6 py-3 text-right text-indigo-700">
                  {totalA.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                </td>
                <td className="px-6 py-3 text-right text-green-700">
                  {totalB.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                </td>
                <td className="px-6 py-3 text-right">
                  {delta && (
                    <span className={deltaPositive ? 'text-green-700' : 'text-red-700'}>
                      {delta}
                    </span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
