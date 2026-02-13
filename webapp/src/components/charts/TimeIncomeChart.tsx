'use client'

/**
 * Time Income Chart
 *
 * Vertical bar chart showing income by month or year.
 * Supports click-to-select for cross-filtering.
 */

import { useRef } from 'react'
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
import type { TimePeriodData } from '@/lib/dashboard/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface TimeIncomeChartProps {
  data: TimePeriodData[]
  selectedPeriodKey: string | null
  onBarClick?: (periodKey: string | null) => void
}

export function TimeIncomeChart({
  data,
  selectedPeriodKey,
  onBarClick,
}: TimeIncomeChartProps) {
  const chartRef = useRef<any>(null)

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onBarClick || !chartRef.current) return

    const elements = getElementAtEvent(chartRef.current, event)
    if (elements.length > 0) {
      const index = elements[0].index
      const clickedKey = data[index].periodKey
      onBarClick(clickedKey === selectedPeriodKey ? null : clickedKey)
    }
  }

  const backgroundColor = data.map(d =>
    selectedPeriodKey === null
      ? 'rgba(239, 68, 68, 0.8)'
      : d.periodKey === selectedPeriodKey
        ? 'rgba(239, 68, 68, 1)'
        : 'rgba(239, 68, 68, 0.2)'
  )

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Rendimento',
        data: data.map(d => d.total),
        backgroundColor,
        borderColor: 'rgba(239, 68, 68, 1)',
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
            const index = context.dataIndex
            const count = data[index].count
            return [
              `Rendimento: ${value.toLocaleString('pt-PT', {
                style: 'currency',
                currency: 'EUR',
              })}`,
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
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Evolução Temporal</h2>
        <p className="text-sm text-gray-500 mt-1">Rendimento total por período</p>
      </div>
      <div className="h-80">
        <Bar ref={chartRef} data={chartData} options={options} onClick={handleClick} />
      </div>
    </div>
  )
}
