'use client'

interface SummaryStatsProps {
  totalReceipts: number
  totalBilled: number
  uniqueClients: number
  previousTotalReceipts?: number
  previousTotalBilled?: number
  previousUniqueClients?: number
}

function Delta({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null
  const pct = ((current - previous) / previous) * 100
  const positive = pct >= 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${
        positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}
    >
      {positive ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
    </span>
  )
}

export function SummaryStats({
  totalReceipts,
  totalBilled,
  uniqueClients,
  previousTotalReceipts,
  previousTotalBilled,
  previousUniqueClients,
}: SummaryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-gray-600 mb-1">Total de Recibos</p>
        <p className="text-3xl font-bold text-gray-900">{totalReceipts}</p>
        {previousTotalReceipts !== undefined && (
          <div className="mt-2">
            <Delta current={totalReceipts} previous={previousTotalReceipts} />
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-gray-600 mb-1">Total Faturado</p>
        <p className="text-3xl font-bold text-gray-900">
          {totalBilled.toLocaleString('pt-PT', {
            style: 'currency',
            currency: 'EUR',
          })}
        </p>
        {previousTotalBilled !== undefined && (
          <div className="mt-2">
            <Delta current={totalBilled} previous={previousTotalBilled} />
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-gray-600 mb-1">Clientes Únicos</p>
        <p className="text-3xl font-bold text-gray-900">{uniqueClients}</p>
        {previousUniqueClients !== undefined && (
          <div className="mt-2">
            <Delta current={uniqueClients} previous={previousUniqueClients} />
          </div>
        )}
      </div>
    </div>
  )
}
