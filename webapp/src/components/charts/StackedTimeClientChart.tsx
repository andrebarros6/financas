'use client'

/**
 * Stacked Time Client Chart
 *
 * Vertical stacked bar chart where each bar represents a time period (month/year)
 * and is divided into colored segments per client.
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
import type { StackedClientTimePeriod } from '@/lib/dashboard/types'
import { getClientColor } from '@/lib/dashboard/colors'
import type { Receipt } from '@/hooks/useReceipts'
import { aggregateByClient } from '@/lib/dashboard/filters'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface StackedTimeClientChartProps {
  data: StackedClientTimePeriod[]
  receipts: Receipt[]
  selectedNifs?: Set<string> | null
  showLegend?: boolean
  selectedPeriodKey?: string | null
  onPeriodClick?: (periodKey: string | null) => void
}

export function StackedTimeClientChart({
  data,
  receipts,
  selectedNifs,
  showLegend = true,
  selectedPeriodKey,
  onPeriodClick,
}: StackedTimeClientChartProps) {
  const chartRef = useRef<any>(null)
  // Get unique clients sorted by total revenue (most revenue = first dataset / bottom of stack)
  const sortedClients = useMemo(() => {
    return aggregateByClient(receipts)
  }, [receipts])

  const clientNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const client of sortedClients) {
      map[client.nif] = client.name
    }
    return map
  }, [sortedClients])

  const visibleClients = useMemo(() => {
    if (!selectedNifs) return sortedClients
    return sortedClients.filter(c => selectedNifs.has(c.nif))
  }, [sortedClients, selectedNifs])

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPeriodClick || !chartRef.current) return
    const elements = getElementAtEvent(chartRef.current, event)
    if (elements.length > 0) {
      const index = elements[0].index
      const clickedKey = data[index].periodKey
      onPeriodClick(clickedKey === selectedPeriodKey ? null : clickedKey)
    }
  }

  const datasets = visibleClients.map((client) => {
    // Use the original index for consistent colors
    const originalIndex = sortedClients.findIndex(c => c.nif === client.nif)
    const baseColor = getClientColor(originalIndex)
    return {
      label: client.name.length > 20 ? client.name.substring(0, 20) + '...' : client.name,
      data: data.map(period => period.clients[client.nif] || 0),
      backgroundColor: selectedPeriodKey == null
        ? baseColor
        : data.map(period =>
            period.periodKey === selectedPeriodKey
              ? baseColor
              : baseColor.replace(/[\d.]+\)$/, '0.2)')
          ),
      borderRadius: 2,
    }
  })

  const chartData = {
    labels: data.map(d => d.label),
    datasets,
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `${value.toLocaleString('pt-PT')}€`
          },
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 12,
          padding: 16,
          font: { size: 11 },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y ?? 0
            if (value === 0) return ''
            const datasetIndex = context.datasetIndex
            const nif = visibleClients[datasetIndex]?.nif
            const fullName = nif ? clientNameMap[nif] : context.dataset.label
            return `${fullName}: ${value.toLocaleString('pt-PT', {
              style: 'currency',
              currency: 'EUR',
            })}`
          },
        },
        filter: function (tooltipItem) {
          return (tooltipItem.parsed.y ?? 0) > 0
        },
      },
    },
    onHover: onPeriodClick
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
        <h2 className="text-lg font-semibold text-gray-900">
          Rendimento por Cliente ao Longo do Tempo
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Contribuição de cada cliente por período
        </p>
      </div>
      <div className="h-96">
        <Bar key={selectedPeriodKey ?? 'all'} ref={chartRef} data={chartData} options={options} onClick={handleClick} />
      </div>
    </div>
  )
}
