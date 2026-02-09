'use client'

/**
 * Client Income Chart
 *
 * Horizontal bar chart showing total income per client
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

interface ClientIncomeChartProps {
  receipts: Receipt[]
  limit?: number
}

interface ClientData {
  nif: string
  name: string
  total: number
  count: number
}

export function ClientIncomeChart({ receipts, limit = 10 }: ClientIncomeChartProps) {
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

  // Shorten long client names
  const labels = clientData.map(client => {
    const maxLength = 25
    if (client.name.length > maxLength) {
      return client.name.substring(0, maxLength) + '...'
    }
    return client.name
  })

  const data = {
    labels,
    datasets: [
      {
        label: 'Rendimento',
        data: clientData.map(c => c.total),
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
        borderColor: 'rgba(59, 130, 246, 1)',
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
            return [
              `Rendimento: ${value.toLocaleString('pt-PT', {
                style: 'currency',
                currency: 'EUR',
              })}`,
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
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
