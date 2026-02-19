import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600">
          <span className="text-2xl font-bold text-white">P</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          404
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Página não encontrada
        </p>
        <p className="mt-1 text-sm text-gray-500">
          A página que procura não existe ou foi movida.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            Voltar ao início
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Ir para o painel
          </Link>
        </div>
      </div>
    </div>
  );
}
