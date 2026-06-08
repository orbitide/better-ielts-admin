import { cache } from 'react'
import { delay } from '@/lib/utils/delay'
import { mockExamGuideSections } from '@/lib/mock/exam-guide'
import { mockBandTables } from '@/lib/mock/band-tables'
import { mockBlogPosts } from '@/lib/mock/blog-posts'
import { mockBlogCategories } from '@/lib/mock/blog-categories'
import { fetchBlogPosts, fetchBlogPostById, fetchBlogCategories } from '@/lib/api/blog'
import type { BlogPostsPage } from '@/lib/api/blog'

export const getBlogPosts = cache(async (page = 1, pageSize = 20) => {
  return fetchBlogPosts(page, pageSize).catch((): BlogPostsPage => {
    const start = (page - 1) * pageSize
    const items = mockBlogPosts.slice(start, start + pageSize)
    return {
      posts: items,
      totalCount: mockBlogPosts.length,
      totalPages: Math.ceil(mockBlogPosts.length / pageSize),
      page,
      pageSize,
    }
  })
})

export const getBlogCategories = cache(async () => {
  return fetchBlogCategories().catch(() => mockBlogCategories)
})

export const getBlogPostById = cache(async (id: string) => {
  return fetchBlogPostById(id).catch(() => mockBlogPosts.find((p) => p.id === id) ?? null)
})

export const getExamGuideSections = cache(async () => {
  await delay(150)
  return mockExamGuideSections
})

export const getBandTables = cache(async () => {
  await delay(120)
  return mockBandTables
})
