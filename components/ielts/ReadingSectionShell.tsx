'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Breadcrumb } from './Breadcrumb'
import { Modal } from '@/components/ui/Modal'
import { ReadingQuestionFormModal } from './ReadingQuestionFormModal'
import { QuestionsDataTable } from './QuestionsDataTable'
import type { FullReadingTest, ReadingSection, ReadingQuestion, SetContext } from '@/lib/types/ielts'
import { RoleGate } from '@/components/auth/RoleGate'
import { updateReadingTest } from '@/lib/api/ielts'

const typeLabels: Record<ReadingQuestion['type'], string> = {
  mcq: 'MCQ',
  tfng: 'TF/NG',
  matching: 'Matching',
  'fill-blank': 'Fill Blank',
}

const typeVariants: Record<ReadingQuestion['type'], 'secondary' | 'warning' | 'success'> = {
  mcq: 'secondary',
  tfng: 'warning',
  matching: 'success',
  'fill-blank': 'secondary',
}

function getStem(q: ReadingQuestion): string {
  if (q.type === 'tfng') return q.statement
  return q.stem
}

type ReadingSectionShellProps = {
  test: FullReadingTest
  section: ReadingSection
  setContext?: SetContext
}

export function ReadingSectionShell({ test, section: initialSection, setContext }: ReadingSectionShellProps) {
  const [section, setSection] = useState(initialSection)
  const [showFullPassage, setShowFullPassage] = useState(false)
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<ReadingQuestion | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ReadingQuestion | null>(null)

  const persistTestWith = async (updatedSection: ReadingSection) => {
    const updatedTest = { ...test, sections: test.sections.map(s => s.id === updatedSection.id ? updatedSection : s) }
    try { await updateReadingTest(test.id, updatedTest) } catch { /* best-effort */ }
  }

  const handleQuestionSave = async (q: ReadingQuestion) => {
    setSection((prev) => {
      const existing = prev.questions.findIndex((x) => x.id === q.id)
      let updatedSection: ReadingSection
      if (existing >= 0) {
        const updated = [...prev.questions]
        updated[existing] = q
        updatedSection = { ...prev, questions: updated }
      } else {
        updatedSection = { ...prev, questions: [...prev.questions, q] }
      }
      persistTestWith(updatedSection)
      return updatedSection
    })
  }

  const handleDeleteQuestion = async () => {
    if (!deleteTarget) return
    setSection((prev) => {
      const updatedSection = { ...prev, questions: prev.questions.filter((q) => q.id !== deleteTarget.id) }
      persistTestWith(updatedSection)
      return updatedSection
    })
    setDeleteTarget(null)
  }

  const sortedQuestions = [...section.questions].sort((a, b) => a.questionNumber - b.questionNumber)
  const passagePreview = section.passage.body.slice(0, 280)
  const truncated = section.passage.body.length > 280

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={setContext ? [
          { label: 'Sets', href: '/ielts/mock-tests' },
          { label: setContext.setTitle, href: `/ielts/mock-tests/${setContext.setId}` },
          { label: `Test ${setContext.testIndex}`, href: `/ielts/mock-tests/${setContext.setId}/tests/${setContext.testId}` },
          { label: test.title, href: `/ielts/reading/${test.id}?setId=${setContext.setId}&setTitle=${encodeURIComponent(setContext.setTitle)}&testId=${setContext.testId}&testIndex=${setContext.testIndex}` },
          { label: section.passage.title },
        ] : [
          { label: 'Reading Tests', href: '/ielts/reading' },
          { label: test.title, href: `/ielts/reading/${test.id}` },
          { label: section.passage.title },
        ]} />

        <PageHeader title={section.passage.title} description={`Passage ${section.passageIndex + 1} · ${section.passage.wordCount} words`} />

        {/* Passage card */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Passage Text</p>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {showFullPassage ? section.passage.body : passagePreview}
            {truncated && !showFullPassage && '…'}
          </p>
          {truncated && (
            <button
              onClick={() => setShowFullPassage((v) => !v)}
              className="text-xs text-primary hover:underline"
            >
              {showFullPassage ? 'Show less' : 'Show full passage'}
            </button>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Questions ({sortedQuestions.length})
            </h2>
            <RoleGate permission="ielts:edit">
              <Button size="sm" onClick={() => { setEditingQuestion(null); setQuestionModalOpen(true) }}>
                <Plus className="h-3.5 w-3.5" />
                Add Question
              </Button>
            </RoleGate>
          </div>

          {sortedQuestions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center">
              <p className="text-sm text-muted-foreground">No questions yet.</p>
              <button
                onClick={() => { setEditingQuestion(null); setQuestionModalOpen(true) }}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Add the first question
              </button>
            </div>
          ) : (
            <QuestionsDataTable
              questions={sortedQuestions}
              getTypeLabel={(q) => typeLabels[q.type]}
              getTypeVariant={(q) => typeVariants[q.type]}
              getStem={getStem}
              onEdit={(q) => { setEditingQuestion(q); setQuestionModalOpen(true) }}
              onDelete={setDeleteTarget}
            />
          )}
        </div>
      </div>

      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete Question">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete question <span className="font-semibold text-foreground">#{deleteTarget?.questionNumber}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteQuestion}>Delete</Button>
        </div>
      </Modal>

      <ReadingQuestionFormModal
        open={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        editing={editingQuestion}
        nextQuestionNumber={sortedQuestions.length + 1}
        onSave={handleQuestionSave}
      />
    </>
  )
}
