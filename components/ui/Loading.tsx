import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/utils'

export function Loading({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center p-10', className)}>
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  )
}
