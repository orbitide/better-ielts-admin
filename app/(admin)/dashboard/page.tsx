'use client'

import { useEffect, useState } from 'react'
import { fetchAdminStats, fetchRecentTransactions } from '@/lib/api/admin'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { UserGrowthChart } from '@/components/dashboard/UserGrowthChart'
import { SubscriptionBreakdown } from '@/components/dashboard/SubscriptionBreakdown'
import { LastTransactionsTable } from '@/components/dashboard/LastTransactionsTable'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import type { DashboardStats, Transaction, UserGrowthPoint } from '@/lib/types/admin'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [growth, setGrowth] = useState<UserGrowthPoint[]>([])
  const [subBreakdown, setSubBreakdown] = useState<{ plan: string; count: number; percentage: number }[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchAdminStats(), fetchRecentTransactions()])
      .then(([statsResult, transactions]) => {
        setStats(statsResult.stats)
        setGrowth(statsResult.userGrowth)
        setSubBreakdown(statsResult.subscriptionBreakdown)
        setRecentTransactions(transactions)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="Platform overview and key metrics."
      />

      {loading || !stats ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
