import axios from 'axios'
import type { BlogPost, BlogCategory } from '@/lib/types/content'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/$/, '')

const api = axios.create({
  baseURL: `${API_URL}/api/admin/blog`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers')
      const store = await cookies()
      const token = store.get('admin_access')?.value
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch { /* outside request context */ }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? 'Request failed'
    return Promise.reject(new Error(message))
  }
)

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
  const { data } = await api.get<{ data: PagedResult<ApiPostSummary> }>(
    `/posts?page=${page}&pageSize=${pageSize}`
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
  const { data } = await api.get<{ data: ApiPost }>(`/posts/${id}`)
  return mapDetail(data.data)
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const { data } = await api.get<{ data: ApiCategory[] }>('/categories')
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
  const { data } = await api.post<{ data: ApiPost }>('/posts', payload)
  return mapDetail(data.data)
}

export async function updateBlogPost(id: string, payload: CreatePostPayload): Promise<BlogPost> {
  const { data } = await api.put<{ data: ApiPost }>(`/posts/${id}`, payload)
  return mapDetail(data.data)
}

export async function deleteBlogPost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`)
}

export async function createBlogCategory(name: string, description: string): Promise<BlogCategory> {
  const { data } = await api.post<{ data: ApiCategory }>('/categories', { name, description })
  return mapCategory(data.data)
}

export async function updateBlogCategory(id: string, name: string, description: string): Promise<BlogCategory> {
  const { data } = await api.put<{ data: ApiCategory }>(`/categories/${id}`, { name, description })
  return mapCategory(data.data)
}

export async function deleteBlogCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`)
}
