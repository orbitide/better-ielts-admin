'use client'

import { useState, useTransition } from 'react'
import { Lock, Plus, X, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import type { BackendRole, BackendPermission } from '@/lib/types/roles'
import {
  createRole,
  updateRole,
  getRolePermissions,
  assignPermission,
  removePermission,
} from '@/lib/api/roles'

type Props = {
  initialRoles: BackendRole[]
  allPermissions: BackendPermission[]
}

type PermissionMap = Record<string, boolean>

function groupPermissions(permissions: BackendPermission[]) {
  return permissions.reduce<Record<string, BackendPermission[]>>((acc, p) => {
    if (!acc[p.module]) acc[p.module] = []
    acc[p.module].push(p)
    return acc
  }, {})
}

export function RolesManagementShell({ initialRoles, allPermissions }: Props) {
  const [roles, setRoles] = useState<BackendRole[]>(initialRoles)
  const [selectedRole, setSelectedRole] = useState<BackendRole | null>(null)
  const [permMap, setPermMap] = useState<PermissionMap>({})
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [loadingRole, setLoadingRole] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create-role form state
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [isPending, startTransition] = useTransition()

  const grouped = groupPermissions(allPermissions)

  async function selectRole(role: BackendRole) {
    setSelectedRole(role)
    setError(null)
    setLoadingRole(true)
    try {
      const perms = await getRolePermissions(role.id)
      const map: PermissionMap = {}
      for (const p of perms) map[p.id] = true
      setPermMap(map)
    } catch {
      setError('Failed to load role permissions.')
    } finally {
      setLoadingRole(false)
    }
  }

  async function togglePermission(permission: BackendPermission) {
    if (!selectedRole || togglingId) return
    const had = !!permMap[permission.id]
    setTogglingId(permission.id)
    setPermMap((prev) => ({ ...prev, [permission.id]: !had }))
    try {
      if (had) {
        await removePermission(selectedRole.id, permission.id)
      } else {
        await assignPermission(selectedRole.id, permission.id)
      }
    } catch {
      // revert on failure
      setPermMap((prev) => ({ ...prev, [permission.id]: had }))
      setError(`Failed to ${had ? 'remove' : 'assign'} permission.`)
    } finally {
      setTogglingId(null)
    }
  }

  function handleCreate() {
    if (!newName.trim()) return
    startTransition(async () => {
      try {
        const role = await createRole(newName.trim(), newDesc.trim())
        setRoles((prev) => [...prev, role])
        setNewName('')
        setNewDesc('')
        setShowCreate(false)
        selectRole(role)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to create role.')
      }
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 min-h-[500px]">
      {/* Left — Role list */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Roles</span>
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-border hover:bg-accent transition-colors"
          >
            {showCreate ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            {showCreate ? 'Cancel' : 'New Role'}
          </button>
        </div>

        {showCreate && (
          <div className="rounded-lg border border-border p-3 space-y-2 bg-card">
            <input
              placeholder="Role name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <input
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              onClick={handleCreate}
              disabled={isPending || !newName.trim()}
              className="flex items-center gap-1.5 w-full justify-center rounded-md bg-primary text-primary-foreground text-xs px-3 py-1.5 hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              Create
            </button>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {/* System roles first */}
          {[...roles].sort((a, b) => (b.isSystem ? 1 : 0) - (a.isSystem ? 1 : 0)).map((role) => (
            <button
              key={role.id}
              onClick={() => selectRole(role)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors w-full',
                selectedRole?.id === role.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent text-foreground'
              )}
            >
              {role.isSystem && (
                <Lock className={cn('h-3 w-3 shrink-0', selectedRole?.id === role.id ? 'text-primary-foreground/70' : 'text-muted-foreground')} />
              )}
              <div className="min-w-0">
                <p className="font-medium truncate">{role.name}</p>
                {role.description && (
                  <p className={cn('text-xs truncate', selectedRole?.id === role.id ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {role.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right — Permission matrix */}
      <div className="rounded-lg border border-border bg-card">
        {!selectedRole ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-8">
            Select a role to view and edit its permissions.
          </div>
        ) : loadingRole ? (
          <div className="flex items-center justify-center h-full p-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="divide-y divide-border">
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">{selectedRole.name}</h3>
                {selectedRole.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedRole.description}</p>
                )}
              </div>
              {selectedRole.isSystem && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
                  <Lock className="h-2.5 w-2.5" /> System
                </span>
              )}
            </div>

            {error && (
              <div className="px-4 py-2 text-xs text-destructive bg-destructive/5">{error}</div>
            )}

            <div className="overflow-y-auto max-h-[520px]">
              {Object.entries(grouped).map(([module, perms]) => (
                <div key={module}>
                  <div className="px-4 py-2 bg-muted/40">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {module}
                    </span>
                  </div>
                  {perms.map((perm) => {
                    const enabled = !!permMap[perm.id]
                    const toggling = togglingId === perm.id
                    return (
                      <label
                        key={perm.id}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-accent/50 transition-colors',
                          toggling && 'opacity-60'
                        )}
                      >
                        <div
                          role="checkbox"
                          aria-checked={enabled}
                          onClick={() => !toggling && togglePermission(perm)}
                          className={cn(
                            'h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer',
                            enabled
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-border bg-background'
                          )}
                        >
                          {toggling ? (
                            <Loader2 className="h-2.5 w-2.5 animate-spin" />
                          ) : enabled ? (
                            <Check className="h-2.5 w-2.5" />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm">{perm.description || perm.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{perm.name}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
