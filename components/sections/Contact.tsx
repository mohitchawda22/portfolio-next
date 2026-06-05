'use client'

import { useRef } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion'
import { ArrowUpRight, Github, Mail } from 'lucide-react'
import { VideoTextMaskReveal } from '@/components/VideoTextMask'
import { getContactVideoSources } from '@/lib/contact-videos'

const MASK_TEXT = "LET'S BUILD_"
const EMAIL = 'MOHITCHAWDA22JAN@GMAIL.COM'
const GITHUB_URL = 'https://github.com/mohitchawda22'
const EMAIL_URL = `mailto:${EMAIL.toLowerCase()}`

const [CONTACT_VIDEO_PRIMARY, ...CONTACT_VIDEO_FALLBACKS] = getContactVideoSources()

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.55 + index * 0.12,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

function ContactLink({
  href,
  label,
  icon: Icon,
  index,
  rotate,
}: {
  href: string
  label: string
  icon: typeof Github
  index: number
  rotate: number
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      custom={index}
      variants={linkVariants}
      whileHover={{
        y: -5,
        rotate,
        boxShadow: '10px 10px 0px 0px rgba(0,0,0,0.15)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      className="inline-flex items-center gap-4 border-2 border-portfolio-accent bg-transparent px-8 py-4 text-xl font-black text-white transition-colors hover:bg-portfolio-accent hover:text-portfolio-ink dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
    >
      <Icon className="h-6 w-6 shrink-0" />
      {label}
      <ArrowUpRight className="h-5 w-5 shrink-0 opacity-60" />
    </motion.a>
  )
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const contentInView = useInView(contentRef, { once: true, margin: '-10% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const ghostY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const lineScale = useTransform(scrollYProgress, [0.12, 0.32], [0, 1])

  return (
    <section
      ref={sectionRef}
      className="relative z-20 overflow-hidden bg-portfolio-contact px-6 py-28 text-white transition-colors duration-500 md:px-8 md:py-32 dark:bg-black dark:text-white"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 80px)',
        }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap text-[18vw] font-black leading-none text-portfolio-accent/[0.08] dark:text-white/[0.03]"
        style={{ y: ghostY }}
      >
        CONTACT_CONTACT_
      </motion.div>

      <div ref={contentRef} className="relative mx-auto max-w-7xl text-center">
        <motion.p
          className="mb-6 font-mono text-xs font-black tracking-[0.35em] text-portfolio-accent/70 dark:text-white/40"
          initial={{ opacity: 0, y: 12 }}
          animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.45 }}
        >
          // GET_IN_TOUCH
        </motion.p>

        <VideoTextMaskReveal
          active={contentInView}
          text={MASK_TEXT}
          videoSrc={CONTACT_VIDEO_PRIMARY}
          fallbackSources={CONTACT_VIDEO_FALLBACKS}
          className="mx-auto max-w-6xl"
          heightClass="h-[clamp(150px,24vw,320px)]"
          loop
          muted
          autoPlay
        />

        <motion.p
          className="mx-auto mt-6 max-w-xl text-sm font-medium text-white/60 md:text-base dark:text-white/55"
          initial={{ opacity: 0, y: 14 }}
          animate={contentInView ? { opacity: 0.55, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          Open to collaborations, freelance, and full-time frontend roles.
        </motion.p>

        <motion.div
          className="mx-auto mt-8 h-px w-full max-w-lg origin-center bg-portfolio-accent dark:bg-white"
          style={{ scaleX: lineScale }}
        />

        <motion.div
          className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-10 md:mt-16"
          initial="hidden"
          animate={contentInView ? 'visible' : 'hidden'}
        >
          <ContactLink
            href={GITHUB_URL}
            label="GITHUB"
            icon={Github}
            index={0}
            rotate={2}
          />
          <ContactLink
            href={EMAIL_URL}
            label="EMAIL"
            icon={Mail}
            index={1}
            rotate={-2}
          />
        </motion.div>

        <motion.a
          href={EMAIL_URL}
          className="mt-12 inline-block font-mono text-lg font-black tracking-widest md:mt-14 md:text-2xl"
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          animate={
            contentInView
              ? { opacity: 0.55, letterSpacing: '0.35em' }
              : { opacity: 0, letterSpacing: '0.2em' }
          }
          transition={{ delay: 0.75, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ opacity: 1 }}
        >
          {EMAIL}
        </motion.a>
      </div>
    </section>
  )
}
