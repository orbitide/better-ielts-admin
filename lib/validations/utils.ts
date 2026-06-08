import { z } from 'zod'

export function fieldErrors(err: z.ZodError): Record<string, string> {
  const flat = err.flatten()
  const result: Record<string, string> = {}
  for (const [k, v] of Object.entries(flat.fieldErrors)) {
    const msgs = v as string[] | undefined
    result[k] = msgs?.[0] ?? ''
  }
  return result
}
