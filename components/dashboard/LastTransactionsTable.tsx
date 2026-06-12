import type { Transaction } from '@/lib/types/admin'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils/utils'

const planVariant: Record<string, 'default' | 'success'> = {
  elite: 'default',
  pro: 'success',
}

const statusVariant: Record<string, 'success' | 'destructive' | 'secondary'> = {
  success: 'success',
  failed: 'destructive',
  refunded: 'secondary',
}

export function LastTransactionsTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="space-y-2">
      {transactions.map((txn) => (
        <div
          key={txn.id}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none">{txn.userName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{txn.userEmail}</p>
          </div>
          <Badge variant={planVariant[txn.plan]}>{txn.plan}</Badge>
          <span className="text-sm font-medium tabular-nums w-10 text-right">${txn.amount}</span>
          <Badge variant={statusVariant[txn.status]}>{txn.status}</Badge>
          <span className="text-xs text-muted-foreground w-24 text-right shrink-0">{formatDate(txn.paidAt)}</span>
        </div>
      ))}
    </div>
  )
}
