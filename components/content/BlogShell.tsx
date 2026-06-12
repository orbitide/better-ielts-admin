'use client'

import { useState, useEffect } from 'react'
import { BlogTable } from './BlogTable'
import { fetchBlogPosts, deleteBlogPost } from '@/lib/api/blog'
import type { BlogPostsPage } from '@/lib/api/blog'
import { Button } from '@/components/ui/Button'

export function BlogShell() {
  const [posts, setPosts] = useState<BlogPostsPage['posts']>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadPage = async (p: number) => {
    setLoading(true)
    try {
      const data = await fetchBlogPosts(p)
      setPosts(data.posts)
      setPage(data.page)
      setTotalPages(data.totalPages)
      setTotalCount(data.totalCount)
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPage(1)
  }, [])

  const handleDelete = async (id: string) => {
    await deleteBlogPost(id)
    loadPage(page)
  }

  return (
    <div className="space-y-3">
      <BlogTable posts={posts} onDelete={handleDelete} totalCount={totalCount} loading={loading} />
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages} · {totalCount} posts total
          </p>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => loadPage(page - 1)}
            >
              ← Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => loadPage(page + 1)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
