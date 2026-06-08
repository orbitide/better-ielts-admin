'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Plus, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SearchInput } from '@/components/ui/SearchInput'
import { PageHeader } from '@/components/ui/PageHeader'
import type { BlogPost } from '@/lib/types/content'
import { RoleGate } from '@/components/auth/RoleGate'

type BlogTableProps = {
  posts: BlogPost[]
  onDelete: (id: string) => void
}

export function BlogTable({ posts, onDelete }: BlogTableProps) {
  const [query, setQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null)

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader title="Blog Posts" description="Manage articles and guides published on the platform.">
        <Link
          href="/content/blog/categories"
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-8 px-3 text-xs gap-1.5 border border-border bg-transparent hover:bg-accent hover:text-accent-foreground"
        >
          Categories
        </Link>
        <RoleGate permission="content:edit">
          <Link
            href="/content/blog/new"
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-8 px-3 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Post
          </Link>
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
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden xl:table-cell">Tags</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-muted-foreground">
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
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-block rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="inline-block rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setPreviewPost(post)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title="Preview"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <RoleGate permission="content:edit">
                        <Link
                          href={`/content/blog/${post.id}`}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors inline-flex"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </RoleGate>
                      <RoleGate permission="content:delete">
                        <button
                          onClick={() => setDeleteTarget(post)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete"
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

      {/* Preview modal */}
      <Modal
        open={previewPost !== null}
        onClose={() => setPreviewPost(null)}
        title={previewPost?.title ?? ''}
        className="max-w-2xl"
      >
        {previewPost && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant={previewPost.status === 'published' ? 'success' : 'warning'} className="text-xs">
                {previewPost.status}
              </Badge>
              <span>{previewPost.category}</span>
              <span>·</span>
              <span>{previewPost.author}</span>
              {previewPost.publishedAt && <><span>·</span><span>{previewPost.publishedAt}</span></>}
            </div>
            {previewPost.excerpt && (
              <p className="text-sm text-muted-foreground italic border-l-2 border-border pl-3">
                {previewPost.excerpt}
              </p>
            )}
            {previewPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {previewPost.tags.map((tag) => (
                  <span key={tag} className="inline-block rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div
              className="max-h-[60vh] overflow-y-auto text-sm leading-relaxed
                [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2
                [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
                [&_p]:mb-2 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2
                [&_li]:mb-0.5
                [&_strong]:font-semibold [&_em]:italic
                [&_u]:underline [&_s]:line-through
                [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
                [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_blockquote]:mb-2
                [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border [&_hr]:my-4
                [&_img]:max-w-full [&_img]:rounded-md [&_img]:my-3 [&_img]:block
                [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4
                [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:bg-muted/60 [&_th]:font-semibold [&_th]:text-left
                [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top"
              dangerouslySetInnerHTML={{ __html: previewPost.content }}
            />
            <div className="flex justify-end pt-2 border-t border-border">
              <Link
                href={`/content/blog/${previewPost.id}`}
                className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-8 px-3 text-xs gap-1.5 border border-border bg-transparent hover:bg-accent hover:text-accent-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Post
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete Post">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.title}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (deleteTarget) {
                onDelete(deleteTarget.id)
                setDeleteTarget(null)
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
