'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { UserAvatar } from '@/components/users/UserAvatar'
import type { User } from '@/lib/types/user'
import { EditUserSchema } from '@/lib/validations/users'
import { fieldErrors } from '@/lib/validations/utils'

type Props = {
  open: boolean
  onClose: () => void
  user: User | null
  onSave: (updated: User) => void
}

export function EditUserModal({ open, onClose, user, onSave }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState<'free' | 'pro' | 'elite'>('free')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPlan(user.plan)
      setErrors({})
    }
  }, [user])

  if (!user) return null

  function handleSave() {
    if (!user) return

    const result = EditUserSchema.safeParse({ name, email, plan })
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }
    setErrors({})

    onSave({ ...user, name: name.trim(), email: email.trim(), plan })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit User">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
        <UserAvatar name={name || user.name} size="md" />
        <div>
          <p className="font-semibold">{name || user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as 'free' | 'pro' | 'elite')}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="elite">Elite</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSave}>Save</Button>
      </div>
    </Modal>
  )
}
