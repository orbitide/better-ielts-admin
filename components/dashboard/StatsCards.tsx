import { Users, CreditCard, ClipboardCheck, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import type { DashboardStats } from '@/lib/types/admin'

type StatsCardsProps = {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      sub: `+${stats.userGrowthPercent}% this month`,
      icon: Users,
      iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      label: 'Active Subscriptions',
      value: stats.activeSubscriptions.toLocaleString(),
      sub: `Pro: ${stats.proSubscriptions.toLocaleString()} · Elite: ${stats.eliteSubscriptions.toLocaleString()}`,
      icon: CreditCard,
      iconClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      label: 'Tests Taken (Month)',
      value: stats.testsTakenThisMonth.toLocaleString(),
      sub: 'All 4 skills combined',
      icon: ClipboardCheck,
      iconClass: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    },
    {
      label: 'Revenue (Month)',
      value: `$${stats.revenueThisMonth.toLocaleString()}`,
      sub: `+${stats.revenueGrowthPercent}% vs last month`,
      icon: DollarSign,
      iconClass: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <div className={`flex h-7 w-7 items-center justify-center rounded-md ${item.iconClass}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold">{item.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
