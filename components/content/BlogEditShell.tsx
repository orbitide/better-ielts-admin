'use client'

import { useState, useEffect } from 'react'
import { BlogPostForm } from './BlogPostForm'
import { fetchBlogPostById, fetchBlogCategories } from '@/lib/api/blog'
import type { BlogPost, BlogCategory } from '@/lib/types/content'

export function BlogEditShell({ id }: { id: string }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading')

  useEffect(() => {
    Promise.all([
      fetchBlogPostById(id).catch(() => null),
      fetchBlogCategories().catch(() => [] as BlogCategory[]),
    ]).then(([p, cats]) => {
      if (!p) {
        setStatus('not-found')
        return
      }
      setPost(p)
      setCategories(cats)
      setStatus('ready')
    })
  }, [id])

  if (status === 'loading') {
    return (
      <div className="space-y-5">
        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
        <div className="h-7 w-48 rounded bg-muted animate-pulse" />
        <div className="rounded-xl border border-border p-5 space-y-4">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-9 rounded bg-muted animate-pulse" />
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                <div className="h-9 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="h-16 rounded bg-muted animate-pulse" />
        </div>
        <div className="rounded-xl border border-border p-5">
          <div className="h-4 w-20 rounded bg-muted animate-pulse mb-3" />
          <div className="h-64 rounded bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  if (status === 'not-found') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-sm">Post not found.</p>
      </div>
    )
  }

  return <BlogPostForm initialData={post!} formTitle="Edit Post" categories={categories} />
}
