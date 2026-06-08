import { cache } from 'react'
import { delay } from '@/lib/utils/delay'
import { mockBlogPosts } from '@/lib/mock/blog-posts'
import { mockBlogCategories } from '@/lib/mock/blog-categories'
import { mockExamGuideSections } from '@/lib/mock/exam-guide'
import { mockBandTables } from '@/lib/mock/band-tables'

export const getBlogPosts = cache(async () => {
  await delay(150)
  return mockBlogPosts
})

export const getBlogCategories = cache(async () => {
  await delay(80)
  return mockBlogCategories
})

export const getBlogPostById = cache(async (id: string) => {
  await delay(100)
  return mockBlogPosts.find((p) => p.id === id) ?? null
})

export const getExamGuideSections = cache(async () => {
  await delay(150)
  return mockExamGuideSections
})

export const getBandTables = cache(async () => {
  await delay(120)
  return mockBandTables
})
