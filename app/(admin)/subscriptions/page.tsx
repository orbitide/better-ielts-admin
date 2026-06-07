import { getSubscriptions } from '@/lib/data/subscriptions'
import { SubscriptionStats } from '@/components/subscriptions/SubscriptionStats'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata = { title: 'Subscriptions' }

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions()
  return (
    <div className="p-5 sm:p-6 space-y-5 max-w-6xl mx-auto">
      <PageHeader title="Subscriptions" description="Billing overview and subscriber management." />
      <SubscriptionStats subscriptions={subscriptions} />
    </div>
  )
}
