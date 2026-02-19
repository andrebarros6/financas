"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Algo correu mal
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Ocorreu um erro inesperado. Por favor, tente novamente.
            </p>
            <div className="mt-8">
              <button
                onClick={reset}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
