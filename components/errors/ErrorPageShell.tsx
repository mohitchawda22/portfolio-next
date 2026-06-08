'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { ErrorCircuitGrid } from '@/components/errors/ErrorCircuitGrid'
import { GlitchErrorCode } from '@/components/errors/GlitchErrorCode'
import { ViewportMotion } from '@/components/errors/ViewportMotion'

export type ErrorPageShellProps = {
  code: string
  label: string
  title: string
  description: string
  ghostText?: string
  showRetry?: boolean
  onRetry?: () => void
}

export function ErrorPageShell({
  code,
  label,
  title,
  description,
  ghostText = 'SIGNAL_LOST_',
  showRetry = false,
  onRetry,
}: ErrorPageShellProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const ghostX = useTransform(scrollYProgress, [0, 1], ['2%', '-24%'])
  const scanY = useTransform(scrollYProgress, [0, 1], ['0%', '120%'])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-portfolio-cream text-portfolio-ink transition-colors duration-500 dark:bg-black dark:text-white"
    >
      <ThemeSwitcher />

      <ErrorCircuitGrid playMode="everyTime" reverseOnExit />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-portfolio-accent/25 to-transparent dark:from-white/10"
        style={{ y: scanY }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 top-20 flex whitespace-nowrap text-[14vw] font-black leading-none text-portfolio-accent/[0.14] dark:text-white/[0.04]"
        style={{ x: ghostX }}
      >
        <span className="pr-10">{ghostText}</span>
        <span>{ghostText}</span>
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-24 md:px-10">
        <ViewportMotion trigger="appear" playMode="once" delay={0.05}>
          <p className="mb-6 font-mono text-xs font-black tracking-[0.35em] text-portfolio-ink/45 dark:text-white/40">
            {label}
          </p>
        </ViewportMotion>

        <div className="mb-8 border-l-4 border-portfolio-accent pl-5 dark:border-white md:pl-8">
          <GlitchErrorCode code={code} loop playMode="everyTime" />
        </div>

        <ViewportMotion
          trigger="inView"
          playMode="once"
          delay={0.15}
          className="max-w-2xl"
        >
          <h1 className="mb-4 text-3xl font-black leading-tight md:text-5xl">{title}</h1>
          <p className="text-base font-medium leading-relaxed text-portfolio-ink/70 dark:text-white/65 md:text-lg">
            {description}
          </p>
        </ViewportMotion>

        <ViewportMotion
          trigger="inView"
          playMode="once"
          delay={0.28}
          className="mt-10 flex flex-wrap gap-4"
        >
          <motion.div whileHover={{ y: -4, boxShadow: '10px 10px 0 0 var(--card-hover-shadow)' }}>
            <Link
              href="/"
              className="inline-flex items-center gap-3 border-4 border-portfolio-ink bg-portfolio-accent px-7 py-4 text-sm font-black tracking-wider text-portfolio-ink no-underline transition-colors hover:bg-portfolio-ink hover:text-portfolio-accent dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
              BACK TO HOME
            </Link>
          </motion.div>

          {showRetry && onRetry && (
            <motion.button
              type="button"
              onClick={onRetry}
              whileHover={{ y: -4, boxShadow: '10px 10px 0 0 var(--card-hover-shadow)' }}
              className="inline-flex items-center gap-3 border-4 border-portfolio-ink/30 bg-transparent px-7 py-4 text-sm font-black tracking-wider transition-colors hover:border-portfolio-ink hover:bg-portfolio-ink hover:text-portfolio-cream dark:border-white/30 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
            >
              <RotateCcw className="h-5 w-5" aria-hidden />
              TRY AGAIN
            </motion.button>
          )}
        </ViewportMotion>

        <ViewportMotion
          trigger="inView"
          playMode="everyTime"
          reverseOnExit
          loop
          hidden={{ opacity: 0.2, scaleX: 0 }}
          visible={{ opacity: 1, scaleX: 1 }}
          className="mt-16 origin-left"
        >
          <div className="h-1 max-w-md bg-portfolio-accent dark:bg-white" />
        </ViewportMotion>

        <ViewportMotion trigger="inView" playMode="once" delay={0.4} className="mt-8">
          <p className="font-mono text-[10px] font-bold tracking-[0.4em] text-portfolio-ink/35 dark:text-white/30">
            // MOTION_TRIGGER: IN_VIEW — LOOP: ON — REPLAY: EVERY_TIME
          </p>
        </ViewportMotion>
      </div>
    </section>
  )
}
