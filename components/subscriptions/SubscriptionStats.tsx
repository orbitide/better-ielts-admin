import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { SubscriptionRecord } from '@/lib/types/admin'

const statusVariant: Record<string, 'success' | 'destructive' | 'warning'> = {
  active: 'success',
  cancelled: 'destructive',
  past_due: 'warning',
}

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
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">User</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden sm:table-cell">Plan</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Amount</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden lg:table-cell">Renews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium leading-none">{sub.userName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub.userEmail}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant={sub.plan === 'elite' ? 'default' : 'success'}>{sub.plan}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[sub.status]}>{sub.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">${sub.amount}/mo</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{sub.renewsAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {cancelled > 0 && (
        <p className="text-xs text-muted-foreground">{cancelled} cancelled subscription{cancelled > 1 ? 's' : ''} not shown in MRR.</p>
      )}
    </div>
  )
}
