'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  PreloaderCounter,
} from '@/components/PreloaderCounter'
import { PRELOADER_THEME, type PreloaderTheme } from '@/lib/preloader-theme'

type PreloaderContextValue = {
  isComplete: boolean
}

const PreloaderContext = createContext<PreloaderContextValue>({
  isComplete: false,
})

export function usePreloaderComplete() {
  return useContext(PreloaderContext).isComplete
}

export type PixelRevealStyle = 'center' | 'scatter' | 'spiral' | 'wipe-left'

export type PixelWipePreloaderProps = {
  children: ReactNode
  revealStyle?: PixelRevealStyle
  counterDuration?: number
  revealDuration?: number
  speed?: number
  gridSize?: number
  minDisplayTime?: number
  /** Skip the intro sequence (used on error and secondary routes). */
  disabled?: boolean
}

type GridCell = {
  x: number
  y: number
  w: number
  h: number
  col: number
  row: number
  order: number
}

type LineSegment = {
  x1: number
  y1: number
  x2: number
  y2: number
  order: number
  opacity: number
}

type CircuitGrid = {
  cells: GridCell[]
  segments: LineSegment[]
  cellSize: number
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function easeInOutQuart(t: number) {
  return t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function activatePreloaderShell(surface: string) {
  const root = document.documentElement
  root.setAttribute('data-preloader', 'active')
  root.setAttribute('data-preloader-lock', '')
  root.style.setProperty('--preloader-surface', surface)
  root.style.backgroundColor = surface
  document.body.style.backgroundColor = surface
}

function releasePreloaderOverlay() {
  const root = document.documentElement
  root.removeAttribute('data-preloader')
  root.removeAttribute('data-preloader-lock')
  root.removeAttribute('data-preloader-canvas')
}

function releasePreloaderBackground() {
  const root = document.documentElement
  root.style.removeProperty('--preloader-surface')
  root.style.removeProperty('background-color')
  document.body.style.removeProperty('background-color')
}

function markCanvasReady() {
  document.documentElement.setAttribute('data-preloader-canvas', 'ready')
}

function computeCellOrder(
  style: PixelRevealStyle,
  col: number,
  row: number,
  cx: number,
  cy: number,
  rand: () => number
) {
  const dist = Math.hypot(col * 48 - cx, row * 48 - cy)
  const angle = Math.atan2(row * 48 - cy, col * 48 - cx)

  switch (style) {
    case 'wipe-left':
      return col
    case 'scatter':
      return rand()
    case 'spiral':
      return dist + (angle + Math.PI) * 28
    case 'center':
    default:
      return dist
  }
}

function buildCircuitGrid(
  width: number,
  height: number,
  cellSize: number,
  style: PixelRevealStyle
): CircuitGrid {
  const cols = Math.ceil(width / cellSize) + 1
  const rows = Math.ceil(height / cellSize) + 1
  const centerX = width / 2
  const centerY = height / 2
  const rand = mulberry32(
    style.split('').reduce((acc, char) => acc + char.charCodeAt(0), 481)
  )

  const cells: GridCell[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellSize
      const y = row * cellSize

      cells.push({
        x,
        y,
        w: Math.min(cellSize + 1, width - x + cellSize * 0.15),
        h: Math.min(cellSize + 1, height - y + cellSize * 0.15),
        col,
        row,
        order: computeCellOrder(style, col, row, centerX, centerY, rand),
      })
    }
  }

  cells.sort((a, b) => a.order - b.order)

  const segments: LineSegment[] = []

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (rand() > 0.82) continue

      const x1 = col * cellSize
      const x2 = (col + 1) * cellSize
      const y = row * cellSize
      const midX = (x1 + x2) / 2
      const midY = y

      segments.push({
        x1,
        y1: y,
        x2,
        y2: y,
        order: Math.hypot(midX - centerX, midY - centerY) + rand() * 12,
        opacity: 0.35 + rand() * 0.65,
      })
    }
  }

  for (let col = 0; col <= cols; col++) {
    for (let row = 0; row < rows; row++) {
      if (rand() > 0.82) continue

      const y1 = row * cellSize
      const y2 = (row + 1) * cellSize
      const x = col * cellSize
      const midX = x
      const midY = (y1 + y2) / 2

      segments.push({
        x1: x,
        y1,
        x2: x,
        y2,
        order: Math.hypot(midX - centerX, midY - centerY) + rand() * 12,
        opacity: 0.35 + rand() * 0.65,
      })
    }
  }

  segments.sort((a, b) => a.order - b.order)

  return { cells, segments, cellSize }
}

function waitForPageReady(minDisplayTime: number) {
  return Promise.all([
    new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        resolve()
        return
      }
      window.addEventListener('load', () => resolve(), { once: true })
    }),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, minDisplayTime)
    }),
  ])
}

function drawCircuitFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  grid: CircuitGrid,
  theme: PreloaderTheme,
  revealProgress: number,
  lineProgress: number
) {
  const eased = easeOutCubic(revealProgress)
  const openCount = Math.floor(eased * grid.cells.length)
  const openCells = openCount > 0 ? grid.cells.slice(0, openCount) : []

  ctx.fillStyle = theme.background
  ctx.fillRect(0, 0, width, height)

  for (const cell of openCells) {
    ctx.clearRect(cell.x, cell.y, cell.w, cell.h)
  }

  const visibleSegments = Math.floor(
    Math.min(1, lineProgress) * grid.segments.length
  )

  ctx.lineWidth = 1
  ctx.lineCap = 'square'

  for (let i = 0; i < visibleSegments; i++) {
    const segment = grid.segments[i]
    const midX = (segment.x1 + segment.x2) / 2
    const midY = (segment.y1 + segment.y2) / 2
    const hostCol = Math.floor(midX / grid.cellSize)
    const hostRow = Math.floor(midY / grid.cellSize)

    const isOpen = openCells.some(
      (cell) => cell.col === hostCol && cell.row === hostRow
    )
    if (isOpen) continue

    const flicker = 0.9 + Math.sin(lineProgress * 14 + i * 0.35) * 0.1
    ctx.strokeStyle = theme.line
    ctx.globalAlpha =
      segment.opacity * flicker * (1 - revealProgress * 0.4)
    ctx.beginPath()
    ctx.moveTo(segment.x1, segment.y1)
    ctx.lineTo(segment.x2, segment.y2)
    ctx.stroke()
  }

  ctx.globalAlpha = 1
}

function animateProgress(duration: number, onTick: (t: number) => void) {
  return new Promise<void>((resolve) => {
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      onTick(t)

      if (t >= 1) {
        resolve()
        return
      }

      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  })
}

export function PixelWipePreloader({
  children,
  revealStyle = 'center',
  counterDuration = 3200,
  revealDuration = 1400,
  speed = 1,
  gridSize = 46,
  minDisplayTime = 700,
  disabled = false,
}: PixelWipePreloaderProps) {
  const { resolvedTheme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gridRef = useRef<CircuitGrid | null>(null)
  const runIdRef = useRef(0)
  const hasStartedRef = useRef(false)
  const canvasReadyRef = useRef(false)
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })

  const theme = PRELOADER_THEME
  const [activeStyle] = useState<PixelRevealStyle>(revealStyle)
  const [isVisible, setIsVisible] = useState(() => !disabled)
  const [phase, setPhase] = useState<'counter' | 'reveal' | 'done'>(
    disabled ? 'done' : 'counter'
  )
  const [preloaderDone, setPreloaderDone] = useState(disabled)
  const [counterValue, setCounterValue] = useState(0)
  const [loadProgress, setLoadProgress] = useState(0)
  const [revealProgress, setRevealProgress] = useState(0)
  const [overlayOpacity, setOverlayOpacity] = useState(1)

  const isSiteReady =
    disabled ? resolvedTheme !== undefined : preloaderDone && resolvedTheme !== undefined
  const showCounterUi = !disabled && phase !== 'done'

  useLayoutEffect(() => {
    if (!disabled) return

    setPreloaderDone(true)
    setPhase('done')
    setIsVisible(false)
    releasePreloaderOverlay()
  }, [disabled])

  const scaledCounterDuration = counterDuration / speed
  const scaledRevealDuration = revealDuration / speed

  useLayoutEffect(() => {
    if (!isVisible) return
    activatePreloaderShell(PRELOADER_THEME.background)
  }, [isVisible])

  const finishPreloader = useCallback(() => {
    setPreloaderDone(true)
    setPhase('done')
    setIsVisible(false)
    releasePreloaderOverlay()
  }, [])

  useEffect(() => {
    if (!isSiteReady) return

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        releasePreloaderBackground()
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [isSiteReady])

  const rebuildGrid = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    gridRef.current = buildCircuitGrid(width, height, gridSize, activeStyle)
  }, [activeStyle, gridSize])

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = window.innerWidth
    const height = window.innerHeight
    const size = sizeRef.current

    if (size.width !== width || size.height !== height || size.dpr !== dpr) {
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      sizeRef.current = { width, height, dpr }
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    return true
  }, [])

  const drawFrame = useCallback(
    (reveal: number, lines: number) => {
      const grid = gridRef.current
      if (!grid || !setupCanvas()) return

      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!ctx) return

      const width = sizeRef.current.width
      const height = sizeRef.current.height

      drawCircuitFrame(ctx, width, height, grid, theme, reveal, lines)

      if (!canvasReadyRef.current) {
        canvasReadyRef.current = true
        markCanvasReady()
      }
    },
    [setupCanvas, theme]
  )

  const paintInitialFrame = useCallback(() => {
    rebuildGrid()
    drawFrame(0, 0)
  }, [drawFrame, rebuildGrid])

  useLayoutEffect(() => {
    if (!isVisible) return
    paintInitialFrame()
  }, [isVisible, paintInitialFrame])

  const runSequence = useCallback(async () => {
    const runId = runIdRef.current + 1
    runIdRef.current = runId

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    rebuildGrid()
    drawFrame(0, 0)

    if (prefersReducedMotion) {
      setCounterValue(100)
      setLoadProgress(1)
      drawFrame(1, 1)
      finishPreloader()
      return
    }

    await Promise.all([
      waitForPageReady(minDisplayTime),
      animateProgress(scaledCounterDuration, (t) => {
        if (runId !== runIdRef.current) return

        const eased = easeInOutQuart(t)
        const value = Math.min(100, eased * 100)
        setCounterValue(value)
        setLoadProgress(eased)
        drawFrame(0, eased)
      }),
    ])

    if (runId !== runIdRef.current) return

    setCounterValue(100)
    setLoadProgress(1)
    setPhase('reveal')

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 400 / speed)
    })

    if (runId !== runIdRef.current) return

    await animateProgress(scaledRevealDuration, (t) => {
      if (runId !== runIdRef.current) return

      const eased = easeOutCubic(t)
      setRevealProgress(eased)
      setOverlayOpacity(1 - easeInOutQuart(Math.max(0, (t - 0.55) / 0.45)))
      drawFrame(eased, 1)
    })

    if (runId !== runIdRef.current) return

    setRevealProgress(1)
    setOverlayOpacity(0)
    drawFrame(1, 1)
    finishPreloader()
  }, [
    drawFrame,
    finishPreloader,
    minDisplayTime,
    rebuildGrid,
    scaledCounterDuration,
    scaledRevealDuration,
    speed,
  ])

  useEffect(() => {
    if (disabled) return
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    let cancelled = false

    const start = async () => {
      await runSequence()
      if (cancelled) return
    }

    start()

    return () => {
      cancelled = true
      runIdRef.current += 1
    }
  }, [disabled, runSequence])

  useEffect(() => {
    if (disabled || !isVisible) return

    const handleResize = () => {
      canvasReadyRef.current = false
      rebuildGrid()
      drawFrame(
        phase === 'reveal' ? revealProgress : 0,
        phase === 'reveal' ? 1 : loadProgress
      )
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawFrame, isVisible, loadProgress, phase, rebuildGrid, revealProgress])

  const preloaderContext = useMemo(
    () => ({ isComplete: isSiteReady }),
    [isSiteReady]
  )

  return (
    <PreloaderContext.Provider value={preloaderContext}>
      <div
        data-site-content
        className={
          !isSiteReady
            ? 'invisible pointer-events-none'
            : isVisible
              ? 'pointer-events-none'
              : undefined
        }
      >
        {children}
      </div>

      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[10050] touch-none"
          style={{ backgroundColor: theme.background }}
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 0.01 }}
          aria-live="polite"
          aria-busy={phase !== 'done'}
          aria-label="Page loading"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-[1] h-full w-full"
            role="presentation"
          />

          <div className="pointer-events-none absolute inset-0 z-[30] isolate flex flex-col items-center justify-center">
            <PreloaderCounter
              value={counterValue}
              theme={theme}
              visible={showCounterUi && overlayOpacity > 0.05}
            />
          </div>

          {phase === 'reveal' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center"
            >
              <p
                className="font-mono text-[9px] font-bold tracking-[0.4em] opacity-50"
                style={{ color: theme.text }}
              >
                REVEALING
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </PreloaderContext.Provider>
  )
}
