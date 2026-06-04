'use client'

import { useState, useEffect } from 'react'

export function CursorFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div 
      className="fixed w-4 h-4 bg-white rounded-full pointer-events-none z-50 transition-transform duration-100 mix-blend-difference"
      style={{
        left: mousePosition.x - 8,
        top: mousePosition.y - 8,
        transform: `scale(${isLoaded ? 1 : 0})`
      }}
    />
  )
}
