"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useReceipts } from "@/hooks/useReceipts";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import type { DashboardTab, TimeMode, DateRange, CrossFilter } from "@/lib/dashboard/types";
import {
  getDefaultDateRange,
  clampDateRange,
  filterByDateRange,
  filterByPeriod,
  filterByClient,
  computeSummaryStats,
  getAvailableYears,
} from "@/lib/dashboard/filters";
import { DashboardToolbar } from "@/components/dashboard/DashboardToolbar";
import { SummaryStats } from "@/components/dashboard/SummaryStats";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { PerClientTab } from "@/components/dashboard/PerClientTab";
import { TotalPerClientTab } from "@/components/dashboard/TotalPerClientTab";
import { DetailedTimeTab } from "@/components/dashboard/DetailedTimeTab";
import { ReceiptsTab } from "@/components/dashboard/ReceiptsTab";

function DashboardContent() {
  const { profile, isPro } = useAuth();
  const { receipts, isLoading, error } = useReceipts();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [timeMode, setTimeMode] = useState<TimeMode>("month");
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange);
  const [crossFilter, setCrossFilter] = useState<CrossFilter>({ type: "none" });

  // Reset cross-filter when switching tabs or changing time controls
  useEffect(() => {
    setCrossFilter({ type: "none" });
  }, [activeTab, timeMode, dateRange]);

  useEffect(() => {
    const imported = searchParams.get("imported");
    if (imported) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  // Enforce free-tier date restriction
  const effectiveDateRange = useMemo(() => {
    if (isPro()) return dateRange;
    return clampDateRange(dateRange, 1);
  }, [dateRange, isPro]);

  // Primary filter: date range
  const dateFilteredReceipts = useMemo(
    () => filterByDateRange(receipts, effectiveDateRange),
    [receipts, effectiveDateRange]
  );

  // Apply cross-filter for summary stats
  const fullyFilteredReceipts = useMemo(() => {
    if (crossFilter.type === "time")
      return filterByPeriod(dateFilteredReceipts, crossFilter.periodKey, timeMode);
    if (crossFilter.type === "client")
      return filterByClient(dateFilteredReceipts, crossFilter.nif);
    return dateFilteredReceipts;
  }, [dateFilteredReceipts, crossFilter, timeMode]);

  // Summary stats react to all active filters
  const stats = useMemo(
    () => computeSummaryStats(fullyFilteredReceipts),
    [fullyFilteredReceipts]
  );

  const availableYears = useMemo(() => getAvailableYears(receipts), [receipts]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Visão geral dos seus recibos verdes
          </p>
        </div>
        {!isLoading && !error && receipts.length > 0 && (
          <Link
            href="/dashboard/upload"
            className="inline-flex items-center gap-2 bg-green-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importar mais recibos
          </Link>
        )}
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <svg
            className="w-6 h-6 text-green-600"
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
              Recibos importados com sucesso!
            </p>
            <p className="text-sm text-green-700">
              {searchParams.get("imported")} recibos foram adicionados à sua conta.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">A carregar recibos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-900 font-medium">Erro ao carregar recibos</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Empty State - No receipts yet */}
      {!isLoading && !error && receipts.length === 0 && (
        <>
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
                  Procure &quot;Facturas e Recibos&quot; → &quot;Consultar&quot;
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-gray-900">3.</span>
                  Selecione o período pretendido
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-gray-900">4.</span>
                  Clique em &quot;EXPORTAR TABELA&quot;
                </li>
              </ol>
            </div>

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
        </>
      )}

      {/* Dashboard with data */}
      {!isLoading && !error && receipts.length > 0 && (
        <div className="space-y-6">
          {/* Toolbar: tabs + time controls */}
          <DashboardToolbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            timeMode={timeMode}
            onTimeModeChange={setTimeMode}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            availableYears={availableYears}
            isPro={isPro()}
            receipts={receipts}
          />

          {/* Summary Stats */}
          <SummaryStats
            totalReceipts={stats.totalReceipts}
            totalBilled={stats.totalBilled}
            uniqueClients={stats.uniqueClients}
          />

          {/* Tab Content */}
          {activeTab === "overview" && (
            <OverviewTab
              receipts={dateFilteredReceipts}
              timeMode={timeMode}
              crossFilter={crossFilter}
              onCrossFilterChange={setCrossFilter}
            />
          )}

          {activeTab === "time-detail" && (
            <DetailedTimeTab
              receipts={dateFilteredReceipts}
              timeMode={timeMode}
            />
          )}

          {activeTab === "per-client" && (
            <PerClientTab
              receipts={dateFilteredReceipts}
              timeMode={timeMode}
            />
          )}

          {activeTab === "total-per-client" && (
            <TotalPerClientTab receipts={dateFilteredReceipts} />
          )}

          {activeTab === "receipts" && (
            <ReceiptsTab receipts={dateFilteredReceipts} />
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">A carregar...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
