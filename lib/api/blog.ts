import { httpClient } from '@/lib/api/http'
import type { BlogPost, BlogCategory } from '@/lib/types/content'

type ApiPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl: string
  authorName: string
  categoryName: string
  categoryId: string
  isPublished: boolean
  publishedAt: string
  updatedAt: string
  readingTimeMinutes: number
  createdAt: string
  tags: string[]
}

type ApiPostSummary = {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImageUrl: string
  authorName: string
  categoryName: string
  categoryId: string
  isPublished: boolean
  publishedAt: string
  updatedAt: string
  readingTimeMinutes: number
  tags: string[]
}

type ApiCategory = {
  id: string
  name: string
  slug: string
  description?: string
}

type PagedResult<T> = {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

function mapSummary(p: ApiPostSummary): BlogPost {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    categoryId: p.categoryId ?? '',
    category: p.categoryName ?? '',
    tags: p.tags ?? [],
    author: p.authorName ?? '',
    status: p.isPublished ? 'published' : 'draft',
    publishedAt: p.publishedAt || null,
    updatedAt: p.updatedAt ?? p.publishedAt ?? '',
    excerpt: p.excerpt ?? '',
    content: '',
    coverImageUrl: p.coverImageUrl || undefined,
  }
}

function mapDetail(p: ApiPost): BlogPost {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    categoryId: p.categoryId ?? '',
    category: p.categoryName ?? '',
    tags: p.tags ?? [],
    author: p.authorName ?? '',
    status: p.isPublished ? 'published' : 'draft',
    publishedAt: p.publishedAt || null,
    updatedAt: p.updatedAt ?? '',
    excerpt: p.excerpt ?? '',
    content: p.content ?? '',
    coverImageUrl: p.coverImageUrl || undefined,
  }
}

function mapCategory(c: ApiCategory): BlogCategory {
  return { id: c.id, name: c.name, slug: c.slug, description: c.description ?? '' }
}

export type BlogPostsPage = {
  posts: BlogPost[]
  totalCount: number
  totalPages: number
  page: number
  pageSize: number
}

export async function fetchBlogPosts(page = 1, pageSize = 20): Promise<BlogPostsPage> {
  const { data } = await httpClient.get<{ data: PagedResult<ApiPostSummary> }>(
    `/api/admin/blog/posts?page=${page}&pageSize=${pageSize}`
  )
  const result = data.data
  return {
    posts: result.items.map(mapSummary),
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    page: result.page,
    pageSize: result.pageSize,
  }
}

export async function fetchBlogPostById(id: string): Promise<BlogPost> {
  const { data } = await httpClient.get<{ data: ApiPost }>(`/api/admin/blog/posts/${id}`)
  return mapDetail(data.data)
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const { data } = await httpClient.get<{ data: ApiCategory[] }>('/api/admin/blog/categories')
  return data.data.map(mapCategory)
}

type CreatePostPayload = {
  title: string
  excerpt: string
  content: string
  coverImageUrl?: string
  authorName: string
  categoryId: string
  isPublished: boolean
  tags: string[]
}

export async function createBlogPost(payload: CreatePostPayload): Promise<BlogPost> {
  const { data } = await httpClient.post<{ data: ApiPost }>('/api/admin/blog/posts', payload)
  return mapDetail(data.data)
}

export async function updateBlogPost(id: string, payload: CreatePostPayload): Promise<BlogPost> {
  const { data } = await httpClient.put<{ data: ApiPost }>(`/api/admin/blog/posts/${id}`, payload)
  return mapDetail(data.data)
}

export async function deleteBlogPost(id: string): Promise<void> {
  await httpClient.delete(`/api/admin/blog/posts/${id}`)
}

export async function createBlogCategory(name: string, description: string): Promise<BlogCategory> {
  const { data } = await httpClient.post<{ data: ApiCategory }>('/api/admin/blog/categories', { name, description })
  return mapCategory(data.data)
}

export async function updateBlogCategory(id: string, name: string, description: string): Promise<BlogCategory> {
  const { data } = await httpClient.put<{ data: ApiCategory }>(`/api/admin/blog/categories/${id}`, { name, description })
  return mapCategory(data.data)
}

export async function deleteBlogCategory(id: string): Promise<void> {
  await httpClient.delete(`/api/admin/blog/categories/${id}`)
}
