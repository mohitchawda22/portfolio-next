'use client'

import { useEffect } from 'react'
import './globals.css'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="m-0 min-h-screen bg-black font-sans text-white antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 font-mono text-xs font-black tracking-[0.35em] text-white/40">
            // CRITICAL_FAULT
          </p>
          <h1 className="mb-4 text-6xl font-black tracking-tight md:text-8xl">500</h1>
          <p className="mb-10 max-w-md text-sm font-medium leading-relaxed text-white/65 md:text-base">
            A root-level error stopped the app from loading. Retry or return home.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={reset}
              className="border-4 border-white bg-white px-6 py-3 text-sm font-black tracking-wider text-black"
            >
              TRY AGAIN
            </button>
            <a
              href="/"
              className="border-4 border-white/30 px-6 py-3 text-sm font-black tracking-wider text-white no-underline hover:border-white hover:bg-white hover:text-black"
            >
              BACK TO HOME
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
