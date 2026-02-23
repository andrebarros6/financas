'use client'

/**
 * Client Income Chart
 *
 * Horizontal bar chart showing total income per client.
 * Supports optional click-to-select for cross-filtering.
 */

import { useMemo, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'
import { Bar, getElementAtEvent } from 'react-chartjs-2'
import type { Receipt } from '@/hooks/useReceipts'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ClientIncomeChartProps {
  receipts: Receipt[]
  limit?: number
  onBarClick?: (nif: string | null, name: string) => void
  selectedNif?: string | null
  showStats?: boolean
}

interface ClientData {
  nif: string
  name: string
  total: number
  count: number
}

export function ClientIncomeChart({
  receipts,
  limit = 10,
  onBarClick,
  selectedNif,
  showStats = false,
}: ClientIncomeChartProps) {
  const chartRef = useRef<any>(null)

  const grandTotal = useMemo(
    () => receipts.reduce((s, r) => s + r.totalDocumento, 0),
    [receipts]
  )

  const clientData = useMemo(() => {
    // Group receipts by client
    const dataByClient = receipts.reduce<Record<string, ClientData>>((acc, receipt) => {
      const nif = receipt.nifAdquirente

      if (!acc[nif]) {
        acc[nif] = {
          nif,
          name: receipt.nomeAdquirente,
          total: 0,
          count: 0,
        }
      }

      acc[nif].total += receipt.totalDocumento
      acc[nif].count += 1

      return acc
    }, {})

    // Convert to array, sort by total (descending), and limit
    return Object.values(dataByClient)
      .sort((a, b) => b.total - a.total)
      .slice(0, limit)
  }, [receipts, limit])

  const clientStats = useMemo(() => {
    if (!showStats || clientData.length === 0) return null
    const totals = clientData.map(c => c.total)
    const avg = totals.reduce((s, v) => s + v, 0) / totals.length
    const maxIdx = totals.indexOf(Math.max(...totals))
    const minIdx = totals.indexOf(Math.min(...totals))
    return { average: avg, maxIndex: maxIdx, minIndex: minIdx }
  }, [showStats, clientData])

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onBarClick || !chartRef.current) return

    const elements = getElementAtEvent(chartRef.current, event)
    if (elements.length > 0) {
      const index = elements[0].index
      const clicked = clientData[index]
      onBarClick(
        clicked.nif === selectedNif ? null : clicked.nif,
        clicked.name
      )
    }
  }

  // Shorten long client names
  const labels = clientData.map(client => {
    const maxLength = 25
    if (client.name.length > maxLength) {
      return client.name.substring(0, maxLength) + '...'
    }
    return client.name
  })

  const backgroundColor = clientData.map(c =>
    selectedNif == null
      ? 'rgba(234, 179, 8, 0.8)'
      : c.nif === selectedNif
        ? 'rgba(234, 179, 8, 1)'
        : 'rgba(234, 179, 8, 0.2)'
  )

  const data = {
    labels,
    datasets: [
      {
        label: 'Rendimento',
        data: clientData.map(c => c.total),
        backgroundColor,
        borderColor: 'rgba(234, 179, 8, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const, // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const index = context[0].dataIndex
            return clientData[index].name // Show full name in tooltip
          },
          label: function (context) {
            const value = context.parsed.x ?? 0
            const index = context.dataIndex
            const count = clientData[index].count
            const share = grandTotal > 0 ? (value / grandTotal) * 100 : 0
            return [
              `Rendimento: ${value.toLocaleString('pt-PT', {
                style: 'currency',
                currency: 'EUR',
              })}`,
              `Quota: ${share.toFixed(1)}% do total`,
              `Recibos: ${count}`,
              `NIF: ${clientData[index].nif}`,
            ]
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `${value.toLocaleString('pt-PT')}€`
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    onHover: onBarClick
      ? (event, elements) => {
          const canvas = event.native?.target as HTMLCanvasElement | undefined
          if (canvas) {
            canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default'
          }
        }
      : undefined,
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Rendimento por Cliente</h2>
        <p className="text-sm text-gray-500 mt-1">
          Top {Math.min(limit, clientData.length)} clientes por faturação
        </p>
      </div>
      <div className="h-96">
        <Bar ref={chartRef} data={data} options={options} onClick={handleClick} />
      </div>
      {clientStats && (
        <>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Média</p>
              <p className="font-semibold text-gray-900">
                {clientStats.average.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Máximo</p>
              <p className="font-semibold text-gray-900">
                {clientData[clientStats.maxIndex].total.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-xs text-gray-400">{clientData[clientStats.maxIndex].name}</p>
            </div>
            <div>
              <p className="text-gray-500">Mínimo</p>
              <p className="font-semibold text-gray-900">
                {clientData[clientStats.minIndex].total.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="text-xs text-gray-400">{clientData[clientStats.minIndex].name}</p>
            </div>
            <div>
              <p className="text-gray-500">Clientes</p>
              <p className="font-semibold text-gray-900">{clientData.length}</p>
            </div>
          </div>

          {/* Per-client share table */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="pb-2 font-medium">Cliente</th>
                  <th className="pb-2 font-medium text-right">Faturado</th>
                  <th className="pb-2 font-medium text-right">Quota</th>
                  <th className="pb-2 font-medium text-right pr-1">Recibos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clientData.map((c) => {
                  const share = grandTotal > 0 ? (c.total / grandTotal) * 100 : 0
                  return (
                    <tr key={c.nif} className="hover:bg-gray-50">
                      <td className="py-2 text-gray-800 max-w-[200px] truncate" title={c.name}>{c.name}</td>
                      <td className="py-2 text-right text-gray-900 font-medium">
                        {c.total.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5 hidden sm:block">
                            <div
                              className="bg-yellow-400 h-1.5 rounded-full"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                          <span className="text-gray-700 font-medium w-12 text-right">{share.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-2 text-right text-gray-500 pr-1">{c.count}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
