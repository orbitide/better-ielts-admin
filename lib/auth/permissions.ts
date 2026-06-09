import type { AdminUser, Permission } from '@/lib/types/admin'

export type { Permission }

const ROLE_PERMISSIONS: Record<AdminUser['role'], Permission[]> = {
  SuperAdmin: [
    'users:view', 'users:edit', 'users:delete', 'users:ban',
    'ielts:view', 'ielts:edit', 'ielts:delete',
    'content:view', 'content:edit', 'content:publish', 'content:delete',
    'community:view', 'community:moderate', 'community:delete',
    'subscriptions:view',
    'admins:manage',
  ],
  ContentManager: [
    'users:view',
    'ielts:view', 'ielts:edit', 'ielts:delete',
    'content:view', 'content:edit', 'content:publish', 'content:delete',
    'community:view',
    'subscriptions:view',
  ],
  Moderator: [
    'users:view', 'users:edit', 'users:ban',
    'ielts:view',
    'content:view',
    'community:view', 'community:moderate', 'community:delete',
    'subscriptions:view',
  ],
}

export function hasPermission(role: AdminUser['role'], permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

const ROUTE_ROLE_MAP: { prefix: string; roles: AdminUser['role'][] }[] = [
  { prefix: '/settings/admins', roles: ['SuperAdmin'] },
  { prefix: '/settings/roles', roles: ['SuperAdmin'] },
]

export function canAccessRoute(role: AdminUser['role'], pathname: string): boolean {
  for (const { prefix, roles } of ROUTE_ROLE_MAP) {
    if (pathname.startsWith(prefix)) {
      return roles.includes(role)
    }
  }
  return true
}
