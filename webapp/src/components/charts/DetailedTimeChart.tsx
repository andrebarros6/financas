'use client'

/**
 * Detailed Time Chart
 *
 * Vertical bar chart showing income by month/year with optional
 * average line and linear trendline overlays.
 */

import { useMemo, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import type { TimePeriodData } from '@/lib/dashboard/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface DetailedTimeChartProps {
  data: TimePeriodData[]
}

/** Compute simple linear regression: y = slope * x + intercept */
function linearRegression(values: number[]): { slope: number; intercept: number } {
  const n = values.length
  if (n < 2) return { slope: 0, intercept: values[0] ?? 0 }

  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0

  for (let i = 0; i < n; i++) {
    sumX += i
    sumY += values[i]
    sumXY += i * values[i]
    sumX2 += i * i
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  return { slope, intercept }
}

export function DetailedTimeChart({ data }: DetailedTimeChartProps) {
  const [showAverage, setShowAverage] = useState(false)
  const [showTrendline, setShowTrendline] = useState(false)

  const totals = useMemo(() => data.map(d => d.total), [data])

  const average = useMemo(() => {
    if (totals.length === 0) return 0
    return totals.reduce((sum, v) => sum + v, 0) / totals.length
  }, [totals])

  const trendlineValues = useMemo(() => {
    if (totals.length < 2) return totals
    const { slope, intercept } = linearRegression(totals)
    return totals.map((_, i) => slope * i + intercept)
  }, [totals])

  const maxIndex = useMemo(() => {
    if (totals.length === 0) return -1
    return totals.indexOf(Math.max(...totals))
  }, [totals])

  const minIndex = useMemo(() => {
    if (totals.length === 0) return -1
    return totals.indexOf(Math.min(...totals))
  }, [totals])

  // Use refs so the plugin callback always reads current values
  const overlayRef = useRef({ showAverage, average, showTrendline, trendlineValues })
  overlayRef.current = { showAverage, average, showTrendline, trendlineValues }

  // Stable plugin reference — reads from ref so Chart.js always gets current state
  const overlayPlugin = useRef<Plugin<'bar'>>({
    id: 'overlayLines',
    afterDatasetsDraw(chart) {
      const { showAverage: avg, average: avgVal, showTrendline: trend, trendlineValues: trendVals } = overlayRef.current
      const { ctx, scales: { x, y } } = chart
      const meta = chart.getDatasetMeta(0)
      if (!meta || meta.data.length === 0) return

      if (avg) {
        const yPixel = y.getPixelForValue(avgVal)
        const firstX = meta.data[0]?.x
        const lastX = meta.data[meta.data.length - 1]?.x
        if (firstX != null && lastX != null) {
          ctx.save()
          ctx.strokeStyle = 'rgba(234, 179, 8, 1)'
          ctx.lineWidth = 2
          ctx.setLineDash([6, 4])
          ctx.beginPath()
          ctx.moveTo(firstX, yPixel)
          ctx.lineTo(lastX, yPixel)
          ctx.stroke()
          ctx.restore()
        }
      }

      if (trend && trendVals.length >= 2) {
        ctx.save()
        ctx.strokeStyle = 'rgba(239, 68, 68, 1)'
        ctx.lineWidth = 2
        ctx.setLineDash([8, 4])
        ctx.beginPath()
        for (let i = 0; i < trendVals.length; i++) {
          const xPixel = meta.data[i]?.x
          const yPixel = y.getPixelForValue(trendVals[i])
          if (xPixel == null) continue
          if (i === 0) ctx.moveTo(xPixel, yPixel)
          else ctx.lineTo(xPixel, yPixel)
        }
        ctx.stroke()
        ctx.restore()
      }
    },
  }).current

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Rendimento',
        data: totals,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y ?? 0
            const formatted = value.toLocaleString('pt-PT', {
              style: 'currency',
              currency: 'EUR',
            })
            const index = context.dataIndex
            const count = data[index]?.count ?? 0
            return [
              `Rendimento: ${formatted}`,
              `Recibos: ${count}`,
            ]
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `${value.toLocaleString('pt-PT')}€`
          },
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      x: {
        grid: { display: false },
      },
    },
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Detalhe Temporal
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Rendimento por período com média e tendência
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showAverage}
              onChange={e => setShowAverage(e.target.checked)}
              className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-yellow-500 inline-block" style={{ borderTop: '2px dashed' }} />
              Média
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showTrendline}
              onChange={e => setShowTrendline(e.target.checked)}
              className="rounded border-gray-300 text-red-500 focus:ring-red-500"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-red-500 inline-block" style={{ borderTop: '2px dashed' }} />
              Tendência
            </span>
          </label>
        </div>
      </div>
      <div className="h-96">
        <Bar data={chartData} options={options} plugins={[overlayPlugin]} />
      </div>
      {/* Stats summary */}
      {data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Média</p>
            <p className="font-semibold text-gray-900">
              {average.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Máximo</p>
            <p className="font-semibold text-gray-900">
              {Math.max(...totals).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
            </p>
            {maxIndex >= 0 && (
              <p className="text-xs text-gray-400">{data[maxIndex].label}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Mínimo</p>
            <p className="font-semibold text-gray-900">
              {Math.min(...totals).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
            </p>
            {minIndex >= 0 && (
              <p className="text-xs text-gray-400">{data[minIndex].label}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Períodos</p>
            <p className="font-semibold text-gray-900">{data.length}</p>
          </div>
        </div>
      )}
    </div>
  )
}
