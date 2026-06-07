import { getBlogPosts } from '@/lib/data/content'
import { BlogShell } from '@/components/content/BlogShell'

export const metadata = { title: 'Blog Posts' }

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return (
    <div className="p-5 sm:p-6 max-w-6xl mx-auto">
      <BlogShell initialPosts={posts} />
    </div>
  )
}
