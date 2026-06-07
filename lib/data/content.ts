import { cache } from 'react'
import { delay } from '@/lib/utils/delay'
import { mockBlogPosts } from '@/lib/mock/blog-posts'
import { mockExamGuideSections } from '@/lib/mock/exam-guide'
import { mockBandTables } from '@/lib/mock/band-tables'

export const getBlogPosts = cache(async () => {
  await delay(150)
  return mockBlogPosts
})

export const getExamGuideSections = cache(async () => {
  await delay(150)
  return mockExamGuideSections
})

export const getBandTables = cache(async () => {
  await delay(120)
  return mockBandTables
})
