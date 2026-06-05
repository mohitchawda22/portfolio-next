'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export type VideoTextMaskProps = {
  text: string
  videoSrc: string
  fallbackSources?: string[]
  className?: string
  heightClass?: string
  backgroundColor?: string
  loop?: boolean
  muted?: boolean
  autoPlay?: boolean
  fontSizeRatio?: number
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function VideoTextMask({
  text,
  videoSrc,
  fallbackSources = [],
  className = '',
  heightClass = 'h-[clamp(140px,22vw,300px)]',
  backgroundColor = 'transparent',
  loop = true,
  muted = true,
  autoPlay = true,
  fontSizeRatio = 0.13,
}: VideoTextMaskProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [size, setSize] = useState({ width: 1200, height: 280 })
  const [sourceIndex, setSourceIndex] = useState(0)
  const [videoFailed, setVideoFailed] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const sources = useMemo(
    () => [videoSrc, ...fallbackSources],
    [videoSrc, fallbackSources]
  )
  const activeSrc = sources[sourceIndex] ?? sources[0]

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect()
      setSize({
        width: Math.max(Math.round(width), 1),
        height: Math.max(Math.round(height), 1),
      })
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setSourceIndex(0)
    setVideoFailed(false)
  }, [videoSrc, fallbackSources])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !autoPlay || reduceMotion || videoFailed) return

    const play = () => {
      void video.play().catch(() => {
        if (sourceIndex < sources.length - 1) {
          setSourceIndex((index) => index + 1)
          return
        }
        setVideoFailed(true)
      })
    }

    play()
    video.addEventListener('loadeddata', play)
    return () => video.removeEventListener('loadeddata', play)
  }, [activeSrc, autoPlay, reduceMotion, sourceIndex, sources.length, videoFailed])

  const handleVideoError = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((index) => index + 1)
      return
    }
    setVideoFailed(true)
  }

  const fontSize = size.width * fontSizeRatio

  const maskImage = useMemo(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size.width} ${size.height}'>
      <text
        x='50%'
        y='54%'
        dominant-baseline='middle'
        text-anchor='middle'
        font-family='ui-sans-serif, system-ui, -apple-system, sans-serif'
        font-weight='900'
        font-size='${fontSize}'
        letter-spacing='-0.03em'
        fill='white'
      >${escapeXml(text)}</text>
    </svg>`

    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  }, [fontSize, size.height, size.width, text])

  const showVideo = !reduceMotion && !videoFailed

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-transparent ${heightClass} ${className}`}
      style={backgroundColor === 'transparent' ? undefined : { backgroundColor }}
    >
      <p className="sr-only">{text}</p>

      {showVideo ? (
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: maskImage,
            maskImage,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        >
          <video
            key={activeSrc}
            ref={videoRef}
            src={activeSrc}
            className="h-full w-full object-cover"
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline
            preload="auto"
            onError={handleVideoError}
          />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center px-4">
          <span className="text-center text-[clamp(2.5rem,11vw,7rem)] font-black leading-none tracking-tighter text-white">
            {text}
          </span>
        </div>
      )}
    </div>
  )
}

export function VideoTextMaskReveal({
  active,
  ...props
}: VideoTextMaskProps & { active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 32, scale: 0.97 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <VideoTextMask {...props} />
    </motion.div>
  )
}
