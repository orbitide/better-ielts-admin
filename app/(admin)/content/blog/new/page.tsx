'use client'

import { BlogPostForm } from '@/components/content/BlogPostForm'

export default function NewBlogPostPage() {
  return (
    <div className="p-5 sm:p-6 max-w-5xl mx-auto">
      <BlogPostForm formTitle="New Blog Post" />
    </div>
  )
}
