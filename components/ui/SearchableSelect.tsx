'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { cn } from '@/lib/utils/utils'

export type SearchableSelectOption = {
  value: string
  label: string
}

type SearchableSelectProps = {
  value: string
  onChange: (value: string) => void
  options: SearchableSelectOption[]
  placeholder: string
  searchPlaceholder?: string
  pageSize?: number
  disabled?: boolean
  className?: string
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = 'Search…',
  pageSize = 8,
  disabled,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [panelStyle, setPanelStyle] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleToggle = () => {
    if (disabled) return
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPanelStyle({ top: rect.bottom + 4, left: rect.left, width: rect.width })
      setQuery('')
      setPage(0)
    }
    setOpen((v) => !v)
  }

  const handleSelect = (val: string) => {
    onChange(val)
    setOpen(false)
  }

  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice(page * pageSize, page * pageSize + pageSize)
  const selectedLabel = options.find((o) => o.value === value)?.label

  return (
    <div className={cn('inline-block', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-8 w-full min-w-[140px] items-center justify-between gap-2 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={cn('truncate', !selectedLabel && 'text-muted-foreground')}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: panelStyle.top, left: panelStyle.left, width: Math.max(panelStyle.width, 200) }}
          className="z-50 rounded-md border border-border bg-card shadow-xl"
        >
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(0) }}
                placeholder={searchPlaceholder}
                className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <ul role="listbox" className="max-h-60 overflow-y-auto py-1 text-sm">
            <li>
              <button
                type="button"
                onClick={() => handleSelect('')}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors hover:bg-muted/60',
                  !value && 'font-medium'
                )}
              >
                {placeholder}
                {!value && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            </li>
            {pageItems.length === 0 && (
              <li className="px-3 py-1.5 text-muted-foreground">No results</li>
            )}
            {pageItems.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(o.value)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left transition-colors hover:bg-muted/60',
                    value === o.value && 'font-medium'
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {value === o.value && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-2 py-1.5 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded p-1 transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span>Page {page + 1} of {totalPages}</span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="rounded p-1 transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
