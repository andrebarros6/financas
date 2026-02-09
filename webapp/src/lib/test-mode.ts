/**
 * Test mode utilities
 * Allows testing the app without authentication
 *
 * To enable test mode:
 * 1. Open browser console
 * 2. Run: localStorage.setItem('test-mode', 'true')
 * 3. Refresh page
 *
 * To disable:
 * localStorage.removeItem('test-mode')
 */

export const TEST_USER_ID = 'test-user-123'

export function isTestMode(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('test-mode') === 'true'
}

export function enableTestMode() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('test-mode', 'true')
    console.log('✅ Test mode enabled. Refresh the page.')
  }
}

export function disableTestMode() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('test-mode')
    console.log('✅ Test mode disabled. Refresh the page.')
  }
}

// Make available in console
if (typeof window !== 'undefined') {
  ; (window as any).enableTestMode = enableTestMode
  ; (window as any).disableTestMode = disableTestMode
}
