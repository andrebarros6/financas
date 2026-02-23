'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  type ConsentState,
  getStoredConsent,
  saveConsent,
  updateGAConsent,
  initGAConsentMode,
} from '@/lib/cookies/consentManager';
import { CookiePreferences } from './CookiePreferences';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    essential: true,
    analytics: false,
    marketing: false,
    timestamp: '',
  });

  useEffect(() => {
    // Apply any stored consent to GA immediately (runs once on mount)
    initGAConsentMode();

    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored);
    } else {
      setShowBanner(true);
    }
  }, []);

  const handleChoice = (analytics: boolean, marketing: boolean) => {
    const saved = saveConsent({ essential: true, analytics, marketing });
    updateGAConsent(saved);
    setConsent(saved);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleSavedFromPreferences = (saved: ConsentState) => {
    setConsent(saved);
    setShowBanner(false);
    setShowPreferences(false);
  };

  if (showPreferences) {
    return (
      <CookiePreferences
        current={consent}
        onClose={() => setShowPreferences(false)}
        onSaved={handleSavedFromPreferences}
      />
    );
  }

  if (!showBanner) {
    // Always-visible link so users can re-open preferences (GDPR Art. 7)
    return (
      <div className="fixed bottom-3 right-3 z-40">
        <button
          onClick={() => setShowPreferences(true)}
          className="text-xs text-gray-400 hover:text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1.5 shadow-sm transition-colors"
          aria-label="Gerir preferências de cookies"
        >
          Preferências de Cookies
        </button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white border-t-4 border-green-500 shadow-2xl"
    >
      <div className="max-w-5xl mx-auto px-4 py-5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-200">
              Usamos cookies para melhorar a sua experiência. Alguns são necessários para o
              funcionamento da aplicação. Outros ajudam-nos a perceber como usa o serviço.{' '}
              <Link href="/cookies" className="text-green-400 hover:underline whitespace-nowrap">
                Política de Cookies
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            <button
              onClick={() => handleChoice(false, false)}
              className="px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Rejeitar Não-Essenciais
            </button>
            <button
              onClick={() => handleChoice(true, true)}
              className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
            >
              Aceitar Todos
            </button>
            <button
              onClick={() => setShowPreferences(true)}
              className="px-4 py-2 text-sm font-medium border border-gray-500 hover:border-gray-400 rounded-lg transition-colors"
            >
              Personalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
