'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

const headingText = '_ABOUT'

const metrics = [
  {
    id: 'projects',
    label: 'PROJECTS COMPLETED',
    value: 4,
    suffix: '+',
    description: 'Shipped from concept to production across web products and interfaces.',
  },
  {
    id: 'experience',
    label: 'YEARS EXPERIENCE',
    value: 2,
    suffix: '+',
    description: 'Building frontend systems with architectural intent and motion craft.',
  },
  {
    id: 'hours',
    label: 'ENGINEERING HOURS',
    value: 500,
    suffix: '+',
    description: 'Judgment refined through real constraints, refactors, and delivery cycles.',
  },
  {
    id: 'ai',
    label: 'AI PROMPTS',
    value: null,
    display: '∞',
    description: 'AI-native workflows for scaffolding, debugging, and creative iteration.',
  },
] as const

function CountUp({
  target,
  active,
  suffix = '',
}: {
  target: number
  active: boolean
  suffix?: string
}) {
  const spring = useSpring(0, { stiffness: 55, damping: 18, mass: 0.8 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    spring.set(active ? target : 0)
  }, [active, spring, target])

  useMotionValueEvent(spring, 'change', (latest) => {
    setDisplay(Math.max(0, Math.round(latest)))
  })

  return (
    <span>
      {display}
      {suffix}
    </span>
  )
}

function AboutHeading({ active }: { active: boolean }) {
  return (
    <div className="mb-12 md:mb-16">
      <motion.p
        className="mb-3 font-mono text-xs font-black tracking-[0.35em] text-portfolio-accent/60 dark:text-white/40"
        initial={{ opacity: 0, x: -16 }}
        animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        // MORE_ABOUT_ME
      </motion.p>

      <h2
        className="-rotate-1 text-4xl font-black sm:text-5xl md:text-7xl"
        aria-label={headingText}
      >
        {headingText.split('').map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block"
            aria-hidden
            initial={{ opacity: 0, y: 40, rotate: 6 }}
            animate={
              active ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 40, rotate: 6 }
            }
            transition={{
              type: 'spring',
              stiffness: 130,
              damping: 15,
              delay: active ? index * 0.04 : 0,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </h2>

      <motion.p
        className="mt-4 max-w-md text-sm font-medium text-white/50"
        initial={{ opacity: 0, y: 10 }}
        animate={active ? { opacity: 0.5, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 0.4, duration: 0.45 }}
      >
        Numbers behind the craft — delivery, depth, and AI-native workflow.
      </motion.p>
    </div>
  )
}

function MetricCell({
  metric,
  index,
  active,
}: {
  metric: (typeof metrics)[number]
  index: number
  active: boolean
}) {
  const isRight = index % 2 === 1
  const isBottom = index >= 2

  return (
    <motion.article
      className={`group relative flex flex-col justify-between p-6 sm:p-8 md:p-10 ${
        isRight ? 'md:border-l-4 md:border-portfolio-accent/40 dark:md:border-white/40' : ''
      } ${isBottom ? 'border-t-4 border-portfolio-accent/40 dark:border-white/40' : ''}`}
      initial={{ opacity: 0, y: 28 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        type: 'spring',
        stiffness: 85,
        damping: 18,
        delay: 0.2 + index * 0.1,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-portfolio-accent transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 dark:bg-white"
      />

      <p className="relative z-10 mb-8 font-mono text-[10px] font-black tracking-[0.28em] text-white/40 transition-colors duration-300 group-hover:text-portfolio-ink dark:group-hover:text-black sm:text-[11px]">
        {metric.label}
      </p>

      <motion.div
        className="relative z-10 mb-6 text-[clamp(3.25rem,10vw,6.5rem)] font-black leading-none tracking-tighter text-portfolio-accent transition-colors duration-300 group-hover:text-portfolio-ink dark:text-white dark:group-hover:text-black"
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        {'display' in metric && metric.display !== undefined ? (
          <motion.span
            animate={
              active
                ? { opacity: [0.75, 1, 0.75] }
                : { opacity: 0.5 }
            }
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {metric.display}
          </motion.span>
        ) : (
          <CountUp
            target={'value' in metric && metric.value !== null ? metric.value : 0}
            suffix={'suffix' in metric ? metric.suffix : ''}
            active={active}
          />
        )}
      </motion.div>

      <p className="relative z-10 max-w-sm text-sm font-medium leading-relaxed text-white/50 transition-colors duration-300 group-hover:text-portfolio-ink/80 dark:group-hover:text-black/75">
        {metric.description}
      </p>
    </motion.article>
  )
}

export function AboutMetrics() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-12% 0px' })
  const gridInView = useInView(gridRef, { once: true, margin: '-10% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const ghostX = useTransform(scrollYProgress, [0, 1], ['2%', '-24%'])
  const headingX = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -12])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0, 0.1, 0.1, 0.03])
  const lineScale = useTransform(scrollYProgress, [0.1, 0.28], [0, 1])

  return (
    <section
      ref={sectionRef}
      className="relative z-20 overflow-hidden border-t-4 border-portfolio-accent bg-portfolio-ink px-6 py-28 text-white transition-colors duration-500 md:px-8 md:py-32 dark:border-white dark:bg-black dark:text-white"
    >
      <motion.div
        aria-hidden
        className="bg-section-grid-projects pointer-events-none absolute inset-0"
        style={{ opacity: gridOpacity }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 top-14 flex whitespace-nowrap text-[16vw] font-black leading-none text-portfolio-accent/[0.1] md:top-10 dark:text-white/[0.03]"
        style={{ x: ghostX }}
      >
        <span className="pr-12">ABOUT_ABOUT_</span>
        <span>ABOUT_ABOUT_</span>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(5rem,24vw,16rem)] font-black uppercase leading-none tracking-tighter text-portfolio-accent/[0.06] dark:text-white/[0.04]"
      >
        ABOUT
      </motion.div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div ref={headingRef} style={{ x: headingX }}>
          <AboutHeading active={headingInView} />
          <motion.div
            className="h-1 max-w-md origin-left bg-portfolio-accent dark:bg-white"
            style={{ scaleX: lineScale }}
          />
        </motion.div>

        <motion.div
          ref={gridRef}
          className="relative mt-12 border-4 border-portfolio-accent md:mt-16 dark:border-white"
          initial={{ opacity: 0, y: 24 }}
          animate={gridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {metrics.map((metric, index) => (
              <MetricCell
                key={metric.id}
                metric={metric}
                index={index}
                active={gridInView}
              />
            ))}
          </div>
        </motion.div>

        <motion.p
          className="mt-8 font-mono text-[10px] font-black tracking-[0.35em] text-portfolio-accent/40 md:mt-10 dark:text-white/30"
          initial={{ opacity: 0 }}
          animate={gridInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          04 METRICS — DELIVERY LED
        </motion.p>
      </div>
    </section>
  )
}
