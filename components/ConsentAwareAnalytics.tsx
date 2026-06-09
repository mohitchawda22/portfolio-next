'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/next'
import {
  COOKIE_CONSENT_EVENT,
  hasCookieConsent,
} from '@/lib/cookie-consent'

export function ConsentAwareAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (hasCookieConsent()) {
      setEnabled(true)
    }

    const onAccepted = () => setEnabled(true)
    window.addEventListener(COOKIE_CONSENT_EVENT, onAccepted)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onAccepted)
  }, [])

  if (!enabled || process.env.NODE_ENV !== 'production') {
    return null
  }

  return <Analytics />
}
