export const COOKIE_CONSENT_STORAGE_KEY = 'portfolio-cookie-consent'
export const COOKIE_CONSENT_COOKIE_NAME = 'portfolio-cookie-consent'
export const COOKIE_CONSENT_EVENT = 'portfolio-cookie-consent-accepted'

export type ConsentStatus = 'accepted' | 'declined'

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

function readCookieValue(): ConsentStatus | null {
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_CONSENT_COOKIE_NAME}=`))

  if (!match) return null

  const value = match.split('=')[1]
  if (value === 'accepted' || value === 'declined') {
    return value
  }

  return null
}

export function getConsentStatus(): ConsentStatus | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (stored === 'accepted' || stored === 'declined') {
      return stored
    }
  } catch {
    // localStorage may be blocked
  }

  return readCookieValue()
}

export function hasConsentDecision(): boolean {
  return getConsentStatus() !== null
}

export function hasCookieConsent(): boolean {
  return getConsentStatus() === 'accepted'
}

function persistConsent(status: ConsentStatus): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, status)
  } catch {
    // ignore
  }

  document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${status}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`
}

export function setCookieConsent(): void {
  persistConsent('accepted')
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT))
}

export function declineCookieConsent(): void {
  persistConsent('declined')
}
