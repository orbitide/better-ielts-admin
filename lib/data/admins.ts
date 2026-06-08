import type { ManagedAdmin } from '@/lib/types/admin'
import { getAuditLogData } from '@/lib/mock/audit-log'

let admins: ManagedAdmin[] = [
  {
    id: 'admin-1',
    name: 'Super Admin',
    email: 'superadmin@betterielts.com',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SuperAdmin',
    role: 'SuperAdmin',
    status: 'active',
  },
  {
    id: 'admin-2',
    name: 'Content Manager',
    email: 'content@betterielts.com',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ContentManager',
    role: 'ContentManager',
    status: 'active',
  },
  {
    id: 'admin-3',
    name: 'Moderator',
    email: 'mod@betterielts.com',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Moderator',
    role: 'Moderator',
    status: 'active',
  },
]

export async function getAdmins(): Promise<ManagedAdmin[]> {
  return admins
}

export async function getAuditLog() {
  return getAuditLogData()
}
