import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { DemoChart } from "@/components/landing/DemoChart";

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
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              Em breve
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Passas recibos todos os meses. Mas sabes quem te faz{" "}
              <span className="text-green-600">ganhar mais</span>?
            </h1>
            <p className="mb-3 text-lg text-gray-600">
              A maioria dos freelancers portugueses não sabe qual é o seu melhor
              cliente, o seu melhor mês, ou se o seu negócio está a crescer.
            </p>
            <p className="mb-8 text-lg font-medium text-gray-800">
              O Painel dos Recibos transforma o ficheiro SIRE do Portal das
              Finanças em gráficos claros — para ganhares mais, trabalhando
              melhor.
            </p>

            {/* Waitlist Form */}
            <WaitlistForm />

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
                Vai ao Portal das Finanças, entra no e-Fatura &gt; SIRE e
                exporta os teus recibos em CSV. Demora 30 segundos.
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
      <section id="funcionalidades" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              O que vais descobrir sobre o teu negócio
            </h2>
            <p className="text-lg text-gray-600">
              Respostas que sempre quiseste ter, a partir dos recibos que já
              passaste.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Rendimento por mês
              </h3>
              <p className="text-gray-600">
                Vê quanto ganhaste em cada mês. Identifica a sazonalidade do
                teu negócio e planeia os meses mais fracos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Ranking de clientes
              </h3>
              <p className="text-gray-600">
                Descobre quais os clientes que mais contribuem para o teu
                rendimento. Sabe onde investir o teu tempo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Dados 100% seguros
              </h3>
              <p className="text-gray-600">
                Os teus dados ficam encriptados e armazenados na União Europeia.
                Podes apagar tudo a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* Free Tier */}
            <div className="rounded-xl border border-gray-200 p-8">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Explorador
              </h3>
              <p className="mb-4 text-gray-600">Para começar a perceber os teus números</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">0€</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-2 text-gray-600">
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
                  1 ano de dados
                </li>
                <li className="flex items-center gap-2 text-gray-600">
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
                  Gráficos mensais e por cliente
                </li>
                <li className="flex items-center gap-2 text-gray-600">
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
              <p className="mb-4 text-gray-600">Para quem leva o negócio a sério</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">2,99€</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-2 text-gray-600">
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
                  Anos ilimitados de dados
                </li>
                <li className="flex items-center gap-2 text-gray-600">
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
                  Comparação ano a ano
                </li>
                <li className="flex items-center gap-2 text-gray-600">
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
                  Editar e apagar recibos
                </li>
                <li className="flex items-center gap-2 text-gray-600">
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
                  Exportar PDF e Excel
                </li>
                <li className="flex items-center gap-2 text-gray-600">
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

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Deixa de adivinhar. Começa a saber.
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Deixa o teu email e avisamos assim que o Painel dos Recibos estiver
            disponível.
          </p>
          <WaitlistForm className="mx-auto" />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-green-600">
                <span className="text-sm font-bold text-white">P</span>
              </div>
              <span className="text-sm text-gray-600">
                Painel dos Recibos
              </span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
