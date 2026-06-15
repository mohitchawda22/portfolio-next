'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useTheme } from 'next-themes'

const LiquidMetal = dynamic(
  () => import('@paper-design/shaders-react').then((mod) => mod.LiquidMetal),
  { ssr: false }
)

export type LiquidMetalIconRingProps = {
  size?: number
  stroke?: number
  iconSize?: number
  className?: string
}

export function LiquidMetalIconRing({
  size = 60,
  stroke = 6,
  iconSize = 20,
  className = '',
}: LiquidMetalIconRingProps) {
  const reduceMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showControl, setShowControl] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setShowControl(window.scrollY > 72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [reduceMotion])

  const isDark = resolvedTheme === 'dark'

  const ringMask = useMemo(() => {
    const outer = 50
    const inner = Math.max(34, outer - (stroke / size) * 100)
    return `radial-gradient(circle, transparent ${inner}%, black ${inner + 0.5}%, black ${outer}%, transparent ${outer + 0.5}%)`
  }, [size, stroke])

  const metalColors = useMemo(
    () =>
      isDark
        ? { back: '#0a0a0a', tint: '#e2e5ec' }
        : { back: '#f4f0e8', tint: '#9aa3b2' },
    [isDark]
  )

  if (!mounted) {
    return (
      <div
        className={`fixed left-1/2 top-4 z-[9998] -translate-x-1/2 sm:top-5 ${className}`}
        style={{ width: size, height: size }}
        aria-hidden
      />
    )
  }

  return (
    <motion.button
      type="button"
      aria-label="Scroll to top"
      title="Back to top"
      onClick={scrollToTop}
      className={`fixed left-1/2 top-4 z-[9998] -translate-x-1/2 cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-portfolio-accent focus-visible:ring-offset-2 focus-visible:ring-offset-portfolio-cream dark:focus-visible:ring-offset-black sm:top-5 ${className}`}
      initial={false}
      animate={{
        opacity: showControl ? 1 : 0,
        y: showControl ? 0 : -12,
        scale: showControl ? 1 : 0.92,
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: showControl ? 'auto' : 'none' }}
    >
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{
            WebkitMaskImage: ringMask,
            maskImage: ringMask,
          }}
          aria-hidden
        >
          <LiquidMetal
            width={size}
            height={size}
            shape="circle"
            colorBack={metalColors.back}
            colorTint={metalColors.tint}
            speed={reduceMotion ? 0 : 0.4}
            repetition={2.5}
            softness={0.12}
            shiftRed={0.3}
            shiftBlue={0.34}
            distortion={0.075}
            contour={0.42}
            angle={90}
            scale={0.88}
            fit="contain"
            maxPixelCount={65536}
            style={{ width: size, height: size, display: 'block' }}
          />
        </div>

        <span
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-portfolio-cream/90 dark:bg-black/75"
          style={{ width: iconSize + 14, height: iconSize + 14 }}
          aria-hidden
        >
          <ArrowUp
            className="text-portfolio-ink dark:text-white"
            size={iconSize}
            strokeWidth={2.5}
            aria-hidden
          />
        </span>
      </motion.div>
    </motion.button>
  )
}
