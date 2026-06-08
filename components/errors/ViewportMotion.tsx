'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useInView,
  type HTMLMotionProps,
  type Transition,
  type Variant,
  type Variants,
} from 'framer-motion'

export type ViewportMotionTrigger = 'appear' | 'inView'
export type ViewportMotionPlayMode = 'once' | 'everyTime'

export type ViewportMotionProps = Omit<
  HTMLMotionProps<'div'>,
  'initial' | 'animate' | 'hidden'
> & {
  children: ReactNode
  trigger?: ViewportMotionTrigger
  playMode?: ViewportMotionPlayMode
  reverseOnExit?: boolean
  loop?: boolean
  autoPlay?: boolean
  variants?: Variants
  hidden?: Variant
  visible?: Variant
  delay?: number
  inViewAmount?: number | 'some' | 'all'
}

const defaultHidden: Variant = { opacity: 0, y: 24 }
const defaultVisible: Variant = { opacity: 1, y: 0 }

export function ViewportMotion({
  children,
  trigger = 'inView',
  playMode = 'once',
  reverseOnExit = false,
  loop = false,
  autoPlay = true,
  variants,
  hidden = defaultHidden,
  visible = defaultVisible,
  delay = 0,
  inViewAmount = 0.35,
  transition,
  ...rest
}: ViewportMotionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, {
    once: playMode === 'once',
    amount: inViewAmount,
    margin: '-6% 0px',
  })
  const [appeared, setAppeared] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    if (trigger !== 'appear' || !autoPlay) return
    setAppeared(true)
  }, [autoPlay, trigger])

  useEffect(() => {
    if (inView) setHasPlayed(true)
  }, [inView])

  const isActive =
    trigger === 'appear'
      ? appeared
      : playMode === 'once'
        ? inView || hasPlayed
        : inView

  const shouldReverse = reverseOnExit && playMode === 'everyTime' && !inView

  const resolvedVariants: Variants =
    variants ??
    ({
      hidden,
      visible: {
        ...visible,
        transition: {
          delay,
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
          ...(loop
            ? {
                repeat: Infinity,
                repeatType: 'mirror' as const,
                repeatDelay: 0.35,
              }
            : {}),
          ...(transition as Transition),
        },
      },
    } satisfies Variants)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldReverse ? 'hidden' : isActive ? 'visible' : 'hidden'}
      variants={resolvedVariants}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
