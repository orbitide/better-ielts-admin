'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'
import { RichTextEditor } from '@/components/content/RichTextEditor'
import { TagInput } from '@/components/content/TagInput'
import { ImagePickerField } from '@/components/media/ImagePickerField'
import { fetchBlogCategories, createBlogPost, updateBlogPost } from '@/lib/api/blog'
import { cn } from '@/lib/utils/utils'
import type { BlogPost, BlogCategory } from '@/lib/types/content'
import { BlogPostSchema } from '@/lib/validations/blog'
import { fieldErrors } from '@/lib/validations/utils'

type BlogPostFormProps = {
  initialData?: Partial<BlogPost>
  formTitle: string
  categories?: BlogCategory[]
}

export function BlogPostForm({ initialData, formTitle, categories: initialCategories = [] }: BlogPostFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories)

  useEffect(() => {
    fetchBlogCategories().then(setCategories).catch(() => {})
  }, [])

  const defaultCategoryId = initialData?.categoryId ?? ''
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [categoryId, setCategoryId] = useState(defaultCategoryId)
  const [author, setAuthor] = useState(initialData?.author ?? '')
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status ?? 'draft')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
  const [content, setContent] = useState(initialData?.content ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(initialData?.coverImageUrl)
  const [seoOpen, setSeoOpen] = useState(false)
  const [metaTitle, setMetaTitle] = useState(initialData?.seo?.metaTitle ?? '')
  const [metaDescription, setMetaDescription] = useState(initialData?.seo?.metaDescription ?? '')
  const [focusKeyword, setFocusKeyword] = useState(initialData?.seo?.focusKeyword ?? '')
  const [ogImage, setOgImage] = useState<string | undefined>(initialData?.seo?.ogImage)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = BlogPostSchema.safeParse({ title, categoryId, author, status, excerpt, content, coverImageUrl, tags, metaTitle, metaDescription, focusKeyword, ogImage })
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }
    setErrors({})

    setSaving(true)
    setError(null)
    try {
      const payload = {
        title,
        excerpt,
        content,
        coverImageUrl: coverImageUrl ?? '',
        authorName: author,
        categoryId,
        isPublished: status === 'published',
        tags,
      }
      if (initialData?.id) {
        await updateBlogPost(initialData.id, payload)
      } else {
        await createBlogPost(payload)
      }
      router.push('/content/blog')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save post.')
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
        {error && (
          <span className="text-sm text-red-500 font-medium">{error}</span>
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
              />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full">
                  {!categoryId && <option value="">Select a category…</option>}
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
                {errors.categoryId && <p className="text-xs text-destructive mt-1">{errors.categoryId}</p>}
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
                />
                {errors.author && <p className="text-xs text-destructive mt-1">{errors.author}</p>}
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

        {/* SEO card */}
        <Card>
          <button
            type="button"
            onClick={() => setSeoOpen((o) => !o)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-sm font-medium">Search Engine Optimisation</span>
            <div className="flex items-center gap-3">
              {!seoOpen && (metaTitle || metaDescription) && (
                <span className="text-xs text-muted-foreground">
                  {metaTitle.length > 0 && (
                    <span className={cn(
                      metaTitle.length <= 60 ? 'text-emerald-600' : metaTitle.length <= 70 ? 'text-amber-500' : 'text-red-500'
                    )}>{metaTitle.length}</span>
                  )}
                  {metaTitle.length > 0 && metaDescription.length > 0 && <span className="text-muted-foreground mx-1">/</span>}
                  {metaDescription.length > 0 && (
                    <span className={cn(
                      metaDescription.length <= 160 ? 'text-emerald-600' : metaDescription.length <= 180 ? 'text-amber-500' : 'text-red-500'
                    )}>{metaDescription.length}</span>
                  )}
                </span>
              )}
              {seoOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </button>

          {seoOpen && (
            <CardContent className="px-5 pb-5 pt-0 space-y-4 border-t border-input">
              {/* Meta Title */}
              <div className="space-y-1.5 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Meta Title</label>
                  <span className={cn(
                    'text-xs tabular-nums',
                    metaTitle.length === 0 ? 'text-muted-foreground' :
                    metaTitle.length <= 60 ? 'text-emerald-600' :
                    metaTitle.length <= 70 ? 'text-amber-500' : 'text-red-500'
                  )}>
                    {metaTitle.length} / 60
                  </span>
                </div>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Defaults to post title"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Meta Description</label>
                  <span className={cn(
                    'text-xs tabular-nums',
                    metaDescription.length === 0 ? 'text-muted-foreground' :
                    metaDescription.length <= 160 ? 'text-emerald-600' :
                    metaDescription.length <= 180 ? 'text-amber-500' : 'text-red-500'
                  )}>
                    {metaDescription.length} / 160
                  </span>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Defaults to excerpt"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>

              {/* Focus Keyword */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Focus Keyword</label>
                <Input
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="Primary search term"
                />
              </div>

              {/* OG Image */}
              <div className="space-y-1">
                <ImagePickerField
                  label="OG Image"
                  value={ogImage}
                  onChange={setOgImage}
                  folder="blog"
                />
                <p className="text-xs text-muted-foreground">Defaults to cover image if blank. Recommended: 1200 × 630 px</p>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={() => router.push('/content/blog')}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? 'Saving…' : initialData?.id ? 'Save Changes' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}
