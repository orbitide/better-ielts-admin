import type { AuditLogEntry } from '@/lib/types/admin'

let auditLog: AuditLogEntry[] = [
  { id: 'al-1', adminId: 'admin-1', adminName: 'Super Admin', action: 'Added new admin account: Moderator (moderator)', timestamp: '2026-06-07T09:30:00Z' },
  { id: 'al-2', adminId: 'admin-1', adminName: 'Super Admin', action: "Changed Content Manager's role from moderator to content_manager", timestamp: '2026-06-06T14:15:00Z' },
  { id: 'al-3', adminId: 'admin-1', adminName: 'Super Admin', action: 'Added new admin account: Content Manager (content_manager)', timestamp: '2026-06-05T11:00:00Z' },
  { id: 'al-4', adminId: 'admin-1', adminName: 'Super Admin', action: 'Disabled account for Moderator', timestamp: '2026-06-04T16:45:00Z' },
  { id: 'al-5', adminId: 'admin-1', adminName: 'Super Admin', action: 'Enabled account for Moderator', timestamp: '2026-06-04T17:00:00Z' },
  { id: 'al-6', adminId: 'admin-1', adminName: 'Super Admin', action: "Changed Moderator's role from content_manager to moderator", timestamp: '2026-06-03T10:20:00Z' },
  { id: 'al-7', adminId: 'admin-2', adminName: 'Content Manager', action: 'Published IELTS Reading Test: Academic Set 3', timestamp: '2026-06-02T13:30:00Z' },
  { id: 'al-8', adminId: 'admin-3', adminName: 'Moderator', action: 'Deleted community thread: "Best IELTS prep resources"', timestamp: '2026-06-01T09:15:00Z' },
  { id: 'al-9', adminId: 'admin-1', adminName: 'Super Admin', action: 'Platform settings updated', timestamp: '2026-05-31T12:00:00Z' },
  { id: 'al-10', adminId: 'admin-2', adminName: 'Content Manager', action: 'Created new blog post: IELTS Writing Tips 2026', timestamp: '2026-05-30T14:45:00Z' },
]

export function getAuditLogData(): AuditLogEntry[] {
  return auditLog
}

export function addAuditEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  auditLog = [
    { ...entry, id: `al-${Date.now()}`, timestamp: new Date().toISOString() },
    ...auditLog,
  ]
}
