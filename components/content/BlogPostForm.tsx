'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'
import { RichTextEditor } from '@/components/content/RichTextEditor'
import { TagInput } from '@/components/content/TagInput'
import { ImagePickerField } from '@/components/media/ImagePickerField'
import type { BlogPost, BlogCategory } from '@/lib/types/content'

type BlogPostFormProps = {
  initialData?: Partial<BlogPost>
  formTitle: string
  categories: BlogCategory[]
}

export function BlogPostForm({ initialData, formTitle, categories }: BlogPostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [category, setCategory] = useState(initialData?.category ?? (categories[0]?.name ?? ''))
  const [author, setAuthor] = useState(initialData?.author ?? '')
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status ?? 'draft')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
  const [content, setContent] = useState(initialData?.content ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(initialData?.coverImageUrl)
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => router.push('/content/blog'), 1200)
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
        {saved && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Saved successfully!</span>
        )}
      </div>

      <h1 className="text-xl font-semibold">{formTitle}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title…"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full">
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                  className="w-full"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Author</label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name…"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short description shown in post listings…"
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tags</label>
              <TagInput value={tags} onChange={setTags} placeholder="Type tag and press Enter or comma…" />
              <p className="text-xs text-muted-foreground">Press Enter or , to add a tag. Backspace removes the last tag.</p>
            </div>

            <ImagePickerField
              label="Cover Image"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              folder="blog"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-3">
            <label className="text-sm font-medium">Content</label>
            <RichTextEditor value={content} onChange={setContent} />
          </CardContent>
        </Card>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={() => router.push('/content/blog')}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={saved}>
            {saved ? 'Saving…' : initialData?.id ? 'Save Changes' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}
