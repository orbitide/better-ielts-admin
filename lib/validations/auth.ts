import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const AddAdminSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Enter a valid email address'),
  roleId: z.string().min(1, 'Role is required'),
  password: z.union([z.string().length(0), z.string().min(6, 'Password must be at least 6 characters')]).optional(),
})
