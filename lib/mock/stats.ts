import type { DashboardStats, UserGrowthPoint } from '@/lib/types/admin'

export const mockDashboardStats: DashboardStats = {
  totalUsers: 12847,
  userGrowthPercent: 8.2,
  activeSubscriptions: 4231,
  proSubscriptions: 3108,
  eliteSubscriptions: 1123,
  testsTakenThisMonth: 28504,
  revenueThisMonth: 18420,
  revenueGrowthPercent: 12.4,
}

export const mockUserGrowth: UserGrowthPoint[] = [
  { month: 'Jan', users: 8200, newUsers: 620 },
  { month: 'Feb', users: 8850, newUsers: 650 },
  { month: 'Mar', users: 9640, newUsers: 790 },
  { month: 'Apr', users: 10500, newUsers: 860 },
  { month: 'May', users: 11380, newUsers: 880 },
  { month: 'Jun', users: 12847, newUsers: 1467 },
]

export const mockSubscriptionBreakdown = [
  { name: 'Free', value: 8616, color: '#94a3b8' },
  { name: 'Pro', value: 3108, color: '#008d61' },
  { name: 'Elite', value: 1123, color: '#0ea5e9' },
]

export const mockContentCounts = {
  readingTests: 24,
  listeningTests: 18,
  writingTasks: 32,
  speakingSessions: 15,
  mockTests: 8,
  vocabTopics: 20,
  blogPosts: 47,
}
