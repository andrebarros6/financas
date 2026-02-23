import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Cookies — Painel dos Recibos',
  description: 'Informação sobre os cookies utilizados no Painel dos Recibos e como gerir as suas preferências.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Painel dos Recibos</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Cookies</h1>
          <p className="text-sm text-gray-500 mb-8">
            Última atualização: 23 de fevereiro de 2026 · Versão 1.0
          </p>

          {/* 1. Introdução */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introdução</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              O <strong>Painel dos Recibos</strong> é um serviço operado a título individual
              (controlador de dados: serviço a título pessoal). Esta Política de Cookies explica
              o que são cookies, que cookies utilizamos, para que servem e como pode gerir as suas
              preferências.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Ao utilizar a aplicação, os cookies essenciais são ativados automaticamente para
              garantir o funcionamento correto do serviço. Os cookies não essenciais (como os de
              análise) só são ativados após o seu consentimento expresso, em cumprimento do RGPD e
              da Lei n.º 41/2004 (lei portuguesa que regula a utilização de cookies).
            </p>
          </section>

          {/* 2. O que são cookies */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. O Que São Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita
              um website. Permitem que a aplicação reconheça o seu dispositivo entre visitas e
              guarde certas preferências ou informações de sessão. Utilizamos também tecnologias
              similares como o <em>localStorage</em> do navegador para guardar as suas preferências
              de privacidade (sem enviar dados para servidores externos).
            </p>
          </section>

          {/* 3. Tipos de cookies */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Cookies Utilizados</h2>

            <h3 className="text-base font-semibold text-gray-800 mb-2">
              3.1 Cookies Essenciais (sem consentimento necessário)
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Base legal: Art.º 5.º-A da Lei n.º 41/2004 — estritamente necessários para o
              funcionamento do serviço.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Cookie / Tecnologia</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Propósito</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Retenção</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Fornecedor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">sb-auth-token</td>
                    <td className="px-4 py-2 text-gray-600">Autenticação e manutenção de sessão</td>
                    <td className="px-4 py-2 text-gray-600">Sessão + 1h</td>
                    <td className="px-4 py-2 text-gray-600">Supabase</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">__cf_bm</td>
                    <td className="px-4 py-2 text-gray-600">Proteção contra bots (Cloudflare)</td>
                    <td className="px-4 py-2 text-gray-600">30 min</td>
                    <td className="px-4 py-2 text-gray-600">Cloudflare / Supabase</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">_vercel_*</td>
                    <td className="px-4 py-2 text-gray-600">Roteamento de infraestrutura CDN</td>
                    <td className="px-4 py-2 text-gray-600">Sessão</td>
                    <td className="px-4 py-2 text-gray-600">Vercel</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">cookie_consent (localStorage)</td>
                    <td className="px-4 py-2 text-gray-600">Guardar as suas preferências de cookies</td>
                    <td className="px-4 py-2 text-gray-600">6 meses</td>
                    <td className="px-4 py-2 text-gray-600">Painel dos Recibos (local)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-base font-semibold text-gray-800 mb-2">
              3.2 Cookies de Análise & Desempenho (requer consentimento)
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Base legal: Art.º 6.º (1)(a) RGPD — Consentimento. Só são ativados após aprovação
              explícita.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Cookie</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Propósito</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Retenção</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Fornecedor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">_ga</td>
                    <td className="px-4 py-2 text-gray-600">Identificar utilizadores únicos</td>
                    <td className="px-4 py-2 text-gray-600">2 anos</td>
                    <td className="px-4 py-2 text-gray-600">Google Analytics 4</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">_ga_*</td>
                    <td className="px-4 py-2 text-gray-600">Rastreamento de sessão e eventos</td>
                    <td className="px-4 py-2 text-gray-600">2 anos</td>
                    <td className="px-4 py-2 text-gray-600">Google Analytics 4</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-base font-semibold text-gray-800 mb-2">
              3.3 Cookies de Marketing & Publicidade (requer consentimento)
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Atualmente <strong>não estão ativos</strong> no Painel dos Recibos. Se forem
              introduzidos no futuro, esta política será atualizada e ser-lhe-á solicitado novo
              consentimento.
            </p>

            <h3 className="text-base font-semibold text-gray-800 mb-2">
              3.4 Cookies de Preferência (sem consentimento necessário)
            </h3>
            <p className="text-sm text-gray-600">
              Podem ser utilizados para guardar preferências de interface (ex: tema claro/escuro).
              Não envolvem rastreamento entre sessões ou partilha com terceiros.
            </p>
          </section>

          {/* 4. Terceiros */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Terceiros e Transferência de Dados
            </h2>
            <p className="text-gray-700 mb-4">
              Ao utilizar a aplicação, dados pessoais podem ser partilhados com as seguintes
              entidades para os fins descritos:
            </p>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-1">Google Analytics 4</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Dados:</strong> Identificador de utilizador, páginas visitadas, eventos, informação do dispositivo, IP anonimizado</li>
                  <li><strong>Finalidade:</strong> Análise de comportamento e melhoria da aplicação</li>
                  <li><strong>Localização:</strong> Servidores Google (EUA/UE conforme configuração)</li>
                  <li><strong>Base legal:</strong> Consentimento (pode retirar a qualquer momento)</li>
                  <li>
                    <strong>Política:</strong>{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      policies.google.com/privacy
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-1">Supabase (Base de Dados & Autenticação)</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Dados:</strong> Email, perfil do utilizador, dados dos recibos importados</li>
                  <li><strong>Finalidade:</strong> Armazenamento de dados e autenticação</li>
                  <li><strong>Localização:</strong> Servidores Supabase — região UE</li>
                  <li><strong>Base legal:</strong> Execução do contrato de serviço</li>
                  <li>
                    <strong>Política:</strong>{' '}
                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      supabase.com/privacy
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-1">Stripe (Processamento de Pagamentos)</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Dados:</strong> Email, informação de pagamento (tokenizada), dados de subscrição</li>
                  <li><strong>Finalidade:</strong> Processamento de pagamentos e gestão de subscrições</li>
                  <li><strong>Localização:</strong> Servidores Stripe (global, certificado SOC 2)</li>
                  <li><strong>Base legal:</strong> Execução do contrato + Interesse legítimo (prevenção de fraude)</li>
                  <li>
                    <strong>Política:</strong>{' '}
                    <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      stripe.com/privacy
                    </a>
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-1">Vercel (Alojamento & CDN)</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Dados:</strong> Logs de pedidos, dados de implementação</li>
                  <li><strong>Finalidade:</strong> Alojamento e distribuição de conteúdo</li>
                  <li><strong>Localização:</strong> Rede global Vercel (RGPD conforme)</li>
                  <li><strong>Base legal:</strong> Execução do contrato de serviço</li>
                  <li>
                    <strong>Política:</strong>{' '}
                    <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      vercel.com/legal/privacy-policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Para transferências internacionais de dados (ex: Google Analytics para os EUA),
              baseamo-nos nas Cláusulas Contratuais Padrão (SCCs) definidas pelo RGPD, Capítulo V.
            </p>
          </section>

          {/* 5. Direitos */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Os Seus Direitos</h2>

            <h3 className="text-base font-semibold text-gray-800 mb-2">
              5.1 Gerir Preferências na Aplicação
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Pode alterar as suas preferências de cookies a qualquer momento:
            </p>
            <ul className="text-sm text-gray-600 mb-6 list-disc pl-5 space-y-1">
              <li>Clique no botão <strong>"Preferências de Cookies"</strong> no canto inferior direito do ecrã</li>
              <li>Ou aceda à ligação "Preferências de Cookies" no rodapé de qualquer página</li>
              <li>Ative ou desative categorias conforme desejado — sem penalização</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-800 mb-2">5.2 Direitos RGPD</h3>
            <p className="text-sm text-gray-600 mb-3">Ao abrigo do RGPD, tem direito a:</p>
            <ul className="text-sm text-gray-600 mb-6 list-disc pl-5 space-y-1">
              <li><strong>Acesso</strong> — solicitar uma cópia dos dados que temos sobre si</li>
              <li><strong>Retificação</strong> — corrigir dados incorretos</li>
              <li><strong>Eliminação</strong> — pedir a eliminação dos seus dados (direito ao esquecimento)</li>
              <li><strong>Portabilidade</strong> — receber os seus dados em formato portável</li>
              <li><strong>Oposição</strong> — opor-se ao tratamento de dados para determinados fins</li>
              <li><strong>Retirada de consentimento</strong> — pode retirar o consentimento a qualquer momento, sem efeitos retroativos</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-800 mb-2">5.3 Controlo pelo Navegador</h3>
            <p className="text-sm text-gray-600 mb-2">
              Pode também controlar ou eliminar cookies diretamente nas definições do seu navegador:
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Chrome: <code className="text-xs bg-gray-100 px-1 rounded">chrome://settings/cookies</code></li>
              <li>Firefox: Preferências → Privacidade & Segurança → Cookies e Dados do Site</li>
              <li>Safari: Preferências → Privacidade → Gerir Dados do Website</li>
            </ul>
          </section>

          {/* 6. Contacto */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contacto</h2>
            <p className="text-gray-700 mb-4">
              Para questões sobre esta Política de Cookies ou para exercer os seus direitos:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
              <p><strong>Controlador de dados:</strong> Painel dos Recibos (serviço a título individual)</p>
              <p><strong>Email:</strong> <a href="mailto:andre@barrosbuilds.com" className="text-green-600 hover:underline">andre@barrosbuilds.com</a></p>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">Autoridade de Supervisão (Portugal)</p>
              <p>
                CNPD — Comissão Nacional de Proteção de Dados{' '}
                <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className="underline">
                  www.cnpd.pt
                </a>{' '}
                · Email:{' '}
                <a href="mailto:geral@cnpd.pt" className="underline">
                  geral@cnpd.pt
                </a>
              </p>
              <p className="mt-1 text-xs text-blue-600">
                Tem o direito de apresentar uma reclamação junto da CNPD se considerar que o
                tratamento dos seus dados pessoais viola o RGPD.
              </p>
            </div>
          </section>

          <div className="border-t border-gray-200 pt-6 text-xs text-gray-400">
            <p>Versão 1.0 · Atualizada a 23 de fevereiro de 2026 · Próxima revisão: agosto de 2026</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 mt-8">
        <div className="mx-auto max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">← Voltar à página inicial</Link>
          <p>© {new Date().getFullYear()} Painel dos Recibos</p>
        </div>
      </footer>
    </div>
  );
}
