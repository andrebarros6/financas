"use client";

import { useState } from "react";

type BillingInterval = "monthly" | "annual";

const checkIcon = (
  <svg
    className="h-5 w-5 flex-shrink-0 text-green-500"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export function PricingSection() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  const pricing = {
    monthly: {
      price: "2,99€",
      period: "/mês",
      detail: null as string | null,
    },
    annual: {
      price: "29,90€",
      period: "/ano",
      detail: "2,49€/mês",
    },
  };

  const current = pricing[interval];

  return (
    <section id="precos" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Preços simples e transparentes
          </h2>
          <p className="text-lg text-gray-600">
            Menos que um café por mês. Começa grátis, faz upgrade quando
            precisares.
          </p>

          {/* Monthly/Annual Toggle */}
          <div className="mt-8 inline-flex items-center rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setInterval("monthly")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                interval === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setInterval("annual")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                interval === "annual"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Anual
              <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Poupa 2 meses
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Free Tier */}
          <div className="rounded-xl border border-gray-200 p-8">
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Explorador
            </h3>
            <p className="mb-4 text-gray-600">
              Para começar a perceber os teus números
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">0€</span>
              <span className="text-gray-600">/mês</span>
            </div>
            <ul className="mb-8 space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                {checkIcon}
                1 ano de dados
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                {checkIcon}
                Gráficos mensais e por cliente
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                {checkIcon}
                Visualização de recibos
              </li>
            </ul>
            <div className="rounded-lg bg-gray-100 px-4 py-3 text-center text-sm text-gray-600">
              Disponível em breve
            </div>
          </div>

          {/* Pro Tier */}
          <div className="relative rounded-xl border-2 border-green-600 p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-3 py-1 text-sm font-medium text-white">
              Recomendado
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Pro</h3>
            <p className="mb-4 text-gray-600">
              Para quem leva o negócio a sério
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">
                {current.price}
              </span>
              <span className="text-gray-600">{current.period}</span>
              {current.detail && (
                <p className="mt-1 text-sm font-medium text-green-700">
                  {current.detail} &mdash; Poupa 2 meses
                </p>
              )}
            </div>
            <ul className="mb-8 space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                {checkIcon}
                Anos ilimitados de dados
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                {checkIcon}
                Comparação ano a ano
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                {checkIcon}
                Editar e apagar recibos
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                {checkIcon}
                Exportar PDF e Excel
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                {checkIcon}
                7 dias de teste grátis
              </li>
            </ul>
            <div className="rounded-lg bg-green-100 px-4 py-3 text-center text-sm font-medium text-green-800">
              Disponível em breve
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
