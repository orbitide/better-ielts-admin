'use client'

import { useEffect, useState } from 'react'
import { httpClient } from '@/lib/api/http'
import { ExamGuideShell } from '@/components/content/ExamGuideShell'
import type { ExamGuideSection } from '@/lib/types/content'

export default function ExamGuidePage() {
  const [sections, setSections] = useState<ExamGuideSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    httpClient
      .get('/api/admin/content/exam-guide')
      .then(({ data }) => {
        const guide = data.data as {
          overview: string
          skills: Array<{ skill: string; label: string }>
        }
        if (!guide?.skills) {
          setSections([])
          return
        }
        const result: ExamGuideSection[] = []
        if (guide.overview) {
          result.push({
            id: 'overview',
            title: 'IELTS Overview & Format',
            skill: 'general',
            order: 1,
            status: 'published',
            updatedAt: new Date().toISOString().split('T')[0],
          })
        }
        guide.skills.forEach((s, i) => {
          result.push({
            id: s.skill,
            title: s.label ?? `${s.skill} Section Guide`,
            skill: (s.skill as ExamGuideSection['skill']) ?? 'general',
            order: i + 2,
            status: 'published',
            updatedAt: new Date().toISOString().split('T')[0],
          })
        })
        setSections(result)
      })
      .catch(() => setSections([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-5 sm:p-6 max-w-4xl mx-auto">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <ExamGuideShell initialSections={sections} />
      )}
    </div>
  )
}
