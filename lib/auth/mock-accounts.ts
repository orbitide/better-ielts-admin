import type { AdminUser } from '@/lib/types/admin'

type MockAccount = {
  email: string
  password: string
  adminUser: AdminUser
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    email: 'superadmin@betterielts.com',
    password: 'super123',
    adminUser: {
      id: 'admin-1',
      name: 'Super Admin',
      email: 'superadmin@betterielts.com',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SuperAdmin',
      role: 'SuperAdmin',
    },
  },
  {
    email: 'content@betterielts.com',
    password: 'content123',
    adminUser: {
      id: 'admin-2',
      name: 'Content Manager',
      email: 'content@betterielts.com',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ContentManager',
      role: 'ContentManager',
    },
  },
  {
    email: 'mod@betterielts.com',
    password: 'mod123',
    adminUser: {
      id: 'admin-3',
      name: 'Moderator',
      email: 'mod@betterielts.com',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Moderator',
      role: 'Moderator',
    },
  },
]

export const ADMIN_CREDENTIALS = MOCK_ACCOUNTS[0]
