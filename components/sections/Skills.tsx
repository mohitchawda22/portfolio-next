'use client'

import { useEffect, useRef, useState } from 'react'
import { useIsDesktop } from '@/lib/use-media-query'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_#@$%&<>/'

const skills = [
  {
    number: '01',
    title: 'FRONTEND',
    tags: [
      'REACT',
      'NEXT.JS',
      'TYPESCRIPT',
      'JAVASCRIPT',
      'HTML5',
      'CSS3',
      'WEB COMPONENTS',
    ],
    barWidth: 94,
  },
  {
    number: '02',
    title: 'STYLING',
    tags: [
      'TAILWIND CSS',
      'SASS',
      'FRAMER MOTION',
      'STYLED COMPONENTS',
      'CSS MODULES',
    ],
    barWidth: 88,
  },
  {
    number: '03',
    title: 'ECOSYSTEM',
    tags: ['REDUX', 'ZUSTAND', 'REACT QUERY', 'VITE', 'WEBPACK', 'NPM'],
    barWidth: 82,
  },
  {
    number: '04',
    title: 'TOOLS & PLATFORMS',
    tags: [
      'GIT',
      'GITHUB',
      'FIGMA',
      'VERCEL',
      'JIRA',
      'RESPONSIVE DESIGN',
      'ACCESSIBILITY',
    ],
    barWidth: 90,
  },
]

const tagVariants: Variants = {
  hidden: { scale: 0, opacity: 0, rotate: -18 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      delay: 0.55 + i * 0.045,
      type: 'spring',
      stiffness: 520,
      damping: 16,
    },
  }),
}

function ScrambleHeading({ text, active }: { text: string; active: boolean }) {
  const [display, setDisplay] = useState(text.replace(/[^\s]/g, '_'))

  useEffect(() => {
    if (!active) return

    let frame = 0
    const totalFrames = 36

    const interval = window.setInterval(() => {
      frame += 1
      const progress = frame / totalFrames

      setDisplay(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            const threshold = index / text.length
            if (progress > threshold + 0.15) return char
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join('')
      )

      if (frame >= totalFrames) {
        setDisplay(text)
        window.clearInterval(interval)
      }
    }, 32)

    return () => window.clearInterval(interval)
  }, [active, text])

  return (
    <span className="relative inline-block font-mono tracking-tighter">
      {display.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          animate={
            active && char === text[index]
              ? { opacity: [0.4, 1, 1], scale: [0.92, 1.06, 1] }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.14, delay: index * 0.02 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

function FlipTitle({ title, active }: { title: string; active: boolean }) {
  return (
    <h3
      className="mb-4 text-2xl font-black sm:text-3xl md:text-4xl"
      style={{ perspective: 800, transformStyle: 'preserve-3d' }}
    >
      {title.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block origin-bottom"
          initial={{ rotateX: 90, opacity: 0, y: 12 }}
          animate={
            active
              ? { rotateX: 0, opacity: 1, y: 0 }
              : { rotateX: 90, opacity: 0, y: 12 }
          }
          transition={{
            delay: 0.12 + index * 0.055,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h3>
  )
}

function SkillBlock({
  skill,
  index,
  inView,
  barProgress,
}: {
  skill: (typeof skills)[number]
  index: number
  inView: boolean
  barProgress: MotionValue<number>
}) {
  const blockRef = useRef<HTMLDivElement>(null)
  const blockInView = useInView(blockRef, { once: true, margin: '-12% 0px' })
  const show = inView && blockInView
  const barScale = useTransform(
    barProgress,
    (value) => (value * skill.barWidth) / 100
  )

  return (
    <motion.div
      ref={blockRef}
      className="group relative"
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.2, delay: index * 0.12 }}
    >
      <span
        className="pointer-events-none absolute left-0 top-0 select-none text-[clamp(3rem,18vw,9rem)] font-black leading-none text-black/[0.04] sm:-left-2 md:-left-6"
        aria-hidden
      >
        {skill.number}
      </span>

      <div className="relative overflow-hidden border-4 border-portfolio-ink bg-portfolio-cream p-6 dark:border-black dark:bg-white md:p-8">
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 bg-portfolio-accent dark:bg-black"
          initial={{ scaleX: 1, originX: 0 }}
          animate={show ? { scaleX: 0 } : { scaleX: 1 }}
          transition={{
            duration: 0.75,
            delay: index * 0.12,
            ease: [0.77, 0, 0.175, 1],
          }}
        />

        <motion.div
          className="pointer-events-none absolute inset-y-0 z-20 w-[3px] bg-portfolio-ink mix-blend-difference dark:bg-white"
          initial={{ left: '0%' }}
          animate={show ? { left: '100%' } : { left: '0%' }}
          transition={{
            duration: 0.75,
            delay: index * 0.12,
            ease: [0.77, 0, 0.175, 1],
          }}
        />

        <div className="relative z-0">
          <FlipTitle title={skill.title} active={show} />

          <div className="mb-5 flex flex-wrap gap-2">
            {skill.tags.map((tag, tagIndex) => (
              <motion.span
                key={tag}
                custom={tagIndex}
                variants={tagVariants}
                initial="hidden"
                animate={show ? 'visible' : 'hidden'}
                whileHover={{
                  scale: 1.08,
                  backgroundColor: 'var(--card-hover-bg)',
                  color: 'var(--card-hover-fg)',
                  boxShadow: '4px 4px 0px 0px var(--card-hover-shadow)',
                  transition: { type: 'spring', stiffness: 500, damping: 18 },
                }}
                whileTap={{ scale: 1.02 }}
                className="cursor-default border-2 border-portfolio-ink px-3 py-1 text-xs font-black tracking-wider dark:border-black md:text-sm"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden border-2 border-portfolio-ink bg-portfolio-cream dark:border-black dark:bg-white">
              <motion.div
                className="h-full origin-left bg-portfolio-accent dark:bg-black"
                style={{ scaleX: barScale }}
              />
            </div>
            <motion.span
              className="min-w-[3ch] font-mono text-xs font-black"
              initial={{ opacity: 0 }}
              animate={show ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              {skill.barWidth}%
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const isDesktop = useIsDesktop()
  const headingInView = useInView(sectionRef, { once: true, margin: '-15% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const leftY = useTransform(scrollYProgress, [0, 1], [48, -72])
  const rightY = useTransform(scrollYProgress, [0, 1], [-48, 72])
  const scanLineY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const bar0 = useTransform(scrollYProgress, [0.08, 0.35], [0, 1])
  const bar1 = useTransform(scrollYProgress, [0.12, 0.4], [0, 1])
  const bar2 = useTransform(scrollYProgress, [0.16, 0.45], [0, 1])
  const bar3 = useTransform(scrollYProgress, [0.2, 0.5], [0, 1])
  const barProgresses = [bar0, bar1, bar2, bar3]

  return (
    <section
      ref={sectionRef}
      className="relative z-20 overflow-hidden border-t-4 border-portfolio-accent bg-portfolio-lime px-6 py-24 text-portfolio-ink transition-colors duration-500 sm:py-28 md:px-8 md:py-32 dark:border-black dark:bg-white dark:text-black"
    >
      <motion.div
        className="pointer-events-none absolute left-0 right-0 h-px bg-black/10"
        style={{ top: scanLineY }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, #000 0, #000 1px, transparent 1px, transparent 12px)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24">
          <p className="mb-3 font-mono text-xs font-black tracking-[0.35em] opacity-40">
            // LOAD_MODULE
          </p>
          <h2 className="-rotate-2 text-4xl font-black sm:text-5xl md:text-7xl">
            <ScrambleHeading text="SKILLS_" active={headingInView} />
          </h2>
          <motion.div
            className="mt-6 flex items-center gap-2 font-mono text-xs font-bold opacity-50"
            initial={{ opacity: 0, x: -20 }}
            animate={headingInView ? { opacity: 0.5, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <motion.span
              animate={headingInView ? { opacity: [1, 0.2, 1] } : { opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              █
            </motion.span>
            INITIALIZING STACK...
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <motion.div style={{ y: isDesktop ? leftY : 0 }} className="space-y-8 md:space-y-10">
            {skills.slice(0, 2).map((skill, index) => (
              <SkillBlock
                key={skill.title}
                skill={skill}
                index={index}
                inView={headingInView}
                barProgress={barProgresses[index]}
              />
            ))}
          </motion.div>

          <motion.div
            style={{ y: isDesktop ? rightY : 0 }}
            className="space-y-8 pt-0 md:space-y-10 md:pt-28"
          >
            {skills.slice(2).map((skill, index) => (
              <SkillBlock
                key={skill.title}
                skill={skill}
                index={index + 2}
                inView={headingInView}
                barProgress={barProgresses[index + 2]}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
