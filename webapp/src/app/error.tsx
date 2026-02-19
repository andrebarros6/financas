"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600">
          <span className="text-2xl font-bold text-white">P</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Algo correu mal
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}
