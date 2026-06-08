import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const AddAdminSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['super_admin', 'content_manager', 'moderator']),
})
