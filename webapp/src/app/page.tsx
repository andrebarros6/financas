import { DemoChart } from "@/components/landing/DemoChart";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Painel dos Recibos
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#como-funciona"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Como Funciona
            </a>
            <a
              href="#funcionalidades"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Funcionalidades
            </a>
            <a
              href="#precos"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Preços
            </a>
            <a
              href="#faq"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              FAQ
            </a>
            <a
              href="/login"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              Entrar
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Passas recibos todos os meses. Mas sabes quem te faz{" "}
              <span className="text-green-600">ganhar mais</span>?
            </h1>
            <p className="mb-3 text-lg text-gray-600">
              A maioria dos freelancers portugueses não sabe qual é o seu melhor
              cliente, o seu melhor mês, ou se o seu negócio está a crescer.
            </p>
            <p className="mb-8 text-lg font-medium text-gray-800">
              O Painel dos Recibos transforma os dados do Portal das
              Finanças em gráficos claros — para ganhares mais, trabalhando
              melhor.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-base font-medium text-white hover:bg-green-700 transition-colors"
              >
                Começar grátis
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Ver como funciona
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>100% gratuito para começar</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Dados na UE</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Privacidade garantida</span>
              </div>
            </div>
          </div>

          {/* Demo Chart */}
          <div className="flex items-center justify-center">
            <DemoChart className="w-full max-w-lg" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-green-700">
            &ldquo;O que é medido é gerido&rdquo;
          </p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            O problema é que não estás a medir nada
          </h2>
          <p className="mb-10 text-lg text-gray-600">
            Passas recibos verdes todos os meses, mas o Portal das Finanças só
            te dá um ficheiro CSV impossível de ler. Resultado?
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl text-red-400">?</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Não sabes quem te paga mais
              </h3>
              <p className="text-sm text-gray-600">
                Qual é o cliente que mais contribui para o teu rendimento?
                Sem dados claros, não consegues priorizar.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl text-red-400">?</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Não vês a sazonalidade
              </h3>
              <p className="text-sm text-gray-600">
                Há meses em que ganhas mais e meses em que ganhas menos.
                Mas quais? E porquê?
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl text-red-400">?</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Não sabes se estás a crescer
              </h3>
              <p className="text-sm text-gray-600">
                O teu negócio está a melhorar ou a estagnar?
                Sem números, estás a adivinhar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - 3 Steps */}
      <section id="como-funciona" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              A solução em 3 passos simples
            </h2>
            <p className="text-lg text-gray-600">
              Do Portal das Finanças ao teu dashboard pessoal, em menos de
              2 minutos.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Exporta do Portal das Finanças
              </h3>
              <p className="text-gray-600">
                Vai ao Portal das Finanças, procura por Facturas e Recibos,
                consulta o período desejado e exporta a tabela. Demora 30 segundos.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Importa o ficheiro
              </h3>
              <p className="text-gray-600">
                Arrasta o ficheiro CSV para o Painel dos Recibos. Nós
                processamos tudo automaticamente — sem configurações.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Vê os teus números
              </h3>
              <p className="text-gray-600">
                Gráficos de rendimento por mês, por cliente, tendências e
                muito mais. Finalmente, percebes o teu negócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Deixa de adivinhar. Começa a saber.
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Cria a tua conta gratuita e importa os teus recibos em menos de
            2 minutos.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 transition-colors"
          >
            Começar grátis
          </a>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
