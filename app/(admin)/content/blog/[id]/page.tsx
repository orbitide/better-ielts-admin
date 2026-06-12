'use client'

import { useParams } from 'next/navigation'
import { BlogEditShell } from '@/components/content/BlogEditShell'

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-5 sm:p-6 max-w-5xl mx-auto">
      <BlogEditShell id={id} />
    </div>
  )
}
