'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useAnimationControls,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowUpRight, Bot, Terminal } from 'lucide-react'
import { AIToolLogo, type AIToolId } from '@/components/AIToolLogos'
import { useMediaQuery } from '@/lib/use-media-query'

const QUOTE =
  'THE FUNCTION OF GOOD SOFTWARE IS TO MAKE THE COMPLEX APPEAR TO BE SIMPLE.'
const QUOTE_WORDS = QUOTE.split(' ')

const aiTools: { id: AIToolId; label: string }[] = [
  { id: 'cursor', label: 'CURSOR' },
  { id: 'github-copilot', label: 'GITHUB COPILOT' },
  { id: 'claude', label: 'CLAUDE' },
  { id: 'chatgpt', label: 'CHATGPT' },
  { id: 'v0', label: 'V0' },
  { id: 'figma-ai', label: 'FIGMA AI' },
]

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
            className="text-white/20"
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
            className="text-portfolio-accent"
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
      className="mt-8 border-2 border-white/15 bg-white/[0.04] p-4 font-mono text-[11px] leading-relaxed sm:mt-10 sm:p-5 sm:text-xs"
      initial={{ opacity: 0, y: 12 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ delay: 0.9, duration: 0.5 }}
    >
      <div className="mb-3 flex items-center gap-2 text-white/40">
        <Terminal className="h-3.5 w-3.5" aria-hidden />
        <span className="font-black tracking-[0.25em]">AI_WORKFLOW.LOG</span>
      </div>
      <p className="text-white/75">
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
      className="relative overflow-hidden border-y border-white/10 bg-black py-5 text-white"
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
          <div key={`${tool.id}-${index}`} className="flex items-center gap-8 sm:gap-12">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.06, y: -2 }}
              transition={{ type: 'spring', stiffness: 420, damping: 20 }}
            >
              <AIToolLogo id={tool.id} />
              <span className="whitespace-nowrap text-sm font-black tracking-[0.14em] sm:text-base">
                {tool.label}
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

const workflowEase = [0.22, 1, 0.36, 1] as const

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
      className="w-full border-t border-white/15"
      onMouseEnter={canHover ? onHoverStart : undefined}
      onMouseLeave={canHover ? onHoverEnd : undefined}
    >
      <motion.div
        className="relative w-full cursor-default"
        initial={{ opacity: 0, x: index % 2 === 0 ? -28 : 28 }}
        animate={
          sectionActive ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -28 : 28 }
        }
        transition={{
          type: 'spring',
          stiffness: 90,
          damping: 20,
          delay: 0.12 + index * 0.08,
        }}
      >
        <motion.div
          className={`relative w-full transition-colors duration-[550ms] ${
            showContent ? 'bg-portfolio-accent dark:bg-white' : 'bg-transparent'
          }`}
          initial={false}
        >
          <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:py-10 md:px-8 md:py-12">
            <div className="flex items-start justify-between gap-6">
              <motion.h3
                className={`min-w-0 flex-1 pr-4 text-xl font-black tracking-tight transition-colors duration-500 ease-out sm:text-2xl md:text-3xl lg:text-4xl ${
                  showContent ? 'text-portfolio-ink dark:text-black' : 'text-white'
                }`}
              >
                {workflow.title}
              </motion.h3>

              <motion.span
                className={`relative shrink-0 pt-1 transition-colors duration-500 ease-out ${
                  showContent ? 'text-portfolio-ink dark:text-black' : 'text-white'
                }`}
                initial={false}
                animate={{ rotate: showContent ? 90 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <ArrowUpRight
                  className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
                  strokeWidth={2.5}
                />
              </motion.span>
            </div>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                showContent ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pt-3 text-sm font-medium leading-relaxed text-portfolio-ink/75 dark:text-black/75 sm:pt-4 sm:text-base">
                  {workflow.description}
                </p>

                <div
                  className={`mb-1 mt-5 h-px w-full origin-left bg-portfolio-ink/20 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-black/20 ${
                    showContent ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  aria-hidden
                />

                <div className="flex flex-wrap gap-2 pb-1 pt-5 sm:gap-3">
                  {workflow.items.map((item, itemIndex) => (
                    <motion.span
                      key={item}
                      className="border-2 border-portfolio-ink/25 px-3 py-1.5 font-mono text-[10px] font-black tracking-wider text-portfolio-ink dark:border-black/25 dark:text-black sm:text-xs"
                      initial={false}
                      animate={{
                        opacity: showContent ? 1 : 0,
                        y: showContent ? 0 : 8,
                      }}
                      transition={{
                        duration: 0.4,
                        ease: workflowEase,
                        delay: showContent ? 0.1 + itemIndex * 0.035 : 0,
                      }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
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
      className="relative z-20 overflow-hidden border-t-4 border-portfolio-accent bg-portfolio-ink text-white transition-colors duration-500 dark:border-white dark:bg-black dark:text-white"
    >
      <div
        aria-hidden
        className="bg-section-grid-projects pointer-events-none absolute inset-0 opacity-[0.14]"
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
            <p className="flex items-center gap-2 font-serif text-[11px] font-medium uppercase tracking-[0.28em] text-white/50 sm:text-xs">
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
              className="mt-6 font-serif text-sm italic text-white/55 sm:mt-8 sm:text-base"
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
        <p className="py-6 font-mono text-[10px] font-black tracking-[0.35em] text-portfolio-accent/50 sm:text-xs dark:text-white/35">
          {canHover
            ? '// HOVER A WORKFLOW TO REVEAL THE STACK'
            : '// SCROLL WORKFLOWS — TAP-FRIENDLY REVEAL ON MOBILE'}
        </p>
      </div>

      <div className="w-full">
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
        <div className="w-full border-t border-white/15" />
      </div>
    </section>
  )
}
