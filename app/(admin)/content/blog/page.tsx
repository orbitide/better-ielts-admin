import { getBlogPosts } from '@/lib/data/content'
import { BlogShell } from '@/components/content/BlogShell'

export const metadata = { title: 'Blog Posts' }

export default async function BlogPage() {
  const data = await getBlogPosts(1)
  return (
    <div className="p-5 sm:p-6 max-w-6xl mx-auto">
      <BlogShell initialData={data} />
    </div>
  )
}
