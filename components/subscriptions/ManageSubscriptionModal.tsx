'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import type { SubscriptionRecord } from '@/lib/types/admin'
import { ManageSubscriptionSchema } from '@/lib/validations/subscriptions'
import { fieldErrors } from '@/lib/validations/utils'
import { updateSubscription } from '@/lib/api/admin'

type Props = {
  subscription: SubscriptionRecord | null
  open: boolean
  onClose: () => void
  onSaved: (subscription: SubscriptionRecord) => void
}

export function ManageSubscriptionModal({ subscription, open, onClose, onSaved }: Props) {
  const [plan, setPlan] = useState<SubscriptionRecord['plan']>('pro')
  const [status, setStatus] = useState<SubscriptionRecord['status']>('active')
  const [renewsAt, setRenewsAt] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (subscription) {
      setPlan(subscription.plan)
      setStatus(subscription.status)
      setRenewsAt(subscription.renewsAt.split('T')[0])
    }
  }, [subscription])

  const submit = async (overrideStatus?: SubscriptionRecord['status']) => {
    const effectiveStatus = overrideStatus ?? status
    const result = ManageSubscriptionSchema.safeParse({ plan, status: effectiveStatus, renewsAt })
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const updated = await updateSubscription(subscription!.id, { plan, status: effectiveStatus, renewsAt })
      onSaved(updated)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  return (
    <Modal open={open} onClose={onClose} title="Manage Subscription">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Plan</label>
          <Select value={plan} onChange={(e) => setPlan(e.target.value as SubscriptionRecord['plan'])} className="w-full">
            <option value="pro">Pro</option>
            <option value="elite">Elite</option>
          </Select>
          {errors.plan && <p className="text-xs text-destructive mt-1">{errors.plan}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as SubscriptionRecord['status'])} className="w-full">
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="past_due">Past Due</option>
          </Select>
          {errors.status && <p className="text-xs text-destructive mt-1">{errors.status}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Renewal Date</label>
          <Input
            type="date"
            value={renewsAt}
            onChange={(e) => setRenewsAt(e.target.value)}
          />
          {errors.renewsAt && <p className="text-xs text-destructive mt-1">{errors.renewsAt}</p>}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={loading || status === 'cancelled'}
            onClick={() => submit('cancelled')}
          >
            Cancel Subscription
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
