export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
            <span className="text-xl font-bold text-white">P</span>
          </div>
          <span className="text-2xl font-semibold text-gray-900">
            Painel dos Recibos
          </span>
        </div>

        {/* Auth card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Painel dos Recibos
        </p>
      </div>
    </div>
  );
}
