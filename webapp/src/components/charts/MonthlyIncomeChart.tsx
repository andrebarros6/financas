'use client'

/**
 * Monthly Income Chart
 *
 * Bar chart showing total income per month
 */

import { useMemo } from 'react'
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
import { Bar } from 'react-chartjs-2'
import type { Receipt } from '@/hooks/useReceipts'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface MonthlyIncomeChartProps {
  receipts: Receipt[]
}

interface MonthlyData {
  month: string
  total: number
  count: number
}

export function MonthlyIncomeChart({ receipts }: MonthlyIncomeChartProps) {
  const monthlyData = useMemo(() => {
    // Group receipts by month
    const dataByMonth = receipts.reduce<Record<string, MonthlyData>>((acc, receipt) => {
      const date = new Date(receipt.dataTransacao)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          total: 0,
          count: 0,
        }
      }

      acc[monthKey].total += receipt.totalDocumento
      acc[monthKey].count += 1

      return acc
    }, {})

    // Convert to array and sort by month
    return Object.values(dataByMonth).sort((a, b) => a.month.localeCompare(b.month))
  }, [receipts])

  // Format month labels (e.g., "Jan 2024")
  const labels = monthlyData.map(data => {
    const [year, month] = data.month.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' })
  })

  const data = {
    labels,
    datasets: [
      {
        label: 'Rendimento',
        data: monthlyData.map(d => d.total),
        backgroundColor: 'rgba(34, 197, 94, 0.8)', // green-500
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
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
          label: function (context) {
            const value = context.parsed.y ?? 0
            const index = context.dataIndex
            const count = monthlyData[index].count
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
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Evolução Mensal</h2>
        <p className="text-sm text-gray-500 mt-1">Rendimento total por mês</p>
      </div>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
