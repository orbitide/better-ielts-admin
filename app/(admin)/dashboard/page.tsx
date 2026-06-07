import { getDashboardStats, getUserGrowth, getSubscriptionBreakdown } from '@/lib/data/stats'
import { getRecentTransactions } from '@/lib/data/transactions'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { UserGrowthChart } from '@/components/dashboard/UserGrowthChart'
import { SubscriptionBreakdown } from '@/components/dashboard/SubscriptionBreakdown'
import { LastTransactionsTable } from '@/components/dashboard/LastTransactionsTable'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const [stats, growth, subBreakdown, recentTransactions] = await Promise.all([
    getDashboardStats(),
    getUserGrowth(),
    getSubscriptionBreakdown(),
    getRecentTransactions(),
  ])

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="Platform overview and key metrics."
      />

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly registered users over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <UserGrowthChart data={growth} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Breakdown</CardTitle>
            <CardDescription>Distribution of Free, Pro, and Elite plans</CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionBreakdown data={subBreakdown} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last Transactions</CardTitle>
          <CardDescription>5 most recent payments on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <LastTransactionsTable transactions={recentTransactions} />
        </CardContent>
      </Card>
    </div>
  )
}
