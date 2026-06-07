'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Breadcrumb } from './Breadcrumb'
import { ReadingQuestionFormModal } from './ReadingQuestionFormModal'
import type { FullReadingTest, ReadingSection, ReadingQuestion, SetContext } from '@/lib/types/ielts'

const typeLabels: Record<ReadingQuestion['type'], string> = {
  mcq: 'MCQ',
  tfng: 'TF/NG',
  matching: 'Matching',
  'fill-blank': 'Fill Blank',
}

const typeColors: Record<ReadingQuestion['type'], string> = {
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

  const handleQuestionSave = (q: ReadingQuestion) => {
    setSection((prev) => {
      const existing = prev.questions.findIndex((x) => x.id === q.id)
      if (existing >= 0) {
        const updated = [...prev.questions]
        updated[existing] = q
        return { ...prev, questions: updated }
      }
      return { ...prev, questions: [...prev.questions, q] }
    })
  }

  const handleDeleteQuestion = (id: string) => {
    setSection((prev) => ({ ...prev, questions: prev.questions.filter((q) => q.id !== id) }))
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
            <Button size="sm" onClick={() => { setEditingQuestion(null); setQuestionModalOpen(true) }}>
              <Plus className="h-3.5 w-3.5" />
              Add Question
            </Button>
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
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs w-10">#</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Type</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Stem / Statement</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Answer</th>
                    <th className="px-4 py-2.5 w-20" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{q.questionNumber}</td>
                      <td className="px-4 py-3">
                        <Badge variant={typeColors[q.type] as 'secondary' | 'warning' | 'success'}>{typeLabels[q.type]}</Badge>
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate text-sm">{getStem(q)}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell font-mono">{q.correctAnswer}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => { setEditingQuestion(q); setQuestionModalOpen(true) }}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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
