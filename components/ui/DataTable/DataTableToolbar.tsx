import { cn } from '@/lib/utils/utils'
import type { ReactNode } from 'react'

type DataTableToolbarProps = {
  children: ReactNode
  className?: string
}

export function DataTableToolbar({ children, className }: DataTableToolbarProps) {
  return (
    <div className={cn('flex items-center gap-3 flex-wrap', className)}>
      {children}
    </div>
  )
}
