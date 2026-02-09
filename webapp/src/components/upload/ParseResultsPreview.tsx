'use client'

/**
 * Parse Results Preview Component
 *
 * Shows a summary of what was parsed from the CSV:
 * - Number of receipts parsed
 * - Errors and warnings
 * - Statistics
 */

import type { ParseResult } from '@/types/receipt'

interface ParseResultsPreviewProps {
  result: ParseResult
  onConfirm: () => void
  onCancel: () => void
}

export function ParseResultsPreview({
  result,
  onConfirm,
  onCancel,
}: ParseResultsPreviewProps) {
  const { receipts, errors, stats } = result
  const hasErrors = errors.length > 0
  const hasWarnings = stats.skippedCancelled > 0 || stats.skippedInvalid > 0

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-semibold mb-4">Pré-visualização da Importação</h3>

      {/* Success Summary */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-medium text-green-900">
              {receipts.length} recibo{receipts.length !== 1 ? 's' : ''} pronto
              {receipts.length !== 1 ? 's' : ''} para importar
            </p>
            <p className="text-sm text-green-700 mt-1">
              Total processado: {stats.totalRows} linha
              {stats.totalRows !== 1 ? 's' : ''} de dados
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Processados com sucesso</p>
          <p className="text-2xl font-semibold text-gray-900">
            {stats.parsedSuccessfully}
          </p>
        </div>

        {stats.skippedCancelled > 0 && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700">Recibos anulados (ignorados)</p>
            <p className="text-2xl font-semibold text-yellow-900">
              {stats.skippedCancelled}
            </p>
          </div>
        )}

        {stats.skippedInvalid > 0 && (
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-700">Com erros (ignorados)</p>
            <p className="text-2xl font-semibold text-orange-900">
              {stats.skippedInvalid}
            </p>
          </div>
        )}
      </div>

      {/* Errors */}
      {hasErrors && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Avisos ({errors.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {errors.slice(0, 5).map((error, index) => (
              <div key={index} className="text-sm text-orange-800">
                <span className="font-medium">Linha {error.line}:</span>{' '}
                {error.message}
                {error.field && error.field !== 'unknown' && (
                  <span className="text-orange-600"> (campo: {error.field})</span>
                )}
              </div>
            ))}
            {errors.length > 5 && (
              <p className="text-sm text-orange-700 italic">
                ... e mais {errors.length - 5} erro{errors.length - 5 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Sample Receipt Preview */}
      {receipts.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">
            Exemplo do primeiro recibo:
          </h4>
          <div className="text-sm space-y-1 text-gray-700">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Referência:</span>
              <span className="font-medium">{receipts[0].referencia}</span>

              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">{receipts[0].nomeAdquirente}</span>

              <span className="text-gray-600">Data:</span>
              <span className="font-medium">
                {receipts[0].dataTransacao.toLocaleDateString('pt-PT')}
              </span>

              <span className="text-gray-600">Valor:</span>
              <span className="font-medium">
                {receipts[0].totalDocumento.toLocaleString('pt-PT', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={receipts.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Importar {receipts.length} Recibo{receipts.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  )
}
