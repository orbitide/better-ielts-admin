import { z } from 'zod'

export function fieldErrors(err: z.ZodError): Record<string, string> {
  return Object.fromEntries(
    Object.entries(err.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ''])
  )
}
