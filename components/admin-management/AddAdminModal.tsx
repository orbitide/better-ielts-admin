'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { AdminRoleOption, ManagedAdmin } from '@/lib/types/admin'
import { AddAdminSchema } from '@/lib/validations/auth'
import { fieldErrors } from '@/lib/validations/utils'
import { createAdminAccount } from '@/lib/api/admin'

type AddAdminModalProps = {
  open: boolean
  roles: AdminRoleOption[]
  onClose: () => void
  onAdd: (admin: ManagedAdmin) => void
}

function formatRoleLabel(name: string) {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2')
}

export function AddAdminModal({ open, roles, onClose, onAdd }: AddAdminModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && roles.length > 0 && !roleId) {
      setRoleId(roles[0].id)
    }
  }, [open, roles, roleId])

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRoleId(roles[0]?.id ?? '')
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = AddAdminSchema.safeParse({ name, email, roleId, password })
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }
    setErrors({})
    setLoading(true)

    try {
      const { admin, temporaryPassword } = await createAdminAccount({ name, email, roleId, password: password || undefined })
      onAdd(admin)
      resetForm()
      onClose()
      if (temporaryPassword) {
        toast.success(`Admin created. Temporary password: ${temporaryPassword}`)
      } else {
        toast.success('Admin created successfully.')
      }
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to create admin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Admin">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@betterielts.com" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to auto-generate"
            autoComplete="new-password"
          />
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Role</label>
          <Select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="w-full"
            disabled={roles.length === 0}
          >
            {roles.length === 0 ? (
              <option value="">No roles available</option>
            ) : (
              roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {formatRoleLabel(role.name)}
                </option>
              ))
            )}
          </Select>
          {errors.roleId && <p className="text-xs text-destructive mt-1">{errors.roleId}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" size="sm" disabled={loading || roles.length === 0}>
            {loading ? 'Adding…' : 'Add Admin'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
