'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type ConsentState, saveConsent, updateGAConsent } from '@/lib/cookies/consentManager';

interface Props {
  current: ConsentState;
  onClose: () => void;
  onSaved: (consent: ConsentState) => void;
}

export function CookiePreferences({ current, onClose, onSaved }: Props) {
  const [analytics, setAnalytics] = useState(current.analytics);
  const [marketing, setMarketing] = useState(current.marketing);

  const commit = (a: boolean, m: boolean) => {
    const saved = saveConsent({ essential: true, analytics: a, marketing: m });
    updateGAConsent(saved);
    onSaved(saved);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Preferências de Cookies</h2>
          <p className="text-sm text-gray-500 mb-6">
            Gerir as suas preferências de privacidade. Saiba mais na nossa{' '}
            <Link href="/cookies" className="text-green-600 hover:underline" onClick={onClose}>
              Política de Cookies
            </Link>
            .
          </p>

          <div className="space-y-4">
            {/* Essential */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Cookies Essenciais</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Necessários para autenticação, segurança e funcionamento básico da aplicação.
                    Não podem ser desativados.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    <strong>Terceiros:</strong> Supabase, Vercel · <strong>Retenção:</strong> Sessão
                  </p>
                </div>
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="w-5 h-5 accent-green-600 cursor-not-allowed opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Análise & Desempenho</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ajudam-nos a compreender como utiliza a aplicação e a melhorar os seus recursos.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    <strong>Terceiro:</strong> Google Analytics 4 · <strong>Retenção:</strong> 2 anos
                  </p>
                </div>
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={() => setAnalytics((v) => !v)}
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Marketing */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Marketing & Publicidade</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Cookies de publicidade direcionada e remarketing. Atualmente não estão ativos.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    <strong>Terceiro:</strong> Google Ads (quando ativado) · <strong>Retenção:</strong> Varia
                  </p>
                </div>
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={() => setMarketing((v) => !v)}
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 justify-end border-t border-gray-100 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => commit(false, false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Rejeitar Todos
            </button>
            <button
              onClick={() => commit(analytics, marketing)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Guardar Preferências
            </button>
            <button
              onClick={() => commit(true, true)}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Aceitar Todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
