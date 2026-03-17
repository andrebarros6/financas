import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { LandingFooter } from "@/components/landing/LandingFooter";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Painel dos Recibos`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Painel dos Recibos
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
              Blog
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <main className="mx-auto max-w-3xl px-4 py-16">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Blog
        </Link>

        <article
          className="prose prose-gray max-w-none mt-4
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-3xl prose-h1:mb-4
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-green-700 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900
            prose-table:text-sm prose-th:bg-gray-50 prose-th:font-semibold
            prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 prose-code:text-sm prose-code:text-gray-800
            prose-hr:border-gray-200
            prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* CTA */}
        <div className="mt-16 rounded-xl border border-green-100 bg-green-50 p-8 text-center">
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Analisa os teus recibos em segundos
          </h2>
          <p className="mb-6 text-gray-600">
            Importa o teu ficheiro SIRE e obtém um resumo completo de faturação,
            retenção na fonte e muito mais — de graça.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            Começar gratuitamente →
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
