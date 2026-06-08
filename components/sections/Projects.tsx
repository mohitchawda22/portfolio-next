'use client'

import { useRef } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'

type Reveal = {
  x: number
  y: number
  rotate: number
  origin: string
}

const projects = [
  {
    number: '01',
    title: 'CLUBMATCH',
    description:
      'DYNAMIC PLATFORM SERVING COMMUNITIES WITH REAL-TIME INTERACTIONS AND SEAMLESS MATCHING',
    tech: ['REACT', 'TAILWIND', 'REACT QUERY'],
    href: 'https://clubmatch.co.uk',
    className: 'md:col-span-7 md:row-span-2 min-h-[220px] sm:min-h-[260px] md:min-h-0',
    titleClass: 'text-2xl sm:text-3xl md:text-4xl',
    descClass: 'text-base md:text-lg',
    padding: 'p-6 md:p-8',
    icon: 'external' as const,
    reveal: { x: -220, y: 150, rotate: -7, origin: '0% 100%' },
  },
  {
    number: '02',
    title: 'ZADWALLETS',
    description: 'SECURE WALLET PLATFORM WITH REAL-TIME TRANSACTIONS',
    tech: ['REACT', 'TAILWIND', 'WEB3', 'JAVASCRIPT'],
    href: 'https://zadwallets.com',
    className: 'md:col-span-5 min-h-[180px] sm:min-h-[200px]',
    titleClass: 'text-xl sm:text-2xl',
    descClass: 'text-sm',
    padding: 'p-6',
    icon: 'external' as const,
    reveal: { x: 240, y: 110, rotate: 5, origin: '100% 0%' },
  },
  {
    number: '03',
    title: 'THREADSTONE',
    description: null,
    tech: ['REACT', 'TAILWIND', 'INTERACTIVE UI'],
    href: 'https://threadstone.com',
    className: 'md:col-span-3 min-h-[160px] sm:min-h-[180px]',
    titleClass: 'text-lg sm:text-xl',
    descClass: '',
    padding: 'p-6',
    icon: 'external' as const,
    reveal: { x: 60, y: 190, rotate: -3.5, origin: '50% 100%' },
  },
  {
    number: '04',
    title: 'INTERACTIVE PORTFOLIO',
    description: null,
    tech: ['NEXT.JS', 'TYPESCRIPT', 'TAILWIND', 'FRAMER MOTION'],
    href: 'https://mohit-portfolio-ruby.vercel.app/',
    className: 'md:col-span-9 min-h-[150px] sm:min-h-[160px]',
    titleClass: 'text-xl sm:text-2xl md:text-3xl',
    descClass: '',
    padding: 'p-6',
    icon: 'arrow' as const,
    reveal: { x: -170, y: 120, rotate: 2.5, origin: '0% 50%' },
  },
] as const

const headingText = '_PROJECTS'

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
}

const cardVariants: Variants = {
  hidden: (custom: Reveal) => ({
    opacity: 0,
    x: custom.x,
    y: custom.y,
    rotate: custom.rotate,
    scale: 0.88,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 18,
      mass: 0.9,
    },
  },
}

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.28,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function ProjectsHeading({ active }: { active: boolean }) {
  return (
    <div className="mb-10 text-left md:mb-16 md:text-right">
      <motion.p
        className="mb-3 font-mono text-xs font-black tracking-[0.3em] text-white/40"
        initial={{ opacity: 0, x: 20 }}
        animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        // SELECTED_WORK
      </motion.p>

      <h2
        className="rotate-1 text-4xl font-black sm:text-5xl md:text-6xl"
        aria-label={headingText}
      >
        {headingText.split('').map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block"
            aria-hidden
            initial={{ opacity: 0, y: 44, rotate: 7 }}
            animate={
              active ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 44, rotate: 7 }
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
        className="ml-auto mt-4 max-w-sm text-sm font-medium text-white/50"
        initial={{ opacity: 0, y: 10 }}
        animate={active ? { opacity: 0.5, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 0.45, duration: 0.45 }}
      >
        Shipped products, experiments, and interfaces in motion.
      </motion.p>
    </div>
  )
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const isWide = project.number === '01' || project.number === '04'
  const isExternal = project.href.startsWith('http')

  return (
    <motion.div
      custom={project.reveal}
      variants={cardVariants}
      style={{ transformOrigin: project.reveal.origin }}
      className={`h-full transform-gpu ${project.className}`}
    >
      <motion.a
        href={project.href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        aria-label={`Open ${project.title} project`}
        className={`group relative flex h-full flex-col justify-between overflow-hidden border-4 border-portfolio-accent bg-portfolio-cream text-portfolio-ink no-underline dark:border-white dark:bg-white dark:text-black ${project.padding}`}
        whileHover={{
          y: -6,
          backgroundColor: 'var(--card-hover-bg)',
          color: 'var(--card-hover-fg)',
          boxShadow: '14px 14px 0px 0px var(--card-hover-shadow)',
          transition: { type: 'spring', stiffness: 360, damping: 22 },
        }}
        whileTap={{ scale: 0.98, y: -2 }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-1 -top-2 select-none font-black leading-none text-black/10 transition-colors duration-300 group-hover:text-white/10"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 6.5rem)' }}
        >
          {project.number}
        </span>

        <div
          className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-portfolio-ink opacity-25 transition-colors duration-300 group-hover:opacity-60 dark:border-black dark:group-hover:border-white"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-portfolio-ink opacity-25 transition-colors duration-300 group-hover:opacity-60 dark:border-black dark:group-hover:border-white"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-portfolio-accent transition-transform duration-500 group-hover:scale-x-100 dark:bg-black dark:group-hover:bg-white"
          aria-hidden
        />

        <motion.div
          variants={contentVariants}
          className="relative z-10 flex h-full flex-col justify-between"
        >
          <div>
            <div className="mb-3 font-mono text-[10px] font-black tracking-[0.25em] opacity-45 md:text-xs">
              {project.number}
            </div>

            <h3
              className={`${project.titleClass} mb-3 font-black leading-tight md:mb-4`}
            >
              {project.title}
            </h3>

            {project.description && (
              <p
                className={`${project.descClass} mb-5 max-w-2xl font-medium opacity-80 md:mb-6`}
              >
                {project.description}
              </p>
            )}
          </div>

          <div
            className={`mt-auto flex gap-3 ${isWide ? 'flex-col sm:flex-row sm:items-end sm:justify-between' : 'flex-col'}`}
          >
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((tag) => (
                <span
                  key={tag}
                  className="border border-portfolio-ink/20 px-2 py-0.5 text-[10px] font-black tracking-wider dark:border-black/20 md:text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {project.icon === 'external' && (
              <motion.span
                className="shrink-0 self-end"
                whileHover={{ rotate: 45, scale: 1.12 }}
                transition={{ type: 'spring', stiffness: 420, damping: 16 }}
              >
                <ExternalLink className="h-5 w-5 md:h-6 md:w-6" aria-hidden />
              </motion.span>
            )}

            {project.icon === 'arrow' && (
              <motion.span
                className="shrink-0 self-end"
                whileHover={{ x: 8 }}
                transition={{ type: 'spring', stiffness: 420, damping: 16 }}
              >
                <ArrowRight className="h-7 w-7 md:h-8 md:w-8" aria-hidden />
              </motion.span>
            )}
          </div>
        </motion.div>
      </motion.a>
    </motion.div>
  )
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-12% 0px' })
  const gridInView = useInView(gridRef, { once: true, margin: '-8% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const headingX = useTransform(scrollYProgress, [0, 0.5, 1], [28, 0, -16])
  const lineScale = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const ghostX = useTransform(scrollYProgress, [0, 1], ['4%', '-28%'])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0, 0.12, 0.12, 0.04])
  const metaOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1])

  return (
    <section
      ref={sectionRef}
      className="relative z-20 overflow-hidden bg-portfolio-ink px-6 py-28 text-white transition-colors duration-500 md:px-8 md:py-32 dark:bg-black dark:text-white"
    >
      <motion.div
        aria-hidden
        className="bg-section-grid-projects pointer-events-none absolute inset-0"
        style={{ opacity: gridOpacity }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 top-16 flex whitespace-nowrap text-[15vw] font-black leading-none text-portfolio-accent/[0.12] md:top-10 dark:text-white/[0.035]"
        style={{ x: ghostX }}
      >
        <span className="pr-12">BUILD_LAUNCH_SHIP_</span>
        <span>BUILD_LAUNCH_SHIP_</span>
      </motion.div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div ref={headingRef} style={{ x: headingX }}>
          <ProjectsHeading active={headingInView} />
          <motion.div
            className="ml-auto mt-6 h-1 w-full max-w-md origin-right bg-portfolio-accent dark:bg-white"
            style={{ scaleX: lineScale }}
          />
        </motion.div>

        <motion.p
          className="mb-6 font-mono text-[10px] font-black tracking-[0.35em] text-portfolio-accent/50 md:mb-8 md:text-xs dark:text-white/30"
          style={{ opacity: metaOpacity }}
        >
          04 ENTRIES — BENTO GRID
        </motion.p>

        <motion.div
          ref={gridRef}
          variants={gridVariants}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-3 md:min-h-screen md:grid-cols-12 md:gap-4"
        >
          {projects.map((project) => (
            <ProjectCard key={project.number} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
