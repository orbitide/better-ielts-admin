import { z } from 'zod'

export const ManageSubscriptionSchema = z.object({
  plan: z.enum(['pro', 'elite']),
  status: z.enum(['active', 'cancelled', 'past_due']),
  renewsAt: z.string().min(1, 'Required'),
})
