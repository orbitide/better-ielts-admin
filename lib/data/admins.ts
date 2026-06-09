import { fetchAdminAdmins, fetchAuditLog } from '@/lib/api/admin'

export async function getAdmins() {
  return fetchAdminAdmins()
}

export async function getAuditLog() {
  return fetchAuditLog()
}
