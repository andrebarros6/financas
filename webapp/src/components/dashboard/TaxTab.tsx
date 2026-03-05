'use client'

import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import type { Receipt } from '@/hooks/useReceipts'
import type { TimeMode } from '@/lib/dashboard/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

interface TaxTabProps {
  receipts: Receipt[]
  timeMode: TimeMode
}

const fmt = (v: number) =>
  v.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })

const fmtPct = (v: number) => `${v.toFixed(1)}%`

export function TaxTab({ receipts, timeMode }: TaxTabProps) {
  // ── Aggregate totals ────────────────────────────────────────────────────────
  const totals = useMemo(() => {
    let totalBruto = 0
    let totalIrs = 0
    let totalIva = 0
    let totalSelo = 0
    let totalLiquido = 0

    for (const r of receipts) {
      totalBruto += r.valorTributavel
      totalIrs += r.valorIrs
      totalIva += r.valorIva
      totalSelo += r.valorImpostoSelo
      totalLiquido += r.totalDocumento
    }

    const irsRate = totalBruto > 0 ? (totalIrs / totalBruto) * 100 : 0

    return { totalBruto, totalIrs, totalIva, totalSelo, totalLiquido, irsRate }
  }, [receipts])

  // ── IRS over time ───────────────────────────────────────────────────────────
  const timeData = useMemo(() => {
    const map = new Map<string, { label: string; irs: number; liquido: number; bruto: number }>()

    for (const r of receipts) {
      const date = new Date(r.dataTransacao)
      const key =
        timeMode === 'month'
          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          : `${date.getFullYear()}`

      const label =
        timeMode === 'month'
          ? date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' })
          : `${date.getFullYear()}`

      if (!map.has(key)) map.set(key, { label, irs: 0, liquido: 0, bruto: 0 })
      const entry = map.get(key)!
      entry.irs += r.valorIrs
      entry.liquido += r.totalDocumento
      entry.bruto += r.valorTributavel
    }

    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v)
  }, [receipts, timeMode])

  // ── IRS by client ──────────────────────────────────────────────────────────
  const clientData = useMemo(() => {
    const map = new Map<string, { name: string; irs: number; bruto: number }>()

    for (const r of receipts) {
      if (!map.has(r.nifAdquirente)) {
        map.set(r.nifAdquirente, { name: r.nomeAdquirente, irs: 0, bruto: 0 })
      }
      const entry = map.get(r.nifAdquirente)!
      entry.irs += r.valorIrs
      entry.bruto += r.valorTributavel
    }

    return [...map.values()]
      .sort((a, b) => b.irs - a.irs)
      .slice(0, 10)
  }, [receipts])

  // ── Chart: IRS over time ────────────────────────────────────────────────────
  const irsTimeChartData = {
    labels: timeData.map(d => d.label),
    datasets: [
      {
        label: 'IRS Retido',
        data: timeData.map(d => d.irs),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const irsTimeOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `IRS: ${fmt(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: v => `${Number(v).toLocaleString('pt-PT')}€` },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: { grid: { display: false } },
    },
  }

  // ── Chart: bruto vs IRS stacked ─────────────────────────────────────────────
  const stackedChartData = {
    labels: timeData.map(d => d.label),
    datasets: [
      {
        label: 'Recebido (líquido)',
        data: timeData.map(d => d.liquido),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderRadius: 4,
        stack: 'stack',
      },
      {
        label: 'IRS Retido',
        data: timeData.map(d => d.irs),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderRadius: 4,
        stack: 'stack',
      },
    ],
  }

  const stackedOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12 } },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${fmt(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        ticks: { callback: v => `${Number(v).toLocaleString('pt-PT')}€` },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: { stacked: true, grid: { display: false } },
    },
  }

  // ── Chart: doughnut tax composition ────────────────────────────────────────
  const hasTaxes = totals.totalIrs > 0 || totals.totalIva > 0 || totals.totalSelo > 0
  const doughnutData = {
    labels: ['Recebido (líquido)', 'IRS', 'IVA', 'Imposto de Selo'],
    datasets: [
      {
        data: [totals.totalLiquido, totals.totalIrs, totals.totalIva, totals.totalSelo],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12 } },
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed
            const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0)
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
            return `${ctx.label}: ${fmt(value)} (${pct}%)`
          },
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Valor Bruto</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{fmt(totals.totalBruto)}</p>
          <p className="mt-1 text-xs text-gray-400">Base tributável total</p>
        </div>

        <div className="bg-white rounded-xl border border-red-100 p-5">
          <p className="text-xs font-medium text-red-500 uppercase tracking-wide">IRS Retido</p>
          <p className="mt-2 text-2xl font-bold text-red-600">{fmt(totals.totalIrs)}</p>
          <p className="mt-1 text-xs text-gray-400">Taxa efetiva: {fmtPct(totals.irsRate)}</p>
        </div>

        <div className="bg-white rounded-xl border border-blue-100 p-5">
          <p className="text-xs font-medium text-blue-500 uppercase tracking-wide">IVA</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">{fmt(totals.totalIva)}</p>
          <p className="mt-1 text-xs text-gray-400">Imposto sobre valor acrescentado</p>
        </div>

        <div className="bg-white rounded-xl border border-green-100 p-5">
          <p className="text-xs font-medium text-green-500 uppercase tracking-wide">Valor Líquido</p>
          <p className="mt-2 text-2xl font-bold text-green-600">{fmt(totals.totalLiquido)}</p>
          <p className="mt-1 text-xs text-gray-400">Após retenções</p>
        </div>
      </div>

      {/* Charts row 1: IRS over time + stacked */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-1">IRS Retido por Período</h3>
          <p className="text-xs text-gray-500 mb-4">Retenções na fonte ao longo do tempo</p>
          <div className="h-64">
            <Bar data={irsTimeChartData} options={irsTimeOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Bruto vs. Líquido</h3>
          <p className="text-xs text-gray-500 mb-4">Decomposição do rendimento por período</p>
          <div className="h-64">
            <Bar data={stackedChartData} options={stackedOptions} />
          </div>
        </div>
      </div>

      {/* Charts row 2: doughnut + client table */}
      <div className="grid md:grid-cols-2 gap-6">
        {hasTaxes ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Composição Fiscal</h3>
            <p className="text-xs text-gray-500 mb-4">Distribuição total do valor faturado</p>
            <div className="h-64">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center">
            <p className="text-sm text-gray-400">Sem IVA ou Imposto de Selo no período selecionado.</p>
          </div>
        )}

        {/* IRS by client */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-1">IRS por Cliente</h3>
          <p className="text-xs text-gray-500 mb-4">Top 10 clientes por retenção</p>
          <div className="space-y-2">
            {clientData.map((c, i) => {
              const pct = totals.totalIrs > 0 ? (c.irs / totals.totalIrs) * 100 : 0
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-0.5">
                    <span className="text-gray-700 truncate max-w-[55%]" title={c.name}>
                      {c.name}
                    </span>
                    <div className="text-right">
                      <span className="font-medium text-red-600">{fmt(c.irs)}</span>
                      <span className="text-xs text-gray-400 ml-2">{fmtPct(pct)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {clientData.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Sem dados no período selecionado.</p>
            )}
          </div>
        </div>
      </div>

      {/* Effective IRS rate table by period */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Taxa de IRS por Período</h3>
        <p className="text-xs text-gray-500 mb-4">Retenção efetiva calculada sobre o valor tributável</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-2 text-left font-medium text-gray-500">Período</th>
                <th className="py-2 text-right font-medium text-gray-500">Bruto</th>
                <th className="py-2 text-right font-medium text-gray-500">IRS</th>
                <th className="py-2 text-right font-medium text-gray-500">Líquido</th>
                <th className="py-2 text-right font-medium text-gray-500">Taxa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {timeData.map((d, i) => {
                const rate = d.bruto > 0 ? (d.irs / d.bruto) * 100 : 0
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2 text-gray-700">{d.label}</td>
                    <td className="py-2 text-right text-gray-900">{fmt(d.bruto)}</td>
                    <td className="py-2 text-right text-red-600 font-medium">{fmt(d.irs)}</td>
                    <td className="py-2 text-right text-green-600 font-medium">{fmt(d.liquido)}</td>
                    <td className="py-2 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                        {fmtPct(rate)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="border-t-2 border-gray-200">
              <tr className="font-semibold">
                <td className="py-2 text-gray-900">Total</td>
                <td className="py-2 text-right text-gray-900">{fmt(totals.totalBruto)}</td>
                <td className="py-2 text-right text-red-600">{fmt(totals.totalIrs)}</td>
                <td className="py-2 text-right text-green-600">{fmt(totals.totalLiquido)}</td>
                <td className="py-2 text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    {fmtPct(totals.irsRate)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
