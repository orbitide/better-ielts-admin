'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { ManagedAdmin } from '@/lib/types/admin'

type AddAdminModalProps = {
  open: boolean
  onClose: () => void
  onAdd: (admin: ManagedAdmin) => void
}

const roleOptions: { value: ManagedAdmin['role']; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'content_manager', label: 'Content Manager' },
  { value: 'moderator', label: 'Moderator' },
]

export function AddAdminModal({ open, onClose, onAdd }: AddAdminModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<ManagedAdmin['role']>('moderator')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newAdmin: ManagedAdmin = {
      id: `admin-${Date.now()}`,
      name,
      email,
      role,
      avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      status: 'active',
    }
    onAdd(newAdmin)
    setName('')
    setEmail('')
    setRole('moderator')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Admin">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@betterielts.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Role</label>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value as ManagedAdmin['role'])}
            className="w-full"
          >
            {roleOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">Add Admin</Button>
        </div>
      </form>
    </Modal>
  )
}
