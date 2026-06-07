import { cache } from 'react'
import { delay } from '@/lib/utils/delay'
import { mockUsers } from '@/lib/mock/users'

export const getUsers = cache(async () => {
  await delay(150)
  return mockUsers
})

export const getUserById = cache(async (id: string) => {
  await delay(120)
  return mockUsers.find((u) => u.id === id) ?? null
})
