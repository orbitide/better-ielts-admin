import { getBlogCategories } from '@/lib/data/content'
import { BlogPostForm } from '@/components/content/BlogPostForm'

export const metadata = { title: 'New Blog Post' }

export default async function NewBlogPostPage() {
  const categories = await getBlogCategories()
  return (
    <div className="p-5 sm:p-6 max-w-5xl mx-auto">
      <BlogPostForm formTitle="New Blog Post" categories={categories} />
    </div>
  )
}
