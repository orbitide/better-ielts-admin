import { z } from 'zod'

export const EditUserSchema = z.object({
  name:  z.string().min(1, 'Name is required').max(150),
  email: z.string().email('Enter a valid email address'),
  plan:  z.enum(['free', 'pro', 'elite']),
})
