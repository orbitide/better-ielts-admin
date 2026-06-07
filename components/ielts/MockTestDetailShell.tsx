'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Breadcrumb } from './Breadcrumb'
import { MockTestFormModal } from './MockTestFormModal'
import { MockTestSectionCard } from './MockTestSectionCard'
import type { FullMockTest, IeltsStatus, MockTestSection } from '@/lib/types/ielts'

const difficultyVariant: Record<'beginner' | 'intermediate' | 'advanced', 'success' | 'warning' | 'secondary'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'secondary',
}

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

type MockTestDetailShellProps = {
  test: FullMockTest
}

export function MockTestDetailShell({ test: initial }: MockTestDetailShellProps) {
  const [test, setTest] = useState(initial)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSave = (data: { title: string; description: string; type: 'academic' | 'general'; difficulty: 'beginner' | 'intermediate' | 'advanced'; status: IeltsStatus }) => {
    setTest((prev) => ({ ...prev, ...data }))
  }

  const handleChangeTestId = (sectionId: string, newTestId: string) => {
    setTest((prev) => ({
      ...prev,
      sections: prev.sections.map((s: MockTestSection) =>
        s.id === sectionId ? { ...s, testId: newTestId } : s
      ),
    }))
  }

  const sortedSections = [...test.sections].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={[{ label: 'Sets', href: '/ielts/mock-tests' }, { label: test.title }]} />

        <div className="space-y-4">
          <PageHeader title={test.title} description={test.description || 'No description.'}>
            <Button size="sm" variant="ghost" onClick={() => setModalOpen(true)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </PageHeader>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant[test.status]}>{test.status}</Badge>
            <Badge variant="secondary">{test.type}</Badge>
            <Badge variant={difficultyVariant[test.difficulty]}>{test.difficulty}</Badge>
            <span className="text-xs text-muted-foreground">{test.durationMinutes} min total</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Skill Tests in this Set</h2>
          {sortedSections.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
              No sections yet. Edit this set to add skill tests.
            </p>
          ) : (
            sortedSections.map((section) => (
              <MockTestSectionCard
                key={section.id}
                section={section}
                onChangeTestId={handleChangeTestId}
              />
            ))
          )}
        </div>
      </div>

      <MockTestFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={test}
        onSave={handleSave}
      />
    </>
  )
}
