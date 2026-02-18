"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Onde encontro os dados dos recibos no Portal das Finanças?",
    answer:
      "Acede ao Portal das Finanças → Procurar por Facturas e Recibos → Consultar → Escolher o Período → Exportar tabela. O ficheiro descarregado é exatamente o que precisas para fazer upload aqui.",
  },
  {
    question: "Os meus dados ficam guardados em segurança?",
    answer:
      "Sim. Os teus dados são armazenados em servidores na União Europeia (Portugal/Irlanda), com encriptação em trânsito e em repouso. Nenhum terceiro tem acesso aos teus dados. Podes eliminar tudo a qualquer momento nas definições da conta.",
  },
  {
    question: "A versão gratuita tem limite de tempo?",
    answer:
      "Não. A versão gratuita é permanente — podes usá-la indefinidamente sem pagar nada. O único limite é que podes importar dados de apenas um ano fiscal de cada vez. Se precisares de comparar vários anos, o plano Premium (€2,99/mês) desbloqueia essa funcionalidade.",
  },
  {
    question: "Funciona com todos os tipos de recibos verdes?",
    answer:
      "Sim. Importamos todos os documentos exportados pelo SIRE: Faturas-Recibo, Recibos, e outros. Recibos anulados são automaticamente identificados e excluídos dos totais.",
  },
  {
    question: "Posso cancelar o Premium a qualquer altura?",
    answer:
      "Sim, sem complicações. Cancelas nas definições da conta em menos de um minuto. Os teus dados ficam intactos e podes continuar a usar a versão gratuita.",
  },
  {
    question: "O que acontece se carregar o mesmo recibo duas vezes?",
    answer:
      "Nada de errado. Cada recibo tem um código único (ATCUD) e detetamos automaticamente duplicados. Só novos recibos são adicionados — nunca terás dados duplicados no painel.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-gray-50 border-t border-gray-200 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left side */}
          <div className="lg:sticky lg:top-10 lg:self-start">
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-green-700">
              Dúvidas frequentes
            </p>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Tens perguntas.
              <br />
              Temos respostas.
            </h2>
            <p className="text-gray-500">
              Não encontras o que procuras? Envia-nos uma mensagem.
            </p>
            <a
              href="mailto:andre@barrosbuilds.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              Contacta-nos
            </a>
          </div>

          {/* FAQ items */}
          <div className="flex flex-col gap-1">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() => toggle(i)}
                  className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold transition-colors ${
                    openIndex === i
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {faq.question}
                  <svg
                    className={`h-4 w-4 flex-shrink-0 transition-transform ${
                      openIndex === i
                        ? "rotate-180 text-green-600"
                        : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? "max-h-60" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-gray-500">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
