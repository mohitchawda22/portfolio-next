'use client'

import { useState, useEffect } from 'react'
import { useMediaQuery, usePrefersFinePointer } from '@/lib/use-media-query'

export function CursorFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const hasFinePointer = usePrefersFinePointer()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    if (!hasFinePointer || prefersReducedMotion) return

    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [hasFinePointer, prefersReducedMotion])

  if (!hasFinePointer || prefersReducedMotion) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed z-50 hidden h-4 w-4 rounded-full bg-white mix-blend-difference transition-transform duration-100 md:block"
      style={{
        left: mousePosition.x - 8,
        top: mousePosition.y - 8,
        transform: `scale(${isLoaded ? 1 : 0})`,
      }}
    />
  )
}
