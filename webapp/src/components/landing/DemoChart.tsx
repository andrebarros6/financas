"use client";

/**
 * Simple SVG-based demo chart for the landing page
 * Shows a mockup of monthly income data
 */

const DEMO_DATA = [
  { month: "Jan", value: 2400 },
  { month: "Fev", value: 1800 },
  { month: "Mar", value: 3200 },
  { month: "Abr", value: 2800 },
  { month: "Mai", value: 3600 },
  { month: "Jun", value: 2100 },
  { month: "Jul", value: 3800 },
  { month: "Ago", value: 1500 },
  { month: "Set", value: 4200 },
  { month: "Out", value: 3400 },
  { month: "Nov", value: 2900 },
  { month: "Dez", value: 4800 },
];

const maxValue = Math.max(...DEMO_DATA.map((d) => d.value));

interface DemoChartProps {
  className?: string;
}

export function DemoChart({ className = "" }: DemoChartProps) {
  return (
    <div
      className={`rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-100 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Rendimento Mensal
        </h3>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
          2025
        </span>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Bars container */}
        <div className="flex h-48 items-end justify-between gap-2">
          {DEMO_DATA.map((item) => {
            const heightPercent = (item.value / maxValue) * 100;
            return (
              <div
                key={item.month}
                className="group relative flex flex-1 flex-col items-center"
                style={{ height: "100%" }}
              >
                {/* Bar wrapper - takes remaining height */}
                <div className="flex flex-1 w-full items-end">
                  {/* Tooltip */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 z-10">
                    <span className="rounded bg-gray-900 px-2 py-1 text-xs text-white whitespace-nowrap">
                      {item.value.toLocaleString("pt-PT")}€
                    </span>
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-green-600 to-green-400 transition-all hover:from-green-700 hover:to-green-500"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* Labels row */}
        <div className="flex justify-between gap-2 mt-2">
          {DEMO_DATA.map((item) => (
            <div key={`label-${item.month}`} className="flex-1 text-center">
              <span className="text-xs text-gray-500">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-sm text-gray-500">Total Anual</p>
          <p className="text-xl font-bold text-gray-900">
            {DEMO_DATA.reduce((sum, d) => sum + d.value, 0).toLocaleString(
              "pt-PT"
            )}
            €
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Média Mensal</p>
          <p className="text-xl font-bold text-gray-900">
            {Math.round(
              DEMO_DATA.reduce((sum, d) => sum + d.value, 0) / 12
            ).toLocaleString("pt-PT")}
            €
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Melhor Mês</p>
          <p className="text-xl font-bold text-green-600">Dez</p>
        </div>
      </div>
    </div>
  );
}
