'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import type { BlogCategory } from '@/lib/types/content'

type Props = { initialCategories: BlogCategory[] }

function toSlug(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}

export function BlogCategoryShell({ initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories)

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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) return
    setCategories((prev) => [
      ...prev,
      { id: `cat-${Date.now()}`, name: trimmed, slug: toSlug(trimmed), description: newDesc.trim() },
    ])
    setNewName('')
    setNewDesc('')
    setShowForm(false)
  }

  const startEdit = (cat: BlogCategory) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditDesc(cat.description)
  }

  const commitEdit = () => {
    const trimmed = editName.trim()
    if (!trimmed || !editingId) return
    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? { ...c, name: trimmed, slug: toSlug(trimmed), description: editDesc.trim() }
          : c
      )
    )
    setEditingId(null)
  }

  const cancelEdit = () => setEditingId(null)

  const handleDelete = () => {
    if (!deleteId) return
    setCategories((prev) => prev.filter((c) => c.id !== deleteId))
    setDeleteId(null)
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
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Category
          </Button>
        )}
      </div>

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
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Description</label>
                  <Input
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Short description…"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setShowForm(false); setNewName(''); setNewDesc('') }}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">Save</Button>
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
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitEdit() } if (e.key === 'Escape') cancelEdit() }}
                          className="h-7 text-xs"
                          autoFocus
                        />
                      </td>
                      <td className="px-3 py-2 hidden sm:table-cell">
                        <Input
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitEdit() } if (e.key === 'Escape') cancelEdit() }}
                          placeholder="Description…"
                          className="h-7 text-xs"
                        />
                      </td>
                      <td className="px-3 py-2 text-muted-foreground font-mono text-xs hidden sm:table-cell">
                        {toSlug(editName)}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={commitEdit}
                            className="p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600 transition-colors"
                            title="Save"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                            title="Cancel"
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
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
