"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { profile, isPro } = useAuth();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Visão geral dos seus recibos verdes
        </p>
      </div>

      {/* Empty State - No receipts yet */}
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Sem recibos importados
        </h2>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          Importe o ficheiro SIRE do Portal das Finanças para começar a visualizar os seus dados.
        </p>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 bg-green-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Importar ficheiro SIRE
        </Link>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* How to get SIRE file */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Como obter o ficheiro SIRE?
          </h3>
          <ol className="text-sm text-gray-600 space-y-2">
            <li className="flex gap-2">
              <span className="font-medium text-gray-900">1.</span>
              Aceda ao Portal das Finanças
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-gray-900">2.</span>
              Vá a Cidadãos → Atividade → Faturas e Recibos
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-gray-900">3.</span>
              Selecione &quot;Recibos Verdes Emitidos&quot;
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-gray-900">4.</span>
              Exporte para CSV (ficheiro SIRE)
            </li>
          </ol>
        </div>

        {/* Subscription Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            O seu plano
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Plano atual:{" "}
                <span className="font-medium text-gray-900">
                  {isPro() ? "Pro" : "Gratuito"}
                </span>
              </p>
              {!isPro() && (
                <p className="text-sm text-gray-500 mt-1">
                  Limitado a 1 ano de dados
                </p>
              )}
            </div>
            {!isPro() && (
              <Link
                href="/dashboard/settings"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Fazer upgrade
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
