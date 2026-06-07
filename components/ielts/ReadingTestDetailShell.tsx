'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { ContentFormModal } from './ContentFormModal'
import { ReadingSectionFormModal } from './ReadingSectionFormModal'
import { Breadcrumb } from './Breadcrumb'
import type { FullReadingTest, ReadingSection, IeltsStatus, SetContext } from '@/lib/types/ielts'

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

type ReadingTestDetailShellProps = {
  test: FullReadingTest
  setContext?: SetContext
}

function genId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function ReadingTestDetailShell({ test: initial, setContext }: ReadingTestDetailShellProps) {
  const [test, setTest] = useState(initial)
  const [metaModalOpen, setMetaModalOpen] = useState(false)
  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<ReadingSection | null>(null)

  const handleMetaSave = ({ title, type, status }: { title: string; type: string; status: IeltsStatus }) => {
    setTest((prev) => ({ ...prev, title, type: type as 'academic' | 'general', status }))
  }

  const handleSectionSave = ({ passageTitle, passageBody, passageIndex }: { passageTitle: string; passageBody: string; passageIndex: number }) => {
    const wordCount = passageBody.trim() ? passageBody.trim().split(/\s+/).length : 0
    if (editingSection) {
      setTest((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === editingSection.id
            ? { ...s, passageIndex, passage: { ...s.passage, title: passageTitle, body: passageBody, wordCount } }
            : s
        ),
      }))
    } else {
      const newSection: ReadingSection = {
        id: genId(),
        passageIndex,
        passage: { id: genId(), title: passageTitle, body: passageBody, wordCount },
        questions: [],
      }
      setTest((prev) => ({ ...prev, sections: [...prev.sections, newSection] }))
    }
  }

  const handleDeleteSection = (id: string) => {
    setTest((prev) => ({ ...prev, sections: prev.sections.filter((s) => s.id !== id) }))
  }

  const sortedSections = [...test.sections].sort((a, b) => a.passageIndex - b.passageIndex)

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={setContext ? [
          { label: 'Sets', href: '/ielts/mock-tests' },
          { label: setContext.setTitle, href: `/ielts/mock-tests/${setContext.setId}` },
          { label: `Test ${setContext.testIndex}`, href: `/ielts/mock-tests/${setContext.setId}/tests/${setContext.testId}` },
          { label: test.title },
        ] : [
          { label: 'Reading Tests', href: '/ielts/reading' },
          { label: test.title },
        ]} />

        <div className="space-y-3">
          <PageHeader title={test.title} description={`${test.type} · ${test.durationMinutes} min`}>
            <Button size="sm" variant="ghost" onClick={() => setMetaModalOpen(true)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button size="sm" onClick={() => { setEditingSection(null); setSectionModalOpen(true) }}>
              <Plus className="h-3.5 w-3.5" />
              Add Section
            </Button>
          </PageHeader>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant[test.status]}>{test.status}</Badge>
            <Badge variant="secondary">{test.type}</Badge>
            <span className="text-xs text-muted-foreground">{test.sections.length} section{test.sections.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Sections</h2>
          {sortedSections.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center">
              <p className="text-sm text-muted-foreground">No sections yet.</p>
              <button
                onClick={() => { setEditingSection(null); setSectionModalOpen(true) }}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Add the first section
              </button>
            </div>
          ) : (
            sortedSections.map((section, i) => (
              <div key={section.id} className="rounded-xl border border-border bg-card p-4 flex items-start gap-4">
                <div className="rounded-lg bg-muted flex items-center justify-center h-9 w-9 text-sm font-semibold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="font-medium text-sm truncate">{section.passage.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {section.passage.wordCount} words · {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/ielts/reading/${test.id}/sections/${section.id}${setContext ? `?setId=${setContext.setId}&setTitle=${encodeURIComponent(setContext.setTitle)}&testId=${setContext.testId}&testIndex=${setContext.testIndex}` : ''}`}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title="Manage section"
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => { setEditingSection(section); setSectionModalOpen(true) }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title="Edit passage"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                    title="Delete section"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ContentFormModal
        open={metaModalOpen}
        onClose={() => setMetaModalOpen(false)}
        editing={{ id: test.id, title: test.title, meta: test.type, status: test.status, createdAt: test.createdAt }}
        typeOptions={['academic', 'general']}
        typeLabel="Test Type"
        onSave={handleMetaSave}
      />
      <ReadingSectionFormModal
        open={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        editing={editingSection}
        nextPassageIndex={test.sections.length}
        onSave={handleSectionSave}
      />
    </>
  )
}
