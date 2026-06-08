'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowUpRight, Bot, Sparkles, Terminal } from 'lucide-react'
import { useMediaQuery } from '@/lib/use-media-query'
import { SkillsGrid } from '@/components/sections/Skills'

const QUOTE =
  'THE FUNCTION OF GOOD SOFTWARE IS TO MAKE THE COMPLEX APPEAR TO BE SIMPLE.'
const QUOTE_WORDS = QUOTE.split(' ')

const aiTools = [
  'CURSOR',
  'GITHUB COPILOT',
  'CLAUDE',
  'CHATGPT',
  'V0',
  'FIGMA AI',
  'NOTION AI',
  'LINEAR',
] as const

const aiWorkflows = [
  {
    id: 'build',
    title: 'AI-ASSISTED BUILD',
    description:
      'Pair-program with agents to scaffold UI, refactor safely, and ship features faster without losing craft.',
    items: [
      'CURSOR AGENT',
      'INLINE COMPLETIONS',
      'CONTEXT RULES',
      'MULTI-FILE EDITS',
      'TEST GENERATION',
    ],
  },
  {
    id: 'design',
    title: 'DESIGN TO CODE',
    description:
      'Turn layouts, motion specs, and references into production React with tight design-system alignment.',
    items: [
      'V0 PROTOTYPES',
      'FIGMA AI',
      'PROMPT ENGINEERING',
      'COMPONENT SYSTEMS',
      'MOTION SPECS',
    ],
  },
  {
    id: 'ship',
    title: 'SHIP & ITERATE',
    description:
      'Debug, document, and optimize with LLM workflows — then validate everything in real browsers.',
    items: [
      'CODE REVIEW',
      'PERF AUDITS',
      'DOCS & README',
      'REFACTOR PASSES',
      'CI FIXES',
    ],
  },
] as const

const promptLines = [
  '> analyze hero scroll split + preloader timing',
  '> generate brutalist error page with viewport motion',
  '> refactor skills section — hover reveal, no click',
  '> simplify complex UI into clean motion system_',
]

function QuoteWord({
  word,
  index,
  active,
}: {
  word: string
  index: number
  active: boolean
}) {
  return (
    <span className="inline-block overflow-hidden align-top">
      <motion.span
        className="inline-block will-change-transform"
        initial={{ y: '108%', rotate: 4, filter: 'blur(6px)' }}
        animate={
          active
            ? { y: '0%', rotate: 0, filter: 'blur(0px)' }
            : { y: '108%', rotate: 4, filter: 'blur(6px)' }
        }
        transition={{
          type: 'spring',
          stiffness: 140,
          damping: 18,
          mass: 0.7,
          delay: 0.08 + index * 0.045,
        }}
      >
        {word}
      </motion.span>
    </span>
  )
}

function ComplexityLine({ progress }: { progress: MotionValue<number> }) {
  const chaosOpacity = useTransform(progress, [0, 0.55, 1], [1, 0.4, 0])
  const cleanOpacity = useTransform(progress, [0.35, 0.75, 1], [0, 0.6, 1])
  const drawWidth = useTransform(progress, [0, 1], ['0%', '100%'])

  return (
    <div className="relative mt-10 h-8 w-full max-w-xl overflow-hidden md:mt-14">
      <motion.div className="absolute inset-0" style={{ width: drawWidth }}>
        <motion.svg
          viewBox="0 0 400 32"
          className="h-full w-full"
          preserveAspectRatio="none"
          style={{ opacity: chaosOpacity }}
          aria-hidden
        >
          <path
            d="M0 20 C40 4, 80 28, 120 12 S200 26, 240 10 S320 24, 400 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-portfolio-ink/25 dark:text-white/20"
          />
        </motion.svg>
        <motion.svg
          viewBox="0 0 400 32"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          style={{ opacity: cleanOpacity }}
          aria-hidden
        >
          <path
            d="M0 18 L400 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-portfolio-accent dark:text-white"
          />
        </motion.svg>
      </motion.div>
    </div>
  )
}

function AIPromptTerminal({ active }: { active: boolean }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (!active) return

    const line = promptLines[lineIndex]
    if (charIndex < line.length) {
      const timeout = window.setTimeout(() => setCharIndex((value) => value + 1), 22)
      return () => window.clearTimeout(timeout)
    }

    const timeout = window.setTimeout(() => {
      setLineIndex((value) => (value + 1) % promptLines.length)
      setCharIndex(0)
    }, 1800)

    return () => window.clearTimeout(timeout)
  }, [active, charIndex, lineIndex])

  const currentLine = promptLines[lineIndex].slice(0, charIndex)

  return (
    <motion.div
      className="mt-8 border-2 border-portfolio-ink/15 bg-portfolio-ink/[0.03] p-4 font-mono text-[11px] leading-relaxed dark:border-white/15 dark:bg-white/[0.04] sm:mt-10 sm:p-5 sm:text-xs"
      initial={{ opacity: 0, y: 12 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ delay: 0.9, duration: 0.5 }}
    >
      <div className="mb-3 flex items-center gap-2 text-portfolio-ink/45 dark:text-white/40">
        <Terminal className="h-3.5 w-3.5" aria-hidden />
        <span className="font-black tracking-[0.25em]">AI_WORKFLOW.LOG</span>
      </div>
      <p className="text-portfolio-ink/80 dark:text-white/75">
        {currentLine}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.9 }}
          className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-portfolio-accent dark:bg-white"
          aria-hidden
        />
      </p>
    </motion.div>
  )
}

function AIMarquee({ active }: { active: boolean }) {
  const [paused, setPaused] = useState(false)
  const controls = useAnimationControls()
  const items = [...aiTools, ...aiTools]

  useEffect(() => {
    if (!active || paused) {
      controls.stop()
      return
    }

    void controls.start({
      x: ['0%', '-50%'],
      transition: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 24,
        ease: 'linear',
      },
    })
  }, [active, controls, paused])

  return (
    <motion.div
      className="relative overflow-hidden bg-portfolio-ink py-5 text-white dark:bg-white dark:text-black"
      initial={{ scaleY: 0, opacity: 0 }}
      animate={active ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.77, 0, 0.175, 1] }}
      style={{ transformOrigin: 'top' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-portfolio-ink to-transparent dark:from-white" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-portfolio-ink to-transparent dark:from-white" />

      <motion.div className="flex w-max items-center gap-8 px-6 sm:gap-12 sm:px-10" animate={controls}>
        {items.map((tool, index) => (
          <div key={`${tool}-${index}`} className="flex items-center gap-8 sm:gap-12">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.06, y: -2 }}
              transition={{ type: 'spring', stiffness: 420, damping: 20 }}
            >
              <Sparkles className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              <span className="whitespace-nowrap text-sm font-black tracking-[0.14em] sm:text-base">
                {tool}
              </span>
            </motion.div>
            {index < items.length - 1 && (
              <span className="hidden h-8 w-px bg-white/25 sm:block dark:bg-black/20" aria-hidden />
            )}
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function WorkflowRow({
  workflow,
  index,
  isActive,
  onHoverStart,
  onHoverEnd,
  sectionActive,
  canHover,
}: {
  workflow: (typeof aiWorkflows)[number]
  index: number
  isActive: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
  sectionActive: boolean
  canHover: boolean
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const rowInView = useInView(rowRef, { margin: '-20% 0px' })
  const showContent = canHover ? isActive : rowInView

  return (
    <div
      ref={rowRef}
      className="border-t border-portfolio-ink/15 dark:border-white/15"
      onMouseEnter={canHover ? onHoverStart : undefined}
      onMouseLeave={canHover ? onHoverEnd : undefined}
    >
      <motion.div
        className="group relative flex w-full cursor-default items-center justify-between gap-6 overflow-hidden py-8 sm:py-10 md:py-12"
        initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
        animate={
          sectionActive ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -40 : 40 }
        }
        transition={{
          type: 'spring',
          stiffness: 90,
          damping: 18,
          delay: 0.15 + index * 0.1,
        }}
      >
        <motion.span
          className="pointer-events-none absolute inset-0 origin-left bg-portfolio-ink dark:bg-white"
          initial={false}
          animate={{ scaleX: showContent ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="relative z-10 min-w-0">
          <span
            className={`block text-xl font-black tracking-tight transition-colors duration-300 sm:text-2xl md:text-3xl lg:text-4xl ${
              showContent
                ? 'text-portfolio-cream dark:text-black'
                : 'text-portfolio-ink group-hover:text-portfolio-cream dark:text-white dark:group-hover:text-black'
            }`}
          >
            {workflow.title}
          </span>
          <AnimatePresence>
            {showContent && (
              <motion.p
                className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-portfolio-cream/75 dark:text-black/70 sm:text-base"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.35 }}
              >
                {workflow.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.span
          className={`relative z-10 shrink-0 transition-colors duration-300 ${
            showContent
              ? 'text-portfolio-cream dark:text-black'
              : 'text-portfolio-ink group-hover:text-portfolio-cream dark:text-white dark:group-hover:text-black'
          }`}
          animate={{ rotate: showContent ? 90 : 0, scale: showContent ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 18 }}
        >
          <ArrowUpRight className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" strokeWidth={2.5} />
        </motion.span>
      </motion.div>

      <AnimatePresence initial={false}>
        {showContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-portfolio-ink/10 px-0 pb-10 pt-2 dark:border-white/10">
              <motion.div
                className="relative mb-6 h-px w-full overflow-hidden bg-portfolio-ink/10 dark:bg-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full w-full origin-left bg-portfolio-accent dark:bg-white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {workflow.items.map((item, itemIndex) => (
                  <motion.span
                    key={item}
                    className="border-2 border-portfolio-ink/20 px-3 py-1.5 font-mono text-[10px] font-black tracking-wider dark:border-white/20 sm:text-xs"
                    initial={{ opacity: 0, y: 14, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 320,
                      damping: 20,
                      delay: itemIndex * 0.04,
                    }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SkillsPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const canHover = useMediaQuery('(hover: hover)')

  const sectionInView = useInView(sectionRef, { once: true, margin: '-10% 0px' })
  const quoteInView = useInView(quoteRef, { once: true, margin: '-12% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const simplifyProgress = useSpring(
    useTransform(scrollYProgress, [0.05, 0.45], [0, 1]),
    { stiffness: 70, damping: 22 }
  )

  const labelX = useTransform(scrollYProgress, [0, 0.35], [24, 0])
  const quoteParallax = useTransform(scrollYProgress, [0, 1], [32, -24])

  return (
    <section
      ref={sectionRef}
      className="relative z-20 overflow-hidden bg-portfolio-cream text-portfolio-ink transition-colors duration-500 dark:bg-black dark:text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(15,15,15,0.07) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 md:px-8 md:py-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <motion.div
            className="lg:col-span-3"
            style={{ x: labelX }}
            initial={{ opacity: 0 }}
            animate={sectionInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="flex items-center gap-2 font-serif text-[11px] font-medium uppercase tracking-[0.28em] text-portfolio-ink/55 dark:text-white/50 sm:text-xs">
              <Bot className="h-3.5 w-3.5" aria-hidden />
              AI &amp; Philosophy
            </p>
          </motion.div>

          <motion.div ref={quoteRef} className="lg:col-span-9" style={{ y: quoteParallax }}>
            <blockquote className="max-w-5xl">
              <p className="text-[clamp(1.65rem,4.8vw,3.75rem)] font-black uppercase leading-[1.05] tracking-tight">
                {QUOTE_WORDS.map((word, index) => (
                  <span key={`${word}-${index}`}>
                    <QuoteWord word={word} index={index} active={quoteInView} />
                    {index < QUOTE_WORDS.length - 1 ? '\u00A0' : ''}
                  </span>
                ))}
              </p>
            </blockquote>

            <motion.footer
              className="mt-6 font-serif text-sm italic text-portfolio-ink/60 dark:text-white/55 sm:mt-8 sm:text-base"
              initial={{ opacity: 0, x: -12 }}
              animate={quoteInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
              transition={{ delay: 0.75, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              — Grady Booch
            </motion.footer>

            <ComplexityLine progress={simplifyProgress} />
            <AIPromptTerminal active={quoteInView} />
          </motion.div>
        </div>
      </div>

      <AIMarquee active={sectionInView} />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <p className="py-6 font-mono text-[10px] font-black tracking-[0.35em] text-portfolio-ink/40 dark:text-white/35 sm:text-xs">
          {canHover
            ? '// HOVER A WORKFLOW TO REVEAL THE STACK'
            : '// SCROLL WORKFLOWS — TAP-FRIENDLY REVEAL ON MOBILE'}
        </p>

        {aiWorkflows.map((workflow, index) => (
          <WorkflowRow
            key={workflow.id}
            workflow={workflow}
            index={index}
            isActive={hoveredId === workflow.id}
            onHoverStart={() => setHoveredId(workflow.id)}
            onHoverEnd={() => setHoveredId(null)}
            sectionActive={sectionInView}
            canHover={canHover}
          />
        ))}
        <div className="border-t border-portfolio-ink/15 dark:border-white/15" />
      </div>

      <div className="relative bg-portfolio-lime px-6 py-24 text-portfolio-ink transition-colors duration-500 sm:py-28 md:px-8 md:py-32 dark:bg-white dark:text-black">
        <div className="relative mx-auto max-w-7xl">
          <SkillsGrid active={sectionInView} />
        </div>
      </div>
    </section>
  )
}
