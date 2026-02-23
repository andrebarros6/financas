'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CookiePreferences } from '@/components/CookiePreferences';
import { getStoredConsent } from '@/lib/cookies/consentManager';

export function LandingFooter() {
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <>
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-green-600">
                <span className="text-sm font-bold text-white">P</span>
              </div>
              <span className="text-sm text-gray-600">Painel dos Recibos</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <Link href="/cookies" className="hover:text-gray-700 transition-colors">
                Política de Cookies
              </Link>
              <span className="hidden sm:inline text-gray-300">·</span>
              <button
                onClick={() => setShowPreferences(true)}
                className="hover:text-gray-700 transition-colors"
              >
                Preferências de Cookies
              </button>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {showPreferences && (
        <CookiePreferences
          current={getStoredConsent() ?? { essential: true, analytics: false, marketing: false, timestamp: '' }}
          onClose={() => setShowPreferences(false)}
          onSaved={() => setShowPreferences(false)}
        />
      )}
    </>
  );
}
