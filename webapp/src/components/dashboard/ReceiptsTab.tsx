'use client'

import { useMemo } from 'react'
import type { Receipt } from '@/hooks/useReceipts'

interface ReceiptsTabProps {
  receipts: Receipt[]
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
}

export function ReceiptsTab({ receipts }: ReceiptsTabProps) {
  const topReceipts = useMemo(() => {
    return [...receipts]
      .sort((a, b) => b.totalDocumento - a.totalDocumento)
      .slice(0, 5)
  }, [receipts])

  const topMonths = useMemo(() => {
    const byMonth: Record<string, { label: string; count: number; total: number }> = {}
    for (const r of receipts) {
      const d = new Date(r.dataTransacao)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!byMonth[key]) {
        byMonth[key] = {
          label: `${MONTHS_PT[d.getMonth()]} ${d.getFullYear()}`,
          count: 0,
          total: 0,
        }
      }
      byMonth[key].count += 1
      byMonth[key].total += r.totalDocumento
    }
    return Object.values(byMonth)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }, [receipts])

  const topClients = useMemo(() => {
    const byClient: Record<string, { name: string; nif: string; count: number; total: number }> = {}
    for (const r of receipts) {
      const nif = r.nifAdquirente
      if (!byClient[nif]) {
        byClient[nif] = { name: r.nomeAdquirente, nif, count: 0, total: 0 }
      }
      byClient[nif].count += 1
      byClient[nif].total += r.totalDocumento
    }
    return Object.values(byClient)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }, [receipts])

  return (
    <div className="space-y-6">
      {/* Top 5 Highest Receipts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Top 5 recibos mais altos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">#</th>
                <th className="pb-3 pr-4 font-medium">Cliente</th>
                <th className="pb-3 pr-4 font-medium">Data</th>
                <th className="pb-3 pr-4 font-medium">Referência</th>
                <th className="pb-3 text-right font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {topReceipts.map((r, i) => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 pr-4 text-gray-400 font-medium">{i + 1}</td>
                  <td className="py-3 pr-4 text-gray-900">{r.nomeAdquirente}</td>
                  <td className="py-3 pr-4 text-gray-600">
                    {new Date(r.dataTransacao).toLocaleDateString('pt-PT')}
                  </td>
                  <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{r.referencia}</td>
                  <td className="py-3 text-right font-semibold text-gray-900">
                    {formatCurrency(r.totalDocumento)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom row: Top Months + Top Clients side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 3 Months by Receipt Count */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Top 3 meses com mais recibos
          </h3>
          <div className="space-y-3">
            {topMonths.map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.label}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(m.total)}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {m.count} {m.count === 1 ? 'recibo' : 'recibos'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 Clients by Receipt Count */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Top 3 clientes com mais recibos
          </h3>
          <div className="space-y-3">
            {topClients.map((c, i) => (
              <div key={c.nif} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(c.total)}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {c.count} {c.count === 1 ? 'recibo' : 'recibos'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
