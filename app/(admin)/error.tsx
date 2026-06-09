'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function AdminError({
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
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-sm">{error.message}</p>
      <Button variant="outline" onClick={reset}>Try again</Button>
    </div>
  )
}
