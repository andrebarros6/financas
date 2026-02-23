const CONSENT_KEY = 'cookie_consent';
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

export interface ConsentState {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const consent = JSON.parse(raw) as ConsentState;
    const age = Date.now() - new Date(consent.timestamp).getTime();
    if (age > SIX_MONTHS_MS) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return consent;
  } catch {
    return null;
  }
}

export function saveConsent(consent: Omit<ConsentState, 'timestamp'>): ConsentState {
  const full: ConsentState = { ...consent, essential: true, timestamp: new Date().toISOString() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(full));
  } catch {
    // Silently ignore storage errors
  }
  return full;
}

export function updateGAConsent(consent: ConsentState): void {
  if (typeof window === 'undefined') return;
  (window as any).gtag?.('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
  });
}

export function initGAConsentMode(): void {
  if (typeof window === 'undefined') return;
  // Apply stored consent if present; GA default is already set to denied via the inline script
  const stored = getStoredConsent();
  if (stored) {
    updateGAConsent(stored);
  }
}
