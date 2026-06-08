'use client'

import { useEffect } from 'react'
import { ErrorPageShell } from '@/components/errors/ErrorPageShell'

export default function Error({
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
    <ErrorPageShell
      code="500"
      label="// RUNTIME_FAULT"
      title="SOMETHING BROKE MID-RENDER"
      description="An unexpected error interrupted this view. You can retry the last action or head back to the portfolio home."
      ghostText="FAULT_LINE_"
      showRetry
      onRetry={reset}
    />
  )
}
