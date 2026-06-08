'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePreloaderComplete } from '@/components/PixelWipePreloader'

const slideTransition = {
  duration: 1.2,
  ease: [0.76, 0, 0.24, 1] as const,
}

function HeroCopy({
  name,
  role,
  tagline,
  align,
  nameRotate,
  roleRotate,
}: {
  name: string
  role: string
  tagline: string[]
  align: 'left' | 'right'
  nameRotate: string
  roleRotate: string
}) {
  const isRight = align === 'right'

  return (
    <div className={isRight ? 'text-right' : 'text-left'}>
      <h1
        className={`mb-2 font-black leading-[0.9] transform sm:mb-3 md:mb-4 ${nameRotate} text-[clamp(2.75rem,11vw,6rem)]`}
      >
        {name}
      </h1>
      <div
        className={`mb-4 text-sm font-bold transform sm:mb-6 sm:text-base md:mb-8 md:text-xl lg:text-2xl ${roleRotate}`}
      >
        {role}
      </div>
      <div
        className={`mb-4 h-1 w-20 bg-portfolio-accent/100 sm:mb-6 sm:w-24 md:mb-8 md:w-32 dark:bg-black ${isRight ? 'ml-auto' : ''} ${isRight ? 'dark:bg-white' : ''}`}
      />
      <p className="text-xs font-medium leading-snug sm:text-sm md:text-base lg:text-lg">
        {tagline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  )
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const isReady = usePreloaderComplete()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const leftX = useTransform(scrollYProgress, [0, 0.5], ['0%', '-100%'])
  const rightX = useTransform(scrollYProgress, [0, 0.5], ['0%', '100%'])
  const topY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-100%'])
  const bottomY = useTransform(scrollYProgress, [0, 0.5], ['0%', '100%'])
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <section
      ref={containerRef}
      className="pointer-events-none relative z-50 h-[200vh] bg-transparent"
    >
      <div className="pointer-events-none sticky top-0 h-[100dvh] overflow-hidden">
        {/* Mobile / tablet: vertical split */}
        <div className="absolute inset-0 lg:hidden">
          <motion.div
            className="absolute inset-0 z-20 pointer-events-auto"
            style={{ y: topY }}
          >
            <motion.div
              initial={false}
              animate={{ y: isReady ? 0 : '-100%' }}
              transition={slideTransition}
              className="absolute inset-0 bg-portfolio-cream dark:bg-white"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 54%, 0 46%)',
              }}
            >
              <div className="absolute inset-x-4 top-[14%] max-w-md sm:inset-x-6 sm:top-[16%] md:inset-x-8 md:top-[18%]">
                <div className="text-portfolio-ink dark:text-black">
                  <HeroCopy
                    name="MOHIT"
                    role="CREATIVE DEVELOPER"
                    tagline={[
                      'CRAFTING DIGITAL',
                      'EXPERIENCES THAT',
                      'BREAK BOUNDARIES',
                    ]}
                    align="left"
                    nameRotate="-rotate-2"
                    roleRotate="rotate-1"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-0 z-20 pointer-events-auto"
            style={{ y: bottomY }}
          >
            <motion.div
              initial={false}
              animate={{ y: isReady ? 0 : '100%' }}
              transition={slideTransition}
              className="absolute inset-0 bg-portfolio-sand dark:bg-black"
              style={{
                clipPath: 'polygon(0 46%, 100% 54%, 100% 100%, 0 100%)',
              }}
            >
              <div className="absolute inset-x-4 bottom-[12%] max-w-md sm:inset-x-6 sm:bottom-[14%] md:inset-x-8 md:bottom-[16%]">
                <div className="text-portfolio-ink dark:text-white">
                  <HeroCopy
                    name="CHAWDA"
                    role="FRONTEND DEVELOPER"
                    tagline={[
                      'CODE IS ART',
                      'ART IS CODE',
                      'INNOVATION IS EVERYTHING',
                    ]}
                    align="right"
                    nameRotate="rotate-2"
                    roleRotate="-rotate-1"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Desktop: diagonal split */}
        <div className="absolute inset-0 hidden lg:block">
          <motion.div
            className="absolute inset-0 z-20 pointer-events-auto"
            style={{ x: leftX }}
          >
            <motion.div
              initial={false}
              animate={{ x: isReady ? 0 : '-100%' }}
              transition={slideTransition}
              className="absolute inset-0 bg-portfolio-cream dark:bg-white"
              style={{
                clipPath: 'polygon(0 0, 60% 0, 40% 100%, 0% 100%)',
              }}
            >
              <div className="absolute left-8 top-1/2 w-2/5 max-w-md -translate-y-1/2 xl:left-12">
                <div className="text-portfolio-ink dark:text-black">
                  <HeroCopy
                    name="MOHIT"
                    role="CREATIVE DEVELOPER"
                    tagline={[
                      'CRAFTING DIGITAL',
                      'EXPERIENCES THAT',
                      'BREAK BOUNDARIES',
                    ]}
                    align="left"
                    nameRotate="-rotate-2"
                    roleRotate="rotate-1"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-0 z-20 pointer-events-auto"
            style={{ x: rightX }}
          >
            <motion.div
              initial={false}
              animate={{ x: isReady ? 0 : '100%' }}
              transition={slideTransition}
              className="absolute inset-0 bg-portfolio-sand dark:bg-black"
              style={{
                clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 40% 100%)',
              }}
            >
              <div className="absolute right-8 top-1/2 w-2/5 max-w-md -translate-y-1/2 text-right xl:right-12">
                <div className="text-portfolio-ink dark:text-white">
                  <HeroCopy
                    name="CHAWDA"
                    role="FRONTEND DEVELOPER"
                    tagline={[
                      'CODE IS ART',
                      'ART IS CODE',
                      'INNOVATION IS EVERYTHING',
                    ]}
                    align="right"
                    nameRotate="rotate-2"
                    roleRotate="-rotate-1"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{
            opacity: isReady ? 1 : 0,
            y: isReady ? 0 : 20,
          }}
          transition={{ delay: isReady ? 1.2 : 0, duration: 0.8 }}
          className="pointer-events-auto absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-center sm:bottom-8"
        >
          <motion.div style={{ opacity: indicatorOpacity }}>
            <div className="mx-auto mb-3 h-12 w-px animate-pulse bg-portfolio-ink/50 sm:mb-4 sm:h-16 dark:bg-white dark:mix-blend-difference" />
            <div className="text-[10px] font-bold tracking-widest text-portfolio-ink/60 sm:text-xs dark:mix-blend-difference dark:text-white">
              SCROLL
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
