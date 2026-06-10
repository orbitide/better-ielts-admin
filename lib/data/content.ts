import { cache } from 'react'
import { fetchBlogPosts, fetchBlogPostById, fetchBlogCategories } from '@/lib/api/blog'
import type { BlogPostsPage } from '@/lib/api/blog'
import type { ExamGuideSection, BandTable } from '@/lib/types/content'
import http from '@/lib/api/http'

export const getBlogPosts = cache(async (page = 1, pageSize = 20) => {
  return fetchBlogPosts(page, pageSize)
})

export const getBlogCategories = cache(async () => {
  return fetchBlogCategories()
})

export const getBlogPostById = cache(async (id: string) => {
  return fetchBlogPostById(id)
})

export const getExamGuideSections = cache(async (): Promise<ExamGuideSection[]> => {
  try {
    const { data } = await http.get('/api/admin/content/exam-guide')
    const guide = data.data as {
      overview: string
      skills: Array<{ skill: string; label: string }>
    }
    if (!guide?.skills) return []
    const skillOrder = ['general', 'listening', 'reading', 'writing', 'speaking']
    const sections: ExamGuideSection[] = []
    if (guide.overview) {
      sections.push({ id: 'overview', title: 'IELTS Overview & Format', skill: 'general', order: 1, status: 'published', updatedAt: new Date().toISOString().split('T')[0] })
    }
    guide.skills.forEach((s, i) => {
      sections.push({
        id: s.skill,
        title: s.label ?? `${s.skill} Section Guide`,
        skill: (s.skill as ExamGuideSection['skill']) ?? 'general',
        order: i + 2,
        status: 'published',
        updatedAt: new Date().toISOString().split('T')[0],
      })
    })
    return sections
  } catch {
    return []
  }
})

export const getBandTables = cache(async (): Promise<BandTable[]> => {
  try {
    const { data } = await http.get('/api/admin/content/band-tables')
    const tables = data.data as Array<{
      id: string
      skill: string
      variant: string
      rows: Array<{ rawScore: number; band: number }>
      updatedAt: string
    }>
    return tables.map((t) => ({
      id: t.id,
      skill: t.skill as BandTable['skill'],
      type: t.variant as BandTable['type'],
      rows: t.rows ?? [],
      updatedAt: t.updatedAt ? new Date(t.updatedAt).toISOString().split('T')[0] : '',
    }))
  } catch {
    return []
  }
})
