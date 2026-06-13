
import type { User } from '@/lib/types/user'
import type {
  DashboardStats,
  UserGrowthPoint,
  SubscriptionRecord,
  Transaction,
  ManagedAdmin,
  AuditLogEntry,
  AdminRoleOption,
} from '@/lib/types/admin'
import { httpClient } from "@/lib/api/http";

// ─── Users ───────────────────────────────────────────────────────────────────

type ApiUser = {
  id: string
  name: string
  email: string
  avatarUrl: string
  plan: string
  isActive: boolean
  targetBand: number | null
  createdAt: string
  currentBand?: { overall: number; listening: number; reading: number; writing: number; speaking: number }
  totalStudyHours?: number
}

function mapUser(u: ApiUser): User {
  return {
    id: u.id,
    name: u.name ?? '',
    email: u.email ?? '',
    avatarUrl: u.avatarUrl ?? '',
    targetBand: u.targetBand ?? 0,
    currentBand: u.currentBand ?? { overall: 0, listening: 0, reading: 0, writing: 0, speaking: 0 },
    totalStudyHours: u.totalStudyHours ?? 0,
    joinedAt: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '',
    plan: (u.plan as User['plan']) ?? 'free',
  }
}

export async function fetchAdminUsers(page = 1, pageSize = 20, search?: string, plan?: string) {
  const params: Record<string, string | number> = { page, pageSize }
  if (search) params.search = search
  if (plan) params.plan = plan
  const { data } = await httpClient.get('/api/admin/users', { params })
  const result = data.data as { items: ApiUser[]; totalCount: number; page: number; pageSize: number }
  return { ...result, items: result.items.map(mapUser) }
}

export async function fetchAdminUserById(id: string): Promise<User> {
  const { data } = await httpClient.get(`/api/admin/users/${id}`)
  return mapUser(data.data as ApiUser)
}

export async function updateAdminUser(id: string, body: { plan?: string; isActive?: boolean }): Promise<User> {
  const { data } = await httpClient.patch(`/api/admin/users/${id}`, body)
  return mapUser(data.data as ApiUser)
}

export async function deleteAdminUser(id: string): Promise<void> {
  await httpClient.delete(`/api/admin/users/${id}`)
}

// ─── Stats ───────────────────────────────────────────────────────────────────

type ApiStats = {
  totalUsers: number
  userGrowthPercent: number
  activeSubscriptions: number
  proSubscriptions: number
  eliteSubscriptions: number
  freeUsers: number
  testsTakenThisMonth: number
  revenueThisMonth: number
  revenueGrowthPercent: number
  contentCounts: {
    readingTests: number
    listeningTests: number
    writingTasks: number
    speakingSessions: number
    vocabularyTopics: number
    mockTests: number
    blogPosts: number
  }
  userGrowth: { month: string; users: number; newUsers: number }[]
  subscriptionBreakdown: { plan: string; count: number; percentage: number }[]
}

export async function fetchAdminStats(): Promise<{
  stats: DashboardStats
  userGrowth: UserGrowthPoint[]
  subscriptionBreakdown: { plan: string; count: number; percentage: number }[]
  contentCounts: ApiStats['contentCounts']
}> {
  const { data } = await httpClient.get('/api/admin/stats')
  const s = data.data as ApiStats
  return {
    stats: {
      totalUsers: s.totalUsers,
      userGrowthPercent: s.userGrowthPercent,
      activeSubscriptions: s.activeSubscriptions,
      proSubscriptions: s.proSubscriptions,
      eliteSubscriptions: s.eliteSubscriptions,
      testsTakenThisMonth: s.testsTakenThisMonth,
      revenueThisMonth: s.revenueThisMonth,
      revenueGrowthPercent: s.revenueGrowthPercent,
    },
    userGrowth: s.userGrowth,
    subscriptionBreakdown: s.subscriptionBreakdown,
    contentCounts: s.contentCounts,
  }
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

type ApiSubscription = {
  id: string
  userId: string
  userName: string
  userEmail: string
  plan: string
  status: string
  amount: number
  startedAt: string
  renewsAt: string
}

function mapSubscription(s: ApiSubscription): SubscriptionRecord {
  return {
    id: s.id,
    userId: s.userId,
    userName: s.userName,
    userEmail: s.userEmail,
    plan: s.plan as SubscriptionRecord['plan'],
    status: s.status as SubscriptionRecord['status'],
    amount: s.amount,
    startedAt: s.startedAt,
    renewsAt: s.renewsAt,
  }
}

export async function fetchAdminSubscriptions(page = 1, pageSize = 20) {
  const { data } = await httpClient.get('/api/admin/subscriptions', { params: { page, pageSize } })
  const result = data.data as { items: ApiSubscription[]; totalCount: number; page: number; pageSize: number }
  return { ...result, items: result.items.map(mapSubscription) }
}

export async function updateSubscription(
  id: string,
  body: { plan: string; status: string; renewsAt: string }
): Promise<SubscriptionRecord> {
  const { data } = await httpClient.patch(`/api/admin/subscriptions/${id}`, body)
  return mapSubscription(data.data as ApiSubscription)
}

export async function fetchRecentTransactions(): Promise<Transaction[]> {
  const subs = await fetchAdminSubscriptions(1, 5)
  return subs.items
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      userId: s.userId,
      userName: s.userName,
      userEmail: s.userEmail,
      plan: s.plan as Transaction['plan'],
      amount: s.amount,
      status: 'success' as const,
      paidAt: s.startedAt,
    }))
}

// ─── Audit Log ───────────────────────────────────────────────────────────────

export async function fetchAuditLog(): Promise<AuditLogEntry[]> {
  const { data } = await httpClient.get('/api/admin/auth/audit')
  const logs = data.data as Array<{
    id: string
    adminId: string | null
    adminName: string
    action: string
    timestamp: string
  }>
  return logs.map((l) => ({
    id: l.id,
    adminId: l.adminId ?? '',
    adminName: l.adminName ?? 'System',
    action: l.action,
    timestamp: l.timestamp,
  }))
}

// ─── Admins ───────────────────────────────────────────────────────────────────

type ApiManagedAdmin = {
  id: string
  name: string
  email: string
  avatarUrl: string
  roleId: string
  role: string
  status: string
}

type ApiAdminRoleOption = {
  id: string
  name: string
  description: string
}

function mapManagedAdmin(a: ApiManagedAdmin): ManagedAdmin {
  return {
    id: a.id,
    name: a.name ?? '',
    email: a.email ?? '',
    avatarUrl: a.avatarUrl ?? '',
    roleId: a.roleId,
    role: a.role ?? '',
    status: a.status === 'disabled' ? 'disabled' : 'active',
  }
}

export async function fetchAdminAdmins(): Promise<ManagedAdmin[]> {
  const { data } = await httpClient.get('/api/admin/auth/admins')
  const admins = data.data as ApiManagedAdmin[]
  return admins.map(mapManagedAdmin)
}

export async function fetchAssignableAdminRoles(): Promise<AdminRoleOption[]> {
  const { data } = await httpClient.get('/api/admin/auth/admins/roles')
  return (data.data as ApiAdminRoleOption[]) ?? []
}

export async function createAdminAccount(body: {
  name: string
  email: string
  roleId: string
  password?: string
}): Promise<{ admin: ManagedAdmin; temporaryPassword?: string }> {
  const { data } = await httpClient.post('/api/admin/auth/admins', body)
  const result = data.data as { admin: ApiManagedAdmin; temporaryPassword?: string | null }
  return {
    admin: mapManagedAdmin(result.admin),
    temporaryPassword: result.temporaryPassword ?? undefined,
  }
}

export async function updateAdminAccount(
  id: string,
  body: { roleId?: string; isActive?: boolean }
): Promise<ManagedAdmin> {
  const { data } = await httpClient.patch(`/api/admin/auth/admins/${id}`, body)
  return mapManagedAdmin(data.data as ApiManagedAdmin)
}
