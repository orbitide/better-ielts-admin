'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { fetchBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory } from '@/lib/api/blog'
import type { BlogCategory } from '@/lib/types/content'
import { BlogCategorySchema } from '@/lib/validations/blog'
import { fieldErrors } from '@/lib/validations/utils'

type Props = { initialCategories: BlogCategory[] }

function toSlug(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}

export function BlogCategoryShell({ initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories)

  useEffect(() => {
    fetchBlogCategories().then(setCategories).catch(() => {})
  }, [])

  // Add form
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Async state
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = BlogCategorySchema.safeParse({ name: newName, description: newDesc })
    if (!result.success) {
      setError(Object.values(fieldErrors(result.error))[0] ?? 'Validation failed')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const created = await createBlogCategory(newName.trim(), newDesc.trim())
      setCategories((prev) => [...prev, created])
      setNewName('')
      setNewDesc('')
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (cat: BlogCategory) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditDesc(cat.description)
    setError(null)
  }

  const commitEdit = async () => {
    if (!editingId) return
    const result = BlogCategorySchema.safeParse({ name: editName, description: editDesc })
    if (!result.success) {
      setError(Object.values(fieldErrors(result.error))[0] ?? 'Validation failed')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const updated = await updateBlogCategory(editingId, editName.trim(), editDesc.trim())
      setCategories((prev) => prev.map((c) => (c.id === editingId ? updated : c)))
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => { setEditingId(null); setError(null) }

  const handleDelete = async () => {
    if (!deleteId) return
    setSaving(true)
    setError(null)
    try {
      await deleteBlogCategory(deleteId)
      setCategories((prev) => prev.filter((c) => c.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
      setDeleteId(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/content/blog"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Blog Posts
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Blog Categories</h1>
        {!showForm && (
          <Button size="sm" onClick={() => { setShowForm(true); setError(null) }}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Category
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
      )}

      {showForm && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="space-y-3">
              <p className="text-sm font-medium">New Category</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Name</label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Grammar"
                    required
                    autoFocus
                    disabled={saving}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Description</label>
                  <Input
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Short description…"
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setShowForm(false); setNewName(''); setNewDesc('') }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No categories yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Description</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Slug</th>
                  <th className="w-20 px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) =>
                  editingId === cat.id ? (
                    <tr key={cat.id} className="border-b border-border last:border-0 bg-accent/20">
                      <td className="px-3 py-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void commitEdit() } if (e.key === 'Escape') cancelEdit() }}
                          className="h-7 text-xs"
                          autoFocus
                          disabled={saving}
                        />
                      </td>
                      <td className="px-3 py-2 hidden sm:table-cell">
                        <Input
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void commitEdit() } if (e.key === 'Escape') cancelEdit() }}
                          placeholder="Description…"
                          className="h-7 text-xs"
                          disabled={saving}
                        />
                      </td>
                      <td className="px-3 py-2 text-muted-foreground font-mono text-xs hidden sm:table-cell">
                        {toSlug(editName)}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => void commitEdit()}
                            className="p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600 transition-colors disabled:opacity-50"
                            title="Save"
                            disabled={saving}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                            title="Cancel"
                            disabled={saving}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-accent/40 transition-colors group">
                      <td className="px-4 py-2.5 font-medium">{cat.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{cat.description || '—'}</td>
                      <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs hidden sm:table-cell">{cat.slug}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(cat.id)}
                            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Category">
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to delete{' '}
          <strong>{categories.find((c) => c.id === deleteId)?.name}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)} disabled={saving}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={() => void handleDelete()} disabled={saving}>
            {saving ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
