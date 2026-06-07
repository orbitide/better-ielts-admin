import type { SubscriptionRecord } from '@/lib/types/admin'

export const mockSubscriptions: SubscriptionRecord[] = [
  { id: 'sub-1', userId: 'user-2', userName: 'Priya Sharma', userEmail: 'priya.sharma@example.com', plan: 'elite', status: 'active', amount: 49, startedAt: '2025-08-15', renewsAt: '2026-08-15' },
  { id: 'sub-2', userId: 'user-5', userName: 'Sofia Andersen', userEmail: 'sofia.andersen@example.com', plan: 'elite', status: 'active', amount: 49, startedAt: '2025-07-05', renewsAt: '2026-07-05' },
  { id: 'sub-3', userId: 'user-9', userName: 'Lin Wei', userEmail: 'lin.wei@example.com', plan: 'elite', status: 'active', amount: 49, startedAt: '2025-08-22', renewsAt: '2026-08-22' },
  { id: 'sub-4', userId: 'user-14', userName: 'Elena Popescu', userEmail: 'elena.popescu@example.com', plan: 'elite', status: 'active', amount: 49, startedAt: '2025-06-18', renewsAt: '2026-06-18' },
  { id: 'sub-5', userId: 'user-17', userName: 'Omar Khalil', userEmail: 'omar.khalil@example.com', plan: 'elite', status: 'active', amount: 49, startedAt: '2025-08-08', renewsAt: '2026-08-08' },
  { id: 'sub-6', userId: 'user-18', userName: 'Nadia Chen', userEmail: 'nadia.chen@example.com', plan: 'elite', status: 'active', amount: 49, startedAt: '2025-07-22', renewsAt: '2026-07-22' },
  { id: 'sub-7', userId: 'user-1', userName: 'Alex Johnson', userEmail: 'alex.johnson@example.com', plan: 'pro', status: 'active', amount: 19, startedAt: '2025-09-01', renewsAt: '2026-09-01' },
  { id: 'sub-8', userId: 'user-4', userName: 'Yuki Tanaka', userEmail: 'yuki.tanaka@example.com', plan: 'pro', status: 'active', amount: 19, startedAt: '2025-11-20', renewsAt: '2026-11-20' },
  { id: 'sub-9', userId: 'user-7', userName: 'Fatima Nour', userEmail: 'fatima.nour@example.com', plan: 'pro', status: 'active', amount: 19, startedAt: '2025-10-12', renewsAt: '2026-10-12' },
  { id: 'sub-10', userId: 'user-8', userName: 'James Okafor', userEmail: 'james.okafor@example.com', plan: 'pro', status: 'active', amount: 19, startedAt: '2025-12-08', renewsAt: '2026-12-08' },
  { id: 'sub-11', userId: 'user-11', userName: 'David Kim', userEmail: 'david.kim@example.com', plan: 'pro', status: 'active', amount: 19, startedAt: '2025-09-30', renewsAt: '2026-09-30' },
  { id: 'sub-12', userId: 'user-12', userName: 'Maria Santos', userEmail: 'maria.santos@example.com', plan: 'pro', status: 'active', amount: 19, startedAt: '2025-11-05', renewsAt: '2026-11-05' },
  { id: 'sub-13', userId: 'user-15', userName: 'Raj Kapoor', userEmail: 'raj.kapoor@example.com', plan: 'pro', status: 'active', amount: 19, startedAt: '2025-10-25', renewsAt: '2026-10-25' },
  { id: 'sub-14', userId: 'user-20', userName: 'Amara Diallo', userEmail: 'amara.diallo@example.com', plan: 'pro', status: 'active', amount: 19, startedAt: '2025-12-01', renewsAt: '2026-12-01' },
  { id: 'sub-15', userId: 'user-3', userName: 'Mohamed Al-Rashid', userEmail: 'mohamed.alrashid@example.com', plan: 'pro', status: 'cancelled', amount: 19, startedAt: '2025-10-01', renewsAt: '2026-01-01' },
]
