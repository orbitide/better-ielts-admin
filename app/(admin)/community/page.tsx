import { getCommunityThreads } from '@/lib/data/community'
import { ThreadsTable } from '@/components/community/ThreadsTable'

export const metadata = { title: 'Community' }

export default async function CommunityPage() {
  const threads = await getCommunityThreads()
  return (
    <div className="p-5 sm:p-6 max-w-6xl mx-auto">
      <ThreadsTable initialThreads={threads} />
    </div>
  )
}
