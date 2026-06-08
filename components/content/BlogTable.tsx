'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Plus, Eye, Clock, Calendar, Globe, X } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SearchInput } from '@/components/ui/SearchInput'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  DataTable,
  DataTableToolbar,
  DataTablePagination,
  TableTagList,
  type ColumnDef,
} from '@/components/ui/DataTable'
import type { BlogPost } from '@/lib/types/content'
import { RoleGate } from '@/components/auth/RoleGate'

const CATEGORY_COLORS = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300',
  'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
]

function getCategoryColor(category: string): string {
  let hash = 0
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) & 0xffffffff
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length]
}

function getReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function formatPreviewDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

type BlogTableProps = {
  posts: BlogPost[]
  onDelete: (id: string) => Promise<void>
  totalCount?: number
  loading?: boolean
}

export function BlogTable({ posts, onDelete, totalCount, loading }: BlogTableProps) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null)

  const PAGE_SIZE = 20
  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  )
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const columns: ColumnDef<BlogPost>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <span className="font-medium max-w-xs truncate block">{row.original.title}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.category}</span>
      ),
      meta: { className: 'hidden sm:table-cell' },
    },
    {
      accessorKey: 'author',
      header: 'Author',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.author}</span>
      ),
      meta: { className: 'hidden md:table-cell' },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'published' ? 'success' : 'warning'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'publishedAt',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.publishedAt ?? row.original.updatedAt}
        </span>
      ),
      meta: { className: 'hidden lg:table-cell' },
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      enableSorting: false,
      cell: ({ row }) => <TableTagList tags={row.original.tags} />,
      meta: { className: 'hidden xl:table-cell' },
    },
    {
      id: 'actions',
      enableSorting: false,
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => setPreviewPost(row.original)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Preview"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <RoleGate permission="content:edit">
            <Link
              href={`/content/blog/${row.original.id}`}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors inline-flex"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </RoleGate>
          <RoleGate permission="content:delete">
            <button
              onClick={() => setDeleteTarget(row.original)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </RoleGate>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Blog Posts"
        description="Manage articles and guides published on the platform."
      >
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

      <DataTableToolbar>
        <SearchInput
          value={query}
          onChange={(q) => { setQuery(q); setPage(1) }}
          placeholder="Search posts…"
          className="max-w-xs"
        />
      </DataTableToolbar>

      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        emptyMessage="No posts found."
      />

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        totalCount={filtered.length}
        sourceCount={totalCount ?? posts.length}
        onPageChange={setPage}
        countLabel={`${filtered.length} of ${totalCount ?? posts.length} posts`}
      />

      {/* Client preview modal */}
      <Modal
        open={previewPost !== null}
        onClose={() => setPreviewPost(null)}
        title=""
        className="max-w-3xl w-full !p-0 overflow-hidden"
      >
        {previewPost && (
          <div className="flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
                <span className="font-medium">Client View Preview</span>
                <Badge
                  variant={previewPost.status === 'published' ? 'success' : 'warning'}
                  className="text-xs"
                >
                  {previewPost.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/content/blog/${previewPost.id}`}
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-7 px-2.5 text-xs gap-1.5 border border-border bg-transparent hover:bg-accent hover:text-accent-foreground"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </Link>
                <button
                  onClick={() => setPreviewPost(null)}
                  className="rounded-md p-1 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto bg-background">
              <div className="py-10 px-4 max-w-2xl mx-auto">
                {previewPost.coverImageUrl && (
                  <div className="aspect-video rounded-2xl overflow-hidden bg-muted mb-8">
                    <img
                      src={previewPost.coverImageUrl}
                      alt={previewPost.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mb-4 capitalize ${getCategoryColor(previewPost.category)}`}
                >
                  {previewPost.category}
                </span>
                <h1 className="text-3xl font-bold tracking-tight mb-4">{previewPost.title}</h1>
                {previewPost.excerpt && (
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {previewPost.excerpt}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground">
                      {previewPost.author.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-medium text-foreground text-xs">{previewPost.author}</p>
                  </div>
                  {(previewPost.publishedAt ?? previewPost.updatedAt) && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatPreviewDate(previewPost.publishedAt ?? previewPost.updatedAt)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {getReadingTime(previewPost.content)} min read
                  </span>
                </div>
                {previewPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {previewPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <article
                  className="text-sm sm:text-base
                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-3
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
                    [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-1
                    [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:text-muted-foreground
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:text-muted-foreground
                    [&_li]:mb-1
                    [&_strong]:font-semibold [&_strong]:text-foreground [&_em]:italic
                    [&_u]:underline [&_s]:line-through
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_blockquote]:mb-4
                    [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border [&_hr]:my-6
                    [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-4 [&_img]:block
                    [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:mb-4
                    [&_code]:bg-muted [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono
                    [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4
                    [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:bg-muted/60 [&_th]:font-semibold [&_th]:text-left [&_th]:text-sm
                    [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:text-sm"
                  dangerouslySetInnerHTML={{ __html: previewPost.content }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Post"
      >
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-foreground">{deleteTarget?.title}</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={deleting}
            onClick={async () => {
              if (deleteTarget) {
                setDeleting(true)
                try {
                  await onDelete(deleteTarget.id)
                  setDeleteTarget(null)
                } finally {
                  setDeleting(false)
                }
              }
            }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
