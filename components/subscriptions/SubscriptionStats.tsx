import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DataTable, type ColumnDef } from '@/components/ui/DataTable'
import type { SubscriptionRecord } from '@/lib/types/admin'

const statusVariant: Record<string, 'success' | 'destructive' | 'warning'> = {
  active: 'success',
  cancelled: 'destructive',
  past_due: 'warning',
}

const columns: ColumnDef<SubscriptionRecord>[] = [
  {
    accessorKey: 'userName',
    header: 'User',
    cell: ({ row }) => (
      <div>
        <p className="font-medium leading-none">{row.original.userName}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{row.original.userEmail}</p>
      </div>
    ),
  },
  {
    accessorKey: 'plan',
    header: 'Plan',
    cell: ({ row }) => (
      <Badge variant={row.original.plan === 'elite' ? 'default' : 'success'}>
        {row.original.plan}
      </Badge>
    ),
    meta: { className: 'hidden sm:table-cell' },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <span className="text-muted-foreground">${row.original.amount}/mo</span>
    ),
    meta: { className: 'hidden md:table-cell' },
  },
  {
    accessorKey: 'renewsAt',
    header: 'Renews',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.renewsAt}</span>
    ),
    meta: { className: 'hidden lg:table-cell' },
  },
]

export function SubscriptionStats({ subscriptions }: { subscriptions: SubscriptionRecord[] }) {
  const active = subscriptions.filter((s) => s.status === 'active').length
  const cancelled = subscriptions.filter((s) => s.status === 'cancelled').length
  const pro = subscriptions.filter((s) => s.plan === 'pro' && s.status === 'active').length
  const elite = subscriptions.filter((s) => s.plan === 'elite' && s.status === 'active').length
  const mrr = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Subs', value: active },
          { label: 'Pro Plan', value: pro },
          { label: 'Elite Plan', value: elite },
          { label: 'MRR (sample)', value: `$${mrr}` },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={subscriptions}
            className="rounded-none border-0"
          />
        </CardContent>
      </Card>

      {cancelled > 0 && (
        <p className="text-xs text-muted-foreground">
          {cancelled} cancelled subscription{cancelled > 1 ? 's' : ''} not shown in MRR.
        </p>
      )}
    </div>
  )
}
