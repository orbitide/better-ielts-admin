import type { Transaction } from '@/lib/types/admin'

export const mockTransactions: Transaction[] = [
  { id: 'txn-1',  userId: 'user-8',  userName: 'James Okafor',       userEmail: 'james.okafor@example.com',       plan: 'pro',   amount: 19, status: 'success',  paidAt: '2025-12-08' },
  { id: 'txn-2',  userId: 'user-20', userName: 'Amara Diallo',        userEmail: 'amara.diallo@example.com',        plan: 'pro',   amount: 19, status: 'success',  paidAt: '2025-12-01' },
  { id: 'txn-3',  userId: 'user-4',  userName: 'Yuki Tanaka',         userEmail: 'yuki.tanaka@example.com',         plan: 'pro',   amount: 19, status: 'success',  paidAt: '2025-11-20' },
  { id: 'txn-4',  userId: 'user-12', userName: 'Maria Santos',        userEmail: 'maria.santos@example.com',        plan: 'pro',   amount: 19, status: 'success',  paidAt: '2025-11-05' },
  { id: 'txn-5',  userId: 'user-13', userName: 'Hassan Al-Farsi',     userEmail: 'hassan.alfarsi@example.com',      plan: 'elite', amount: 49, status: 'failed',   paidAt: '2025-10-30' },
  { id: 'txn-6',  userId: 'user-13', userName: 'Hassan Al-Farsi',     userEmail: 'hassan.alfarsi@example.com',      plan: 'elite', amount: 49, status: 'success',  paidAt: '2025-10-28' },
  { id: 'txn-7',  userId: 'user-15', userName: 'Raj Kapoor',          userEmail: 'raj.kapoor@example.com',          plan: 'pro',   amount: 19, status: 'success',  paidAt: '2025-10-25' },
  { id: 'txn-8',  userId: 'user-9',  userName: 'Lin Wei',             userEmail: 'lin.wei@example.com',             plan: 'elite', amount: 49, status: 'success',  paidAt: '2025-10-15' },
  { id: 'txn-9',  userId: 'user-7',  userName: 'Fatima Nour',         userEmail: 'fatima.nour@example.com',         plan: 'pro',   amount: 19, status: 'success',  paidAt: '2025-10-12' },
  { id: 'txn-10', userId: 'user-3',  userName: 'Mohamed Al-Rashid',   userEmail: 'mohamed.alrashid@example.com',    plan: 'pro',   amount: 19, status: 'refunded', paidAt: '2025-10-01' },
  { id: 'txn-11', userId: 'user-11', userName: 'David Kim',           userEmail: 'david.kim@example.com',           plan: 'pro',   amount: 19, status: 'success',  paidAt: '2025-09-30' },
  { id: 'txn-12', userId: 'user-1',  userName: 'Alex Johnson',        userEmail: 'alex.johnson@example.com',        plan: 'pro',   amount: 19, status: 'success',  paidAt: '2025-09-01' },
]
