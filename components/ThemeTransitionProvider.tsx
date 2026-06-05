'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

type ThemeId = 'light' | 'dark'
type TransitionPhase = 'opening' | 'closing' | null

type TransitionOrigin = {
  x: number
  y: number
}

type ThemeTransitionContextValue = {
  isTransitioning: boolean
  switchTheme: (theme: ThemeId, origin: TransitionOrigin) => void
}

const ThemeTransitionContext = createContext<ThemeTransitionContextValue | null>(
  null
)

const THEME_SURFACE: Record<ThemeId, string> = {
  light: '#F4F0E8',
  dark: '#000000',
}

const OPEN_DURATION = 0.62
const CLOSE_DURATION = 0.52

function toPercentOrigin(origin: TransitionOrigin) {
  if (typeof window === 'undefined') {
    return { x: 50, y: 8 }
  }

  return {
    x: (origin.x / window.innerWidth) * 100,
    y: (origin.y / window.innerHeight) * 100,
  }
}

export function ThemeTransitionProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [phase, setPhase] = useState<TransitionPhase>(null)
  const [origin, setOrigin] = useState({ x: 88, y: 6 })
  const [targetTheme, setTargetTheme] = useState<ThemeId>('dark')
  const runIdRef = useRef(0)
  const openingDoneRef = useRef(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!isTransitioning) return

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyPaddingRight = document.body.style.paddingRight
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
      document.body.style.paddingRight = previousBodyPaddingRight
    }
  }, [isTransitioning])

  const finishTransition = useCallback((runId: number) => {
    if (runId !== runIdRef.current) return

    setShowOverlay(false)
    setPhase(null)
    setIsTransitioning(false)
  }, [])

  const switchTheme = useCallback(
    (theme: ThemeId, clickOrigin: TransitionOrigin) => {
      if (!mounted || isTransitioning) return

      const current = (resolvedTheme as ThemeId) ?? 'dark'
      if (theme === current) return

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (prefersReducedMotion) {
        setTheme(theme)
        return
      }

      const runId = runIdRef.current + 1
      runIdRef.current = runId
      openingDoneRef.current = false

      setTargetTheme(theme)
      setOrigin(toPercentOrigin(clickOrigin))
      setIsTransitioning(true)
      setShowOverlay(true)
      setPhase('opening')
    },
    [isTransitioning, mounted, resolvedTheme, setTheme]
  )

  const clipAt = `${origin.x}% ${origin.y}%`
  const openClip = `circle(150% at ${clipAt})`
  const closedClip = `circle(0% at ${clipAt})`

  const handleOverlayComplete = useCallback(() => {
    const runId = runIdRef.current

    if (phase === 'opening') {
      if (openingDoneRef.current) return
      openingDoneRef.current = true

      setTheme(targetTheme)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (runId !== runIdRef.current) return
          setPhase('closing')
        })
      })
      return
    }

    if (phase === 'closing') {
      finishTransition(runId)
    }
  }, [finishTransition, phase, setTheme, targetTheme])

  const value = useMemo(
    () => ({ isTransitioning, switchTheme }),
    [isTransitioning, switchTheme]
  )

  return (
    <ThemeTransitionContext.Provider value={value}>
      {children}

      {showOverlay && phase && (
        <div
          className="pointer-events-none fixed inset-0 z-[9998] isolate"
          aria-hidden
        >
          <motion.div
            className="absolute inset-0 transform-gpu will-change-[clip-path]"
            style={{ backgroundColor: THEME_SURFACE[targetTheme] }}
            initial={{ clipPath: closedClip }}
            animate={{
              clipPath: phase === 'opening' ? openClip : closedClip,
            }}
            transition={{
              duration: phase === 'opening' ? OPEN_DURATION : CLOSE_DURATION,
              ease: phase === 'opening' ? [0.22, 1, 0.36, 1] : [0.76, 0, 0.24, 1],
            }}
            onAnimationComplete={handleOverlayComplete}
          >
            {phase === 'opening' && (
              <>
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 10px)',
                    color: targetTheme === 'light' ? '#000000' : '#ffffff',
                  }}
                />
                <span
                  className="absolute inset-0 flex items-center justify-center font-mono text-xs font-black tracking-[0.45em]"
                  style={{ color: targetTheme === 'light' ? '#09090b' : '#fafafa' }}
                >
                  {targetTheme === 'light' ? 'LIGHT_MODE' : 'DARK_MODE'}
                </span>
              </>
            )}
          </motion.div>
        </div>
      )}
    </ThemeTransitionContext.Provider>
  )
}

export function useThemeTransition() {
  const context = useContext(ThemeTransitionContext)

  if (!context) {
    throw new Error('useThemeTransition must be used within ThemeTransitionProvider')
  }

  return context
}

export function ThemeTransitionShell({ children }: { children: ReactNode }) {
  return <>{children}</>
}
