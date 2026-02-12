"use client";

import { useState, useMemo } from "react";
import { useReceipts } from "@/hooks/useReceipts";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type SortField = "dataTransacao" | "nomeAdquirente" | "totalDocumento";
type SortDirection = "asc" | "desc";

export default function ReceiptsPage() {
  const { receipts, isLoading, error } = useReceipts();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("dataTransacao");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Filter receipts by search term
  const filteredReceipts = useMemo(() => {
    if (!searchTerm) return receipts;

    const lowerSearch = searchTerm.toLowerCase();
    return receipts.filter(
      (receipt) =>
        receipt.nomeAdquirente.toLowerCase().includes(lowerSearch) ||
        receipt.nifAdquirente.includes(searchTerm) ||
        receipt.referencia.toLowerCase().includes(lowerSearch)
    );
  }, [receipts, searchTerm]);

  // Sort receipts
  const sortedReceipts = useMemo(() => {
    const sorted = [...filteredReceipts].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle dates
      if (sortField === "dataTransacao") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle strings
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredReceipts, sortField, sortDirection]);

  // Paginate receipts
  const paginatedReceipts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedReceipts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedReceipts, currentPage]);

  const totalPages = Math.ceil(sortedReceipts.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-PT").format(new Date(date));
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recibos</h1>
          <p className="text-gray-500 mt-1">
            Lista completa dos seus recibos importados
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button variant="primary">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Importar mais recibos
          </Button>
        </Link>
      </div>

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

      {/* Empty State */}
      {!isLoading && !error && receipts.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Sem recibos importados
          </h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Importe o ficheiro SIRE do Portal das Finanças para começar.
          </p>
          <Link href="/dashboard/upload">
            <Button variant="primary">Importar ficheiro SIRE</Button>
          </Link>
        </div>
      )}

      {/* Receipts Table */}
      {!isLoading && !error && receipts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Search and Summary */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar por cliente, NIF ou referência..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {sortedReceipts.length === receipts.length ? (
                  <span>
                    <strong>{receipts.length}</strong>{" "}
                    {receipts.length === 1 ? "recibo" : "recibos"}
                  </span>
                ) : (
                  <span>
                    <strong>{sortedReceipts.length}</strong> de{" "}
                    <strong>{receipts.length}</strong>{" "}
                    {receipts.length === 1 ? "recibo" : "recibos"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("dataTransacao")}
                  >
                    <div className="flex items-center gap-1">
                      Data
                      {sortField === "dataTransacao" && (
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            sortDirection === "asc" ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referência
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("nomeAdquirente")}
                  >
                    <div className="flex items-center gap-1">
                      Cliente
                      {sortField === "nomeAdquirente" && (
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            sortDirection === "asc" ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIF
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("totalDocumento")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Total
                      {sortField === "totalDocumento" && (
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            sortDirection === "asc" ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedReceipts.map((receipt) => (
                  <tr
                    key={receipt.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(receipt.dataTransacao)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {receipt.referencia}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {receipt.nomeAdquirente}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {receipt.nifAdquirente}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {formatCurrency(receipt.totalDocumento)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
