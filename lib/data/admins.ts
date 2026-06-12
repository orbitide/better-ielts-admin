import { fetchAdminAdmins, fetchAuditLog, fetchAssignableAdminRoles } from '@/lib/api/admin'

export async function getAdmins() {
  return fetchAdminAdmins()
}

export async function getAuditLog() {
  return fetchAuditLog()
}

export async function getAdminRoles() {
  return fetchAssignableAdminRoles()
}
