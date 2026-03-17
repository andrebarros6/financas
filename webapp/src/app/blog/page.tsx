import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { LandingFooter } from "@/components/landing/LandingFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Painel dos Recibos",
  description:
    "Guias práticos para trabalhadores independentes em Portugal: recibos verdes, IRS, SIRE, retenção na fonte e mais.",
};

export default function BlogPage() {
  const articles = getAllArticles();

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
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Início
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

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">
          Blog
        </h1>
        <p className="mb-12 text-lg text-gray-600">
          Guias práticos para trabalhadores independentes em Portugal.
        </p>

        <div className="flex flex-col gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-600">{article.description}</p>
            </Link>
          ))}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
