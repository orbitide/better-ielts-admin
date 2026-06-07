export type AdminUser = {
  id: string
  name: string
  email: string
  avatarUrl: string
  role: 'super_admin' | 'content_manager' | 'moderator'
}

export type DashboardStats = {
  totalUsers: number
  userGrowthPercent: number
  activeSubscriptions: number
  proSubscriptions: number
  eliteSubscriptions: number
  testsTakenThisMonth: number
  revenueThisMonth: number
  revenueGrowthPercent: number
}

export type UserGrowthPoint = {
  month: string
  users: number
  newUsers: number
}

export type SubscriptionRecord = {
  id: string
  userId: string
  userName: string
  userEmail: string
  plan: 'pro' | 'elite'
  status: 'active' | 'cancelled' | 'past_due'
  amount: number
  startedAt: string
  renewsAt: string
}

export type Transaction = {
  id: string
  userId: string
  userName: string
  userEmail: string
  plan: 'pro' | 'elite'
  amount: number
  status: 'success' | 'failed' | 'refunded'
  paidAt: string
}
