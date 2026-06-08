import { BlogEditShell } from '@/components/content/BlogEditShell'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return { title: `Edit Post — ${id}` }
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="p-5 sm:p-6 max-w-5xl mx-auto">
      <BlogEditShell id={id} />
    </div>
  )
}
