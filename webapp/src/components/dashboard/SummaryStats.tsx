'use client'

interface SummaryStatsProps {
  totalReceipts: number
  totalBilled: number
  uniqueClients: number
}

export function SummaryStats({ totalReceipts, totalBilled, uniqueClients }: SummaryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-gray-600 mb-1">Total de Recibos</p>
        <p className="text-3xl font-bold text-gray-900">{totalReceipts}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-gray-600 mb-1">Total Faturado</p>
        <p className="text-3xl font-bold text-gray-900">
          {totalBilled.toLocaleString('pt-PT', {
            style: 'currency',
            currency: 'EUR',
          })}
        </p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-gray-600 mb-1">Clientes Únicos</p>
        <p className="text-3xl font-bold text-gray-900">{uniqueClients}</p>
      </div>
    </div>
  )
}
