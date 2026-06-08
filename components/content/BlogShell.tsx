'use client'

import { useState } from 'react'
import { BlogTable } from './BlogTable'
import type { BlogPost } from '@/lib/types/content'

export function BlogShell({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return <BlogTable posts={posts} onDelete={handleDelete} />
}
