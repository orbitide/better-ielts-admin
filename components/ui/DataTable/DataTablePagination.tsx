'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

type DataTablePaginationProps = {
  page: number
  totalPages: number
  totalCount: number
  sourceCount: number
  onPageChange: (page: number) => void
  loading?: boolean
  countLabel?: string
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (pageSize: number) => void
}

export function DataTablePagination({
  page,
  totalPages,
  totalCount,
  sourceCount,
  onPageChange,
  loading,
  countLabel,
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const label = countLabel ?? `${totalCount} of ${sourceCount} items`

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-3">
        {onPageSizeChange && pageSize !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Rows per page</span>
            <Select
              className="h-7 text-xs"
              value={pageSize}
              disabled={loading}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </Select>
          </div>
        )}
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
    </div>
  )
}
