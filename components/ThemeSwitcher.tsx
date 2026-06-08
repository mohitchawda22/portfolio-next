'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useThemeTransition } from '@/components/ThemeTransitionProvider'

const themes = [
  { id: 'light' as const, label: 'Light', icon: Sun },
  { id: 'dark' as const, label: 'Dark', icon: Moon },
]

export function ThemeSwitcher() {
  const { theme, resolvedTheme } = useTheme()
  const { switchTheme, isTransitioning } = useThemeTransition()
  const [mounted, setMounted] = useState(false)
  const [uiTheme, setUiTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isTransitioning) return

    const next = (theme === 'system' ? resolvedTheme : theme) as 'light' | 'dark' | undefined
    if (next === 'light' || next === 'dark') {
      setUiTheme(next)
    }
  }, [isTransitioning, resolvedTheme, theme])

  if (!mounted) {
    return (
      <div
        className="fixed right-4 top-4 z-[10000] h-12 w-[6.75rem] rounded-full border border-white/10 bg-white/5 backdrop-blur-xl sm:right-5 sm:top-5 sm:h-14 sm:w-[7.5rem] md:right-8 md:top-8"
        aria-hidden
      />
    )
  }

  const activeIndex = uiTheme === 'light' ? 0 : 1

  const handleSwitch = (nextTheme: 'light' | 'dark', event: MouseEvent<HTMLButtonElement>) => {
    if (nextTheme === uiTheme || isTransitioning) return

    const rect = event.currentTarget.getBoundingClientRect()
    switchTheme(nextTheme, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.6 }}
      className="fixed right-4 top-4 z-[10000] sm:right-5 sm:top-5 md:right-8 md:top-8"
    >
      <div className="relative overflow-hidden rounded-full border border-portfolio-ink/15 bg-portfolio-cream/80 p-1.5 shadow-[0_8px_32px_rgba(15,15,15,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-black/35 dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]"
          aria-hidden
        />

        <div className="relative flex items-center gap-1">
          <motion.div
            className="absolute bottom-1.5 top-1.5 w-[calc(50%-4px)] rounded-full border border-portfolio-accent/60 bg-portfolio-accent/40 shadow-inner backdrop-blur-md dark:border-white/15 dark:bg-white/10"
            animate={{ left: activeIndex === 0 ? '6px' : 'calc(50% + 2px)' }}
            transition={
              isTransitioning
                ? { duration: 0 }
                : { type: 'spring', stiffness: 420, damping: 32 }
            }
          />

          {themes.map((item) => {
            const isActive = uiTheme === item.id
            const Icon = item.icon

            return (
              <motion.button
                key={item.id}
                type="button"
                disabled={isTransitioning}
                onClick={(event) => handleSwitch(item.id, event)}
                aria-label={`Switch to ${item.label} theme`}
                aria-pressed={isActive}
                whileHover={isTransitioning ? undefined : { scale: 1.06 }}
                whileTap={isTransitioning ? undefined : { scale: 0.94 }}
                className="relative z-10 flex h-10 w-[2.9rem] items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-wait disabled:opacity-70 sm:h-11 sm:w-[3.25rem]"
              >
                <span
                  className={
                    isActive
                      ? 'text-portfolio-ink dark:text-white'
                      : 'text-portfolio-ink/45 dark:text-white/45'
                  }
                >
                  <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.4} />
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <span className="mt-2 block text-center font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-portfolio-ink/50 dark:text-white/40">
        {isTransitioning ? 'switching...' : `${uiTheme} mode`}
      </span>
    </motion.div>
  )
}
