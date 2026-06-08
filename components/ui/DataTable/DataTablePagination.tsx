'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type DataTablePaginationProps = {
  page: number
  totalPages: number
  totalCount: number
  sourceCount: number
  onPageChange: (page: number) => void
  loading?: boolean
  countLabel?: string
}

export function DataTablePagination({
  page,
  totalPages,
  totalCount,
  sourceCount,
  onPageChange,
  loading,
  countLabel,
}: DataTablePaginationProps) {
  const label = countLabel ?? `${totalCount} of ${sourceCount} items`

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">{label}</p>
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums px-1">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}
