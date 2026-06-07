'use client'

import { Sun, Moon } from 'lucide-react'
import { useUIStore } from '@/lib/store/ui-store'

export function AdminHeader() {
  const { theme, toggleTheme } = useUIStore()

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-5 shrink-0">
      <div />
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </header>
  )
}
