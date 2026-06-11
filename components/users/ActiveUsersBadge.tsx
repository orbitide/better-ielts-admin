'use client'

import { useEffect, useState } from 'react'
import { ensurePresenceConnection, onOnlineCountChanged } from '@/lib/realtime/presence-connection'

export function ActiveUsersBadge() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const unsubscribe = onOnlineCountChanged(setCount)
    ensurePresenceConnection().catch(() => {})
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      {count ?? '—'} active now
    </div>
  )
}
