'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SearchInput } from '@/components/ui/SearchInput'
import { PageHeader } from '@/components/ui/PageHeader'
import type { BlogPost } from '@/lib/types/content'
import { RoleGate } from '@/components/auth/RoleGate'

type BlogTableProps = {
  posts: BlogPost[]
  onNew: () => void
  onEdit: (post: BlogPost) => void
  onDelete: (id: string) => void
}

export function BlogTable({ posts, onNew, onEdit, onDelete }: BlogTableProps) {
  const [query, setQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader title="Blog Posts" description="Manage articles and guides published on the platform.">
        <RoleGate permission="content:edit">
          <Button onClick={onNew} size="sm">
            <Plus className="h-3.5 w-3.5" />
            New Post
          </Button>
        </RoleGate>
      </PageHeader>

      <SearchInput value={query} onChange={setQuery} placeholder="Search posts…" className="max-w-xs" />

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Title</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Author</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden lg:table-cell">Date</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  No posts found.
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{post.title}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{post.category}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{post.author}</td>
                  <td className="px-4 py-3">
                    <Badge variant={post.status === 'published' ? 'success' : 'warning'}>
                      {post.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {post.publishedAt ?? post.updatedAt}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <RoleGate permission="content:edit">
                        <button
                          onClick={() => onEdit(post)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </RoleGate>
                      <RoleGate permission="content:delete">
                        <button
                          onClick={() => setDeleteTarget(post)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </RoleGate>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} of {posts.length} posts</p>

      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete Post">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.title}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={() => { if (deleteTarget) { onDelete(deleteTarget.id); setDeleteTarget(null) } }}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
