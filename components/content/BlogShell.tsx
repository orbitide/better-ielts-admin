'use client'

import { useState } from 'react'
import { BlogTable } from './BlogTable'
import { BlogFormModal } from './BlogFormModal'
import type { BlogPost } from '@/lib/types/content'

export function BlogShell({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)

  const handleNew = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (post: BlogPost) => {
    setEditing(post)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSave = (data: Partial<BlogPost>) => {
    if (editing) {
      setPosts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : p))
      )
    } else {
      const slug = (data.title ?? 'new-post')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      const newPost: BlogPost = {
        id: `bp-${Date.now()}`,
        title: data.title ?? '',
        slug,
        category: data.category ?? 'General',
        author: data.author ?? '',
        status: data.status ?? 'draft',
        publishedAt: data.status === 'published' ? new Date().toISOString().slice(0, 10) : null,
        updatedAt: new Date().toISOString().slice(0, 10),
        excerpt: data.excerpt ?? '',
      }
      setPosts((prev) => [newPost, ...prev])
    }
  }

  return (
    <>
      <BlogTable posts={posts} onNew={handleNew} onEdit={handleEdit} onDelete={handleDelete} />
      <BlogFormModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} onSave={handleSave} />
    </>
  )
}
