'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const backgroundItems = [
  {
    label: 'EDUCATION',
    title: 'Parul University, Vadodara, Gujarat',
    subtitle: 'B.Tech, Computer Science & Engineering (2021-2025)',
  },
  {
    label: 'EXPERIENCE',
    title: 'Yudiz Solutions Pvt. Ltd.',
    subtitle: 'Frontend Developer (January 2025 - Present)',
  },
  {
    label: 'FOCUS',
    title: 'Fast, readable code & AI-assisted workflows',
    subtitle: 'Production-safe interfaces & Motion-led animations',
  },
]

const headingLetters = 'BACKGROUND_'.split('')

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function useElementProgress<T extends HTMLElement>(startOffset = 0.92, endOffset = 0.42) {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const start = viewportHeight * startOffset
      const end = viewportHeight * endOffset
      const nextProgress = clamp((start - rect.top) / Math.max(start - end, 1))

      setProgress(nextProgress)
    }

    const requestUpdate = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [startOffset, endOffset])

  return [ref, progress] as const
}

type BackgroundItem = (typeof backgroundItems)[number]

function BackgroundCard({ item, index }: { item: BackgroundItem; index: number }) {
  const [cardRef, rawProgress] = useElementProgress<HTMLDivElement>(0.94, 0.48)
  const progress = easeOutCubic(rawProgress)
  const startX = index % 2 === 0 ? -120 : 120
  const startRotate = index % 2 === 0 ? -3 : 3
  const endRotate = index === 1 ? 1 : index === 2 ? -1 : 0
  const sideProgress = clamp((progress - 0.12) / 0.88)
  const textProgress = clamp((progress - 0.2) / 0.8)
  const lineProgress = clamp((progress - 0.32) / 0.68)

  return (
    <motion.div
      ref={cardRef}
      data-background-card
      className="group relative lg:pl-14"
      animate={{
        x: lerp(startX, 0, progress),
        y: lerp(80, 0, progress),
        rotate: lerp(startRotate, endRotate, progress),
        opacity: clamp(progress * 1.4),
        scale: lerp(0.94, 1, progress),
      }}
      transition={{ type: 'spring', stiffness: 130, damping: 22, mass: 0.8 }}
    >
      <motion.div
        className="absolute left-[-9px] top-10 hidden h-5 w-5 rounded-full border-4 border-black bg-white lg:block"
        animate={{ scale: sideProgress }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      />
      <motion.div
        className="relative overflow-hidden border-4 border-black bg-white p-8 transform-gpu"
        whileHover={{
          rotate: index % 2 === 0 ? 1 : -1,
          x: 8,
          y: -8,
          boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-2 bg-black"
          animate={{ scaleY: sideProgress }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'top' }}
        />
        <div className="flex items-start justify-between mb-6">
          <motion.div className="text-8xl font-black leading-none" animate={{ scale: lerp(1.35, 1, progress), opacity: 0.2 }}>
            {String(index + 1).padStart(2, '0')}
          </motion.div>
          <div className="text-right">
            <motion.div
              className="text-2xl font-black mb-2 tracking-widest uppercase"
              animate={{ clipPath: `inset(0 ${lerp(100, 0, sideProgress)}% 0 0)` }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.label}
            </motion.div>
            <motion.div
              className="w-16 h-1 bg-black ml-auto"
              animate={{ scaleX: lineProgress }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'right' }}
            />
          </div>
        </div>

        <motion.h3
          className="text-4xl font-black mb-3 group-hover:italic transition-all"
          animate={{ y: lerp(28, 0, textProgress), opacity: textProgress }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {item.title}
        </motion.h3>
        <motion.div
          className="text-2xl font-medium opacity-70"
          animate={{ y: lerp(28, 0, textProgress), opacity: textProgress * 0.7 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {item.subtitle}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function BackgroundContent() {
  const [sectionRef, rawSectionProgress] = useElementProgress<HTMLDivElement>(0.86, 0.18)
  const sectionProgress = easeOutCubic(rawSectionProgress)
  const gridOpacity = sectionProgress < 0.82 ? lerp(0, 0.22, clamp(sectionProgress / 0.18)) : lerp(0.22, 0, clamp((sectionProgress - 0.82) / 0.18))
  const titleVisible = sectionProgress > 0.08

  return (
    <div ref={sectionRef} className="relative w-full overflow-hidden bg-white text-black py-32 min-h-screen">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: gridOpacity,
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.18) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-8 flex whitespace-nowrap text-[18vw] font-black leading-none text-black/5"
        animate={{ x: `${lerp(-8, -42, sectionProgress)}%` }}
        transition={{ type: 'spring', stiffness: 90, damping: 24 }}
      >
        <span>BUILD_SHIP_REFINE_</span>
        <span>BUILD_SHIP_REFINE_</span>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <motion.div
          className="mb-20 overflow-hidden"
          animate={{
            y: lerp(80, 0, sectionProgress),
            rotate: lerp(-4, -1, sectionProgress),
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          <h2 className="flex flex-wrap text-6xl font-black leading-none" aria-label="BACKGROUND_">
            {headingLetters.map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                className="inline-block"
                aria-hidden="true"
                animate={{
                  y: titleVisible ? 0 : 90,
                  rotate: titleVisible ? 0 : 8,
                  opacity: titleVisible ? 1 : 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: titleVisible ? 0.12 + index * 0.055 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h2>
        </motion.div>

        <div className="relative space-y-16">
          <div className="absolute left-0 top-0 hidden h-full w-px bg-black/10 lg:block" />
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-0 hidden h-full w-1 origin-top bg-black lg:block"
            animate={{ scaleY: sectionProgress }}
            transition={{ type: 'spring', stiffness: 90, damping: 24 }}
          />

          {backgroundItems.map((item, index) => (
            <BackgroundCard key={item.label} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function Background() {
  return (
    <section className="-mt-[100vh] relative z-10 w-full bg-white text-black">
      <BackgroundContent />
    </section>
  )
}
