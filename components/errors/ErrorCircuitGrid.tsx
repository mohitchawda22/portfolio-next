'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

type ErrorCircuitGridProps = {
  playMode?: 'once' | 'everyTime'
  reverseOnExit?: boolean
}

function buildSegments(width: number, height: number) {
  const cols = Math.max(8, Math.floor(width / 72))
  const rows = Math.max(6, Math.floor(height / 72))
  const cellW = width / cols
  const cellH = height / rows
  const segments: string[] = []

  for (let row = 0; row <= rows; row += 1) {
    for (let col = 0; col <= cols; col += 1) {
      const x = col * cellW
      const y = row * cellH
      const jitterX = (Math.sin(row * 1.7 + col) * 0.5 + 0.5) * cellW * 0.35
      const jitterY = (Math.cos(col * 1.3 + row) * 0.5 + 0.5) * cellH * 0.35

      if (col < cols && (row + col) % 2 === 0) {
        segments.push(`M ${x} ${y} L ${x + cellW} ${y + jitterY}`)
      }
      if (row < rows && (row + col) % 3 !== 0) {
        segments.push(`M ${x} ${y} L ${x + jitterX} ${y + cellH}`)
      }
      if ((row + col) % 5 === 0 && col < cols && row < rows) {
        segments.push(`M ${x + cellW * 0.2} ${y + cellH * 0.2} L ${x + cellW * 0.8} ${y + cellH * 0.8}`)
      }
    }
  }

  return segments
}

export function ErrorCircuitGrid({
  playMode = 'everyTime',
  reverseOnExit = true,
}: ErrorCircuitGridProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, {
    once: playMode === 'once',
    amount: 0.2,
  })

  const [paths, setPaths] = useState<string[]>([])

  useEffect(() => {
    const update = () => {
      setPaths(buildSegments(window.innerWidth, window.innerHeight))
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const isDrawing = reverseOnExit ? inView : inView || playMode === 'once'

  return (
    <svg
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      {paths.map((d, index) => (
        <motion.path
          key={index}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className="text-portfolio-ink/[0.08] dark:text-white/[0.07]"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isDrawing
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            pathLength: {
              duration: 1.4,
              delay: (index % 24) * 0.02,
              ease: [0.22, 1, 0.36, 1],
            },
            opacity: { duration: 0.3, delay: (index % 24) * 0.02 },
          }}
        />
      ))}
    </svg>
  )
}
