'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  declineCookieConsent,
  hasConsentDecision,
  setCookieConsent,
} from '@/lib/cookie-consent'

export function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!hasConsentDecision()) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    setCookieConsent()
    setVisible(false)
  }

  const decline = () => {
    declineCookieConsent()
    setVisible(false)
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie and cache consent"
          className="fixed inset-x-0 bottom-0 z-[10050] px-4 pb-4 sm:px-6 sm:pb-6"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4 border-4 border-portfolio-ink bg-portfolio-cream p-5 shadow-[10px_10px_0_0_#E3FF47] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6 dark:border-white dark:bg-black dark:shadow-[10px_10px_0_0_rgba(255,255,255,0.9)]">
            <div className="min-w-0">
              <p className="mb-2 font-mono text-[10px] font-black tracking-[0.32em] text-portfolio-ink/45 dark:text-white/40">
                // COOKIES &amp; CACHE
              </p>
              <p className="text-sm font-medium leading-relaxed text-portfolio-ink/80 dark:text-white/70">
                We use cookies and local storage for theme preferences, session data, and
                analytics. By continuing, you agree to this use until you clear your browser
                cookies or site data.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row sm:gap-3">
              <motion.button
                type="button"
                onClick={decline}
                className="border-2 border-portfolio-ink bg-transparent px-6 py-3 font-mono text-xs font-black tracking-[0.2em] text-portfolio-ink transition-colors hover:bg-portfolio-ink hover:text-portfolio-cream dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black sm:text-sm"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                CANCEL
              </motion.button>
              <motion.button
                type="button"
                onClick={accept}
                className="border-2 border-portfolio-ink bg-portfolio-accent px-6 py-3 font-mono text-xs font-black tracking-[0.2em] text-portfolio-ink transition-colors hover:bg-portfolio-ink hover:text-portfolio-accent dark:border-white dark:bg-white dark:text-black dark:hover:bg-portfolio-accent dark:hover:text-portfolio-ink sm:text-sm"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                ACCEPT
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
