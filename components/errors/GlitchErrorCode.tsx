'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const GLYPHS = '█▓░01X/?#@'

type GlitchErrorCodeProps = {
  code: string
  loop?: boolean
  playMode?: 'once' | 'everyTime'
}

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

export function GlitchErrorCode({
  code,
  loop = true,
  playMode = 'everyTime',
}: GlitchErrorCodeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, {
    once: playMode === 'once',
    amount: 0.4,
  })
  const [display, setDisplay] = useState(() => code.split('').map(() => randomGlyph()))
  const targets = useMemo(() => code.split(''), [code])

  useEffect(() => {
    if (!inView) return

    let frame = 0
    const settleFrames = 28
    const interval = window.setInterval(() => {
      frame += 1
      const progress = Math.min(1, frame / settleFrames)

      setDisplay(
        targets.map((char, index) => {
          const threshold = (index + 1) / targets.length
          if (progress >= threshold) return char
          return randomGlyph()
        })
      )

      if (frame >= settleFrames) {
        window.clearInterval(interval)
        setDisplay(targets)
      }
    }, 45)

    return () => window.clearInterval(interval)
  }, [inView, targets])

  useEffect(() => {
    if (!inView || !loop) return

    const flicker = window.setInterval(() => {
      setDisplay((current) =>
        current.map((char, index) =>
          Math.random() > 0.92 ? randomGlyph() : targets[index] ?? char
        )
      )
      window.setTimeout(() => setDisplay(targets), 80)
    }, 2400)

    return () => window.clearInterval(flicker)
  }, [inView, loop, targets])

  return (
    <div ref={ref} className="relative flex items-center justify-center gap-1 md:gap-2">
      {display.map((char, index) => (
        <motion.span
          key={`${code}-${index}`}
          className="inline-block font-mono text-[clamp(4.5rem,18vw,11rem)] font-black leading-none tabular-nums"
          initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -4 : 4 }}
          animate={
            inView
              ? { opacity: 1, y: 0, rotate: 0 }
              : { opacity: 0, y: 40, rotate: index % 2 === 0 ? -4 : 4 }
          }
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 16,
            delay: index * 0.08,
          }}
        >
          {char}
        </motion.span>
      ))}

      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-difference"
        animate={{ x: ['-4%', '4%', '-2%', '0%'], opacity: [0, 0.35, 0, 0.2, 0] }}
        transition={{
          duration: 0.45,
          repeat: loop ? Infinity : 0,
          repeatDelay: 3.2,
          ease: 'linear',
        }}
      >
        <span className="block text-[clamp(4.5rem,18vw,11rem)] font-black leading-none text-portfolio-accent opacity-80 dark:text-white">
          {code}
        </span>
      </motion.span>
    </div>
  )
}
