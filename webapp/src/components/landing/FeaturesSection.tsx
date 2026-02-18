"use client";

import { useState } from "react";

const features = [
  {
    key: "upload",
    title: "Importação automática",
    description:
      "Arrasta o ficheiro CSV do Portal das Finanças e nós processamos tudo. Sem configurações, sem mapeamento manual.",
    mockup: "upload",
  },
  {
    key: "overview",
    title: "Visão geral interativa",
    description:
      "Gráficos de rendimento por mês e por cliente, lado a lado. Clica num mês para filtrar por cliente — e vice-versa.",
    mockup: "overview",
  },
  {
    key: "time-detail",
    title: "Detalhe temporal",
    description:
      "Evolução do teu rendimento com linhas de média e tendência. Identifica sazonalidade e crescimento num relance.",
    mockup: "time-detail",
  },
  {
    key: "clients",
    title: "Análise por cliente",
    description:
      "Ranking dos teus melhores clientes com totais acumulados. Sabe exatamente onde investir o teu tempo.",
    mockup: "clients",
  },
  {
    key: "stacked",
    title: "Período x Cliente",
    description:
      "Gráfico empilhado que mostra a contribuição de cada cliente por mês. Filtra por cliente para isolar a evolução.",
    mockup: "stacked",
  },
];

function UploadMockup() {
  return (
    <div>
      <div className="rounded-xl border-2 border-dashed border-green-300 bg-green-50 p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="text-base font-medium text-gray-700">Arrasta o teu ficheiro CSV aqui</p>
        <p className="mt-1 text-sm text-gray-400">ou clica para selecionar do computador</p>
        <span className="mt-4 inline-block rounded-lg border border-gray-200 bg-white px-4 py-1.5 font-mono text-sm text-gray-500">
          recibos_verdes_2025.csv
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-gray-400">Recibos</p>
          <p className="text-2xl font-bold text-gray-800">47</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-gray-400">Clientes</p>
          <p className="text-2xl font-bold text-gray-800">8</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-gray-400">Total</p>
          <p className="text-2xl font-bold text-green-600">€28.450</p>
        </div>
      </div>
    </div>
  );
}

function OverviewMockup() {
  const months = [
    { label: "Jan", h: 38 }, { label: "Fev", h: 32 }, { label: "Mar", h: 52 },
    { label: "Abr", h: 45 }, { label: "Mai", h: 60 }, { label: "Jun", h: 40 },
    { label: "Jul", h: 28 }, { label: "Ago", h: 20 }, { label: "Set", h: 58 },
    { label: "Out", h: 68 }, { label: "Nov", h: 78 }, { label: "Dez", h: 90 },
  ];
  const clients = [
    { name: "TechNova Lda", w: 100, val: "€6.800" },
    { name: "Agência Digital Porto", w: 75, val: "€5.100" },
    { name: "StartUp Inovação SA", w: 50, val: "€3.400" },
    { name: "Consultoria Silva", w: 30, val: "€2.050" },
    { name: "Estúdio Criativo", w: 18, val: "€1.200" },
  ];
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Evolução Temporal</span>
          <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">2025</span>
        </div>
        <div className="flex items-end gap-1" style={{ height: 160 }}>
          {months.map((m) => (
            <div key={m.label} className="flex flex-1 flex-col items-center justify-end" style={{ height: "100%" }}>
              <div className="w-full rounded-t bg-green-400 hover:bg-green-500 transition-colors" style={{ height: `${m.h}%` }} />
              <span className="mt-1.5 text-[9px] text-gray-400">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3">
          <span className="text-sm font-semibold text-gray-700">Por Cliente</span>
        </div>
        <div className="flex flex-col gap-3">
          {clients.map((c) => (
            <div key={c.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 truncate max-w-[120px]">{c.name}</span>
                <span className="text-xs font-medium text-gray-600">{c.val}</span>
              </div>
              <div className="h-3 w-full rounded bg-gray-100">
                <div className={`h-full rounded ${c.w === 100 ? "bg-green-600" : "bg-green-400"}`} style={{ width: `${c.w}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimeDetailMockup() {
  const bars = [38, 32, 52, 45, 60, 40, 28, 20, 58, 68, 78, 90];
  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const avg = 50;
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-xs font-semibold text-gray-700">Detalhe Temporal</span>
        <div className="flex gap-3">
          <span className="flex items-center gap-1 text-[10px] text-yellow-600">
            <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-yellow-400" /> Média
          </span>
          <span className="flex items-center gap-1 text-[10px] text-red-500">
            <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-red-400" /> Tendência
          </span>
        </div>
      </div>
      <div className="relative px-4" style={{ height: 180 }}>
        <div className="relative flex items-end gap-1 h-full">
          {/* Average line */}
          <div className="pointer-events-none absolute left-0 right-0 border-t-2 border-dashed border-yellow-400/60" style={{ bottom: `${avg}%` }} />
          {/* Trend line — rotated div, same technique as the average line */}
          <div className="pointer-events-none absolute left-0 right-0 border-t-2 border-dashed border-red-400/60" style={{ bottom: `${avg}%`, transform: "rotate(-2deg)", transformOrigin: "left center" }} />
          {bars.map((h, i) => (
            <div key={labels[i]} className="flex flex-1 flex-col items-center justify-end" style={{ height: "100%" }}>
              <div className="w-full rounded-t bg-green-400" style={{ height: `${h}%` }} />
              <span className="mt-1 text-[9px] text-gray-400">{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 p-4 pt-3">
        {[
          { l: "Média", v: "2.870€" },
          { l: "Máximo", v: "Dez" },
          { l: "Mínimo", v: "Ago" },
          { l: "Períodos", v: "12" },
        ].map((s) => (
          <div key={s.l} className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-2 text-center">
            <p className="text-[10px] text-gray-400">{s.l}</p>
            <p className="text-sm font-semibold text-gray-700">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientsMockup() {
  const clients = [
    { name: "TechNova Lda", val: "€12.400", w: 100 },
    { name: "Agência Digital Porto", val: "€9.800", w: 79 },
    { name: "Consultoria Silva & Filhos", val: "€7.200", w: 58 },
    { name: "StartUp Inovação SA", val: "€6.100", w: 49 },
    { name: "Estúdio Criativo Lisboa", val: "€4.800", w: 39 },
    { name: "Globalweb Solutions", val: "€3.500", w: 28 },
    { name: "Marketing Atlântico Lda", val: "€2.900", w: 23 },
    { name: "Formação Avançada PT", val: "€1.600", w: 13 },
  ];
  return (
    <div>
      <div className="mb-4">
        <span className="text-sm font-semibold text-gray-700">Detalhe Clientes — Top 8</span>
      </div>
      <div className="flex flex-col gap-3">
        {clients.map((c, i) => (
          <div key={c.name} className="flex items-center gap-3">
            <span className="w-[140px] truncate text-xs text-gray-500 flex-shrink-0">{c.name}</span>
            <div className="flex-1 h-4 rounded bg-gray-100">
              <div
                className={`h-full rounded ${i === 0 ? "bg-green-600" : "bg-green-400"}`}
                style={{ width: `${c.w}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 w-[60px] text-right flex-shrink-0">{c.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackedMockup() {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const colors = ["bg-green-600", "bg-green-400", "bg-emerald-400", "bg-teal-400", "bg-cyan-400"];
  const clientNames = ["TechNova", "Agência", "Silva", "StartUp", "Outros"];
  const data = [
    [30, 20, 15, 10, 5],
    [25, 22, 18, 8, 7],
    [35, 15, 20, 12, 8],
    [28, 25, 12, 15, 5],
    [40, 18, 16, 8, 8],
    [32, 20, 18, 10, 10],
    [20, 15, 10, 8, 5],
    [15, 12, 8, 5, 3],
    [35, 22, 18, 12, 8],
    [38, 20, 22, 10, 10],
    [42, 25, 18, 12, 8],
    [48, 28, 20, 14, 10],
  ];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Período x Cliente</span>
        <div className="flex gap-2">
          {clientNames.map((n, i) => (
            <span key={n} className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className={`inline-block h-2 w-2 rounded-sm ${colors[i]}`} />
              {n}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-1.5" style={{ height: 180 }}>
        {months.map((m, mi) => {
          const total = data[mi].reduce((a, b) => a + b, 0);
          return (
            <div key={m} className="flex flex-1 flex-col items-center justify-end" style={{ height: "100%" }}>
              <div className="w-full flex flex-col-reverse rounded-t overflow-hidden" style={{ height: `${total}%` }}>
                {data[mi].map((seg, si) => (
                  <div key={si} className={`w-full ${colors[si]}`} style={{ height: `${(seg / total) * 100}%` }} />
                ))}
              </div>
              <span className="mt-1.5 text-[9px] text-gray-400">{m}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const mockups: Record<string, () => React.ReactElement> = {
  upload: UploadMockup,
  overview: OverviewMockup,
  "time-detail": TimeDetailMockup,
  clients: ClientsMockup,
  stacked: StackedMockup,
};

export function FeaturesSection() {
  const [active, setActive] = useState(0);
  const ActiveMockup = mockups[features[active].mockup];

  return (
    <section id="funcionalidades" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-green-700">
            Funcionalidades
          </p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Tudo o que precisas para perceber o teu negócio
          </h2>
          <p className="text-lg text-gray-600">
            Dashboards interativos construídos especificamente para recibos
            verdes portugueses.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Tab navigation */}
          <div className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
            {features.map((f, i) => (
              <button
                key={f.key}
                onClick={() => setActive(i)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors whitespace-nowrap lg:whitespace-normal ${
                  active === i
                    ? "bg-green-50 ring-1 ring-green-300"
                    : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`h-2 w-2 flex-shrink-0 rounded-full ${
                    active === i ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
                <span>
                  <span
                    className={`block text-sm font-semibold ${
                      active === i ? "text-green-700" : "text-gray-700"
                    }`}
                  >
                    {f.title}
                  </span>
                  <span className="hidden text-xs text-gray-400 lg:block">
                    {f.description}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Mockup area */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-lg overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
              <div className="ml-2 flex-1 rounded-md bg-white px-3 py-1 text-xs text-gray-400 font-mono">
                paineldosrecibos.barrosbuilds.com/dashboard
              </div>
            </div>
            <div className="p-6">
              <ActiveMockup />
            </div>
          </div>
        </div>

        {/* Description below on mobile */}
        <p className="mt-4 text-center text-sm text-gray-500 lg:hidden">
          {features[active].description}
        </p>
      </div>
    </section>
  );
}
