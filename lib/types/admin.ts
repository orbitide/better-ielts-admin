export type AdminUser = {
  id: string
  name: string
  email: string
  avatarUrl: string
  role: 'SuperAdmin' | 'ContentManager' | 'Moderator'
}

export type Permission =
  | 'users:view' | 'users:edit' | 'users:delete' | 'users:ban'
  | 'ielts:view' | 'ielts:edit' | 'ielts:delete'
  | 'content:view' | 'content:edit' | 'content:publish' | 'content:delete'
  | 'subscriptions:view'
  | 'admins:manage'

export type AuditLogEntry = {
  id: string
  adminId: string
  adminName: string
  action: string
  timestamp: string
}

export type ManagedAdmin = AdminUser & { status: 'active' | 'disabled' }

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
