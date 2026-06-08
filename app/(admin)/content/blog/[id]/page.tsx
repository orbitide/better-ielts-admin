import { notFound } from 'next/navigation'
import { getBlogPostById, getBlogCategories } from '@/lib/data/content'
import { BlogPostForm } from '@/components/content/BlogPostForm'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPostById(id)
  return { title: post ? `Edit: ${post.title}` : 'Post Not Found' }
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, categories] = await Promise.all([getBlogPostById(id), getBlogCategories()])
  if (!post) notFound()

  return (
    <div className="p-5 sm:p-6 max-w-5xl mx-auto">
      <BlogPostForm initialData={post} formTitle="Edit Post" categories={categories} />
    </div>
  )
}
