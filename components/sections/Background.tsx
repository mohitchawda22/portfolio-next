'use client'

import { useRef } from 'react'
import {
  motion,
  useInView,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

const backgroundItems = [
  {
    label: 'EDUCATION',
    period: '2021 — 2025',
    title: 'Parul University, Vadodara, Gujarat',
    subtitle: 'B.Tech, Computer Science & Engineering',
  },
  {
    label: 'EXPERIENCE',
    period: '2025 — PRESENT',
    title: 'Yudiz Solutions Pvt. Ltd.',
    subtitle: 'Frontend Developer',
  },
  {
    label: 'FOCUS',
    period: 'ONGOING',
    title: 'Fast, readable code & AI-assisted workflows',
    subtitle: 'Production-safe interfaces & motion-led animations',
  },
] as const

const headingText = 'BACKGROUND_'

function useSmooth(value: MotionValue<number>, stiffness = 88, damping = 22) {
  return useSpring(value, { stiffness, damping, mass: 0.45 })
}

function BackgroundCard({
  item,
  index,
}: {
  item: (typeof backgroundItems)[number]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 0.9', 'start 0.35'],
  })
  const progress = useSmooth(scrollYProgress)

  const fromLeft = index % 2 === 0
  const x = useTransform(progress, [0, 1], [fromLeft ? -88 : 88, 0])
  const y = useTransform(progress, [0, 1], [56, 0])
  const opacity = useTransform(progress, [0, 0.2, 1], [0, 0.55, 1])
  const scale = useTransform(progress, [0, 1], [0.965, 1])
  const rotate = useTransform(
    progress,
    [0, 1],
    [fromLeft ? -2.2 : 2.2, index === 1 ? 0.4 : index === 2 ? -0.4 : 0]
  )

  const labelReveal = useTransform(progress, [0.12, 0.52], [100, 0])
  const labelClip = useMotionTemplate`inset(0 ${labelReveal}% 0 0)`
  const lineScale = useTransform(progress, [0.22, 0.62], [0, 1])
  const textY = useTransform(progress, [0.18, 0.68], [22, 0])
  const textOpacity = useTransform(progress, [0.18, 0.62], [0, 1])
  const subtitleOpacity = useTransform(textOpacity, (value) => value * 0.75)
  const accentScale = useTransform(progress, [0.08, 0.45], [0, 1])
  const dotScale = useTransform(progress, [0.05, 0.38], [0, 1])
  const numberOpacity = useTransform(progress, [0, 0.5], [0.06, 0.14])

  return (
    <motion.div
      ref={cardRef}
      style={{ x, y, opacity, scale, rotate }}
      className="group relative pl-0 lg:pl-14"
    >
      <motion.div
        className="absolute -left-[5px] top-11 z-10 hidden h-3 w-3 rounded-full border-[3px] border-portfolio-ink bg-portfolio-accent lg:block dark:border-black dark:bg-white"
        style={{ scale: dotScale }}
      />

      <motion.div
        className="relative overflow-hidden border-4 border-portfolio-ink bg-portfolio-cream p-6 shadow-none transition-shadow hover:shadow-[14px_14px_0_0_#E3FF47] dark:border-black dark:bg-white dark:hover:shadow-[14px_14px_0_0_rgba(0,0,0,1)] md:p-8"
        whileHover={{
          x: 6,
          y: -6,
          rotate: fromLeft ? 0.6 : -0.6,
          transition: { type: 'spring', stiffness: 320, damping: 20 },
        }}
      >
        <motion.div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1.5 bg-portfolio-accent dark:bg-black"
          style={{ scaleY: accentScale, transformOrigin: 'top' }}
        />

        <motion.span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-4 select-none font-black leading-none text-black md:-right-4 md:-top-6"
          style={{ opacity: numberOpacity, fontSize: 'clamp(4rem, 14vw, 7rem)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>

        <div className="relative mb-6 flex items-start justify-between gap-4">
          <motion.span
            className="shrink-0 border-2 border-portfolio-ink px-2 py-1 font-mono text-[10px] font-black tracking-widest dark:border-black md:text-xs"
            style={{ opacity: textOpacity, y: textY }}
          >
            {item.period}
          </motion.span>

          <div className="min-w-0 text-right">
            <motion.div
              className="mb-2 text-xl font-black tracking-widest md:text-2xl"
              style={{ clipPath: labelClip }}
            >
              {item.label}
            </motion.div>
            <motion.div
              className="ml-auto h-1 w-14 bg-portfolio-ink md:w-16 dark:bg-black"
              style={{ scaleX: lineScale, transformOrigin: 'right' }}
            />
          </div>
        </div>

        <motion.h3
          className="mb-2 text-2xl font-black leading-tight group-hover:italic md:text-4xl"
          style={{ y: textY, opacity: textOpacity }}
        >
          {item.title}
        </motion.h3>
        <motion.p
          className="text-base font-medium md:text-xl"
          style={{ y: textY, opacity: subtitleOpacity }}
        >
          {item.subtitle}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

function BackgroundHeading({ active }: { active: boolean }) {
  return (
    <div className="mb-16 md:mb-20">
      <motion.p
        className="mb-3 font-mono text-xs font-black tracking-[0.3em] text-black/40"
        initial={{ opacity: 0, x: -16 }}
        animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        // TIMELINE
      </motion.p>

      <h2
        className="flex flex-wrap text-5xl font-black leading-[0.95] md:text-6xl"
        aria-label={headingText}
      >
        {headingText.split('').map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            className="inline-block"
            aria-hidden
            initial={{ y: 72, rotate: 6, opacity: 0 }}
            animate={
              active
                ? { y: 0, rotate: 0, opacity: 1 }
                : { y: 72, rotate: 6, opacity: 0 }
            }
            transition={{
              duration: 0.65,
              delay: active ? 0.08 + index * 0.045 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {letter}
          </motion.span>
        ))}
      </h2>

      <motion.p
        className="mt-4 max-w-md text-sm font-medium opacity-50 md:text-base"
        initial={{ opacity: 0, y: 12 }}
        animate={active ? { opacity: 0.5, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ delay: 0.55, duration: 0.5 }}
      >
        Education, experience, and the craft behind the work.
      </motion.p>
    </div>
  )
}

export function Background() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-12% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const sectionProgress = useSmooth(scrollYProgress, 70, 26)

  const gridOpacity = useTransform(sectionProgress, [0, 0.2, 0.75, 1], [0, 0.18, 0.18, 0.06])
  const marqueeX = useTransform(sectionProgress, [0, 1], ['-6%', '-38%'])
  const headingY = useTransform(sectionProgress, [0, 0.35], [48, 0])
  const headingRotate = useTransform(sectionProgress, [0, 0.35], [-3, -1])
  const timelineScale = useTransform(sectionProgress, [0.08, 0.85], [0, 1])
  const ruleScale = useTransform(sectionProgress, [0.05, 0.25], [0, 1])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 -mt-[100vh] w-full bg-portfolio-sand text-portfolio-ink transition-colors duration-500 dark:bg-white dark:text-black"
    >
      <div className="relative min-h-screen overflow-hidden py-28 md:py-32">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: gridOpacity,
            backgroundImage:
              'linear-gradient(to right, rgba(0,0,0,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.14) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-12 flex whitespace-nowrap text-[16vw] font-black leading-none text-black/[0.04] md:top-8 md:text-[14vw]"
          style={{ x: marqueeX }}
        >
          <span className="pr-16">BUILD_SHIP_REFINE_</span>
          <span>BUILD_SHIP_REFINE_</span>
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-8">
          <motion.div
            ref={headingRef}
            style={{ y: headingY, rotate: headingRotate }}
          >
            <BackgroundHeading active={headingInView} />
            <motion.div
              className="h-1 max-w-sm origin-left bg-portfolio-accent dark:bg-black"
              style={{ scaleX: ruleScale }}
            />
          </motion.div>

          <div className="relative space-y-12 md:space-y-16">
            <div
              className="absolute left-0 top-0 hidden h-full w-px bg-black/10 lg:block"
              aria-hidden
            />
            <motion.div
              aria-hidden
              className="absolute left-0 top-0 hidden h-full w-0.5 origin-top bg-black lg:block"
              style={{ scaleY: timelineScale }}
            />

            {backgroundItems.map((item, index) => (
              <BackgroundCard key={item.label} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
