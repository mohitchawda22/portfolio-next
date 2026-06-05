'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePreloaderComplete } from '@/components/PixelWipePreloader'

const slideTransition = {
  duration: 1.2,
  ease: [0.76, 0, 0.24, 1] as const,
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const isReady = usePreloaderComplete()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Transform values for the scroll split effect
  // They fully open exactly when the user has scrolled 1 window height down (which is 0.5 of this 200vh container)
  const leftX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-100%"])
  const rightX = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"])
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <section ref={containerRef} className="h-[200vh] pointer-events-none relative z-50 bg-transparent">
      <div className="sticky top-0 h-screen overflow-hidden pointer-events-none">
        
        {/* Left side container (Scroll Effect) */}
        <motion.div className="absolute inset-0 pointer-events-auto z-20" style={{ x: leftX }}>
          {/* Inner Left side (Slide In Effect) */}
          <motion.div 
            initial={false}
            animate={{ x: isReady ? 0 : '-100%' }}
            transition={slideTransition}
            className="absolute inset-0 bg-portfolio-cream dark:bg-white"
            style={{
              clipPath: 'polygon(0 0, 60% 0, 40% 100%, 0% 100%)'
            }}
          >
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-2/5">
              <div className="text-portfolio-ink dark:text-black">
                <h1 className="text-8xl font-black leading-none mb-4 transform -rotate-2">
                  MOHIT
                </h1>
                <div className="text-2xl font-bold mb-8 transform rotate-1">
                  CREATIVE DEVELOPER
                </div>
                <div className="mb-8 h-1 w-32 bg-portfolio-accent/100 dark:bg-black"></div>
                <p className="text-lg font-medium leading-tight">
                  CRAFTING DIGITAL<br/>
                  EXPERIENCES THAT<br/>
                  BREAK BOUNDARIES
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side container (Scroll Effect) */}
        <motion.div className="absolute inset-0 pointer-events-auto  z-20" style={{ x: rightX }}>
          {/* Inner Right side (Slide In Effect) */}
          <motion.div 
            initial={false}
            animate={{ x: isReady ? 0 : '100%' }}
            transition={slideTransition}
            className="absolute inset-0 bg-portfolio-sand dark:bg-black"
            style={{
              clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 40% 100%)'
            }}
          >
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-2/5 text-right">
              <div className="text-portfolio-ink dark:text-white">
                <h1 className="text-8xl font-black leading-none mb-4 transform rotate-2">
                  CHAWDA
                </h1>
                <div className="text-2xl font-bold mb-8 transform -rotate-1">
                  FRONTEND DEVELOPER
                </div>
                <div className="mb-8 ml-auto h-1 w-32 bg-portfolio-accent/80 dark:bg-white"></div>
                <p className="text-lg font-medium leading-tight">
                  CODE IS ART<br/>
                  ART IS CODE<br/>
                  INNOVATION IS EVERYTHING
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator with fade out on scroll */}
        <motion.div
          initial={false}
          animate={{
            opacity: isReady ? 1 : 0,
            y: isReady ? 0 : 20,
          }}
          transition={{ delay: isReady ? 1.2 : 0, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-auto z-20"
        >
          <motion.div style={{ opacity: indicatorOpacity }}>
            <div className="mx-auto mb-4 h-16 w-px animate-pulse bg-portfolio-ink/50 dark:bg-white dark:mix-blend-difference"></div>
            <div className="text-xs font-bold tracking-widest text-portfolio-ink/60 dark:mix-blend-difference dark:text-white">
              SCROLL
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
