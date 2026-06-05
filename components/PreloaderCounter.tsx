'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValueEvent, useSpring } from 'framer-motion'
import type { PreloaderTheme } from '@/lib/preloader-theme'

const DIGIT_PX = 80

type PreloaderCounterProps = {
  value: number
  theme: PreloaderTheme
  visible?: boolean
}

function DigitColumn({ digit, color }: { digit: number; color: string }) {
  const safeDigit = Math.min(9, Math.max(0, digit))

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: DIGIT_PX, width: DIGIT_PX * 0.72 }}
    >
      <motion.div
        className="flex flex-col will-change-transform"
        initial={false}
        animate={{ y: -safeDigit * DIGIT_PX }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center justify-center font-mono text-[4.5rem] font-black leading-none tabular-nums md:text-[5rem]"
            style={{
              color,
              height: DIGIT_PX,
              width: DIGIT_PX * 0.72,
            }}
          >
            {i}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function PreloaderCounter({
  value,
  theme,
  visible = true,
}: PreloaderCounterProps) {
  const spring = useSpring(0, {
    stiffness: 55,
    damping: 18,
    mass: 0.85,
  })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    spring.set(Math.min(100, Math.max(0, value)))
  }, [spring, value])

  useMotionValueEvent(spring, 'change', (latest) => {
    setDisplayValue(Math.min(100, Math.max(0, Math.round(latest))))
  })

  const tens = Math.floor((displayValue % 100) / 10)
  const ones = displayValue % 10

  return (
    <motion.div
      className="relative isolate flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.98,
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="flex items-center gap-0.5 md:gap-1"
        layout
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        role="status"
        aria-live="polite"
        aria-label={`Loading ${displayValue} percent`}
      >
        {displayValue >= 100 ? (
          <>
            <DigitColumn digit={1} color={theme.counter} />
            <DigitColumn digit={0} color={theme.counter} />
            <DigitColumn digit={0} color={theme.counter} />
          </>
        ) : (
          <>
            <DigitColumn digit={tens} color={theme.counter} />
            <DigitColumn digit={ones} color={theme.counter} />
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
