'use server'

import { revalidatePath } from 'next/cache'
import { updateSubscription } from '@/lib/api/admin'

export async function manageSubscriptionAction(
  id: string,
  data: { plan: string; status: string; renewsAt: string }
) {
  await updateSubscription(id, data)
  revalidatePath('/subscriptions')
}
