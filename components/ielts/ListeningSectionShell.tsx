'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Breadcrumb } from './Breadcrumb'
import { Modal } from '@/components/ui/Modal'
import { ListeningQuestionFormModal } from './ListeningQuestionFormModal'
import { QuestionsDataTable } from './QuestionsDataTable'
import type { FullListeningTest, ListeningSection, ListeningQuestion, SetContext } from '@/lib/types/ielts'
import { RoleGate } from '@/components/auth/RoleGate'
import { updateListeningTest } from '@/lib/api/ielts'

const typeLabels: Record<ListeningQuestion['type'], string> = {
  mcq: 'MCQ',
  'fill-blank': 'Fill Blank',
  matching: 'Matching',
}

const typeVariants: Record<ListeningQuestion['type'], 'secondary' | 'warning' | 'success'> = {
  mcq: 'secondary',
  'fill-blank': 'warning',
  matching: 'success',
}

const textareaClass =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none'

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

type ListeningSectionShellProps = {
  test: FullListeningTest
  section: ListeningSection
  setContext?: SetContext
}

export function ListeningSectionShell({ test, section: initialSection, setContext }: ListeningSectionShellProps) {
  const [section, setSection] = useState(initialSection)
  const [transcript, setTranscript] = useState(initialSection.transcript)
  const [transcriptDirty, setTranscriptDirty] = useState(false)
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<ListeningQuestion | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ListeningQuestion | null>(null)

  const persistTestWith = async (updatedSection: ListeningSection) => {
    const updatedTest = { ...test, sections: test.sections.map(s => s.id === updatedSection.id ? updatedSection : s) }
    try { await updateListeningTest(test.id, updatedTest) } catch { /* best-effort */ }
  }

  const handleTranscriptSave = async () => {
    const updatedSection = { ...section, transcript }
    setSection(updatedSection)
    setTranscriptDirty(false)
    await persistTestWith(updatedSection)
  }

  const handleQuestionSave = async (q: ListeningQuestion) => {
    setSection((prev) => {
      const existing = prev.questions.findIndex((x) => x.id === q.id)
      let updatedSection: ListeningSection
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

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={setContext ? [
          { label: 'Sets', href: '/ielts/mock-tests' },
          { label: setContext.setTitle, href: `/ielts/mock-tests/${setContext.setId}` },
          { label: `Test ${setContext.testIndex}`, href: `/ielts/mock-tests/${setContext.setId}/tests/${setContext.testId}` },
          { label: test.title, href: `/ielts/listening/${test.id}?setId=${setContext.setId}&setTitle=${encodeURIComponent(setContext.setTitle)}&testId=${setContext.testId}&testIndex=${setContext.testIndex}` },
          { label: `Section ${section.sectionNumber}` },
        ] : [
          { label: 'Listening Tests', href: '/ielts/listening' },
          { label: test.title, href: `/ielts/listening/${test.id}` },
          { label: `Section ${section.sectionNumber}` },
        ]} />

        <PageHeader
          title={`Section ${section.sectionNumber}`}
          description={`${formatDuration(section.audioDurationSeconds)} · ${section.questions.length} questions`}
        />

        {/* Audio info */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Audio</p>
          <div className="flex items-center gap-3">
            <code className="text-sm bg-muted px-2 py-1 rounded font-mono truncate flex-1">{section.audioUrl || 'No URL set'}</code>
            <span className="text-xs text-muted-foreground shrink-0">{formatDuration(section.audioDurationSeconds)}</span>
          </div>
          {section.audioUrl && (
            <audio controls className="w-full h-8 mt-1" src={section.audioUrl}>
              Your browser does not support the audio element.
            </audio>
          )}
        </div>

        {/* Transcript */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Transcript</p>
            {transcriptDirty && (
              <Button size="sm" onClick={handleTranscriptSave}>Save Transcript</Button>
            )}
          </div>
          <textarea
            value={transcript}
            onChange={(e) => { setTranscript(e.target.value); setTranscriptDirty(true) }}
            rows={10}
            className={textareaClass}
            placeholder="Paste or edit the audio transcript here…"
          />
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
              getStem={(q) => q.stem}
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

      <ListeningQuestionFormModal
        open={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        editing={editingQuestion}
        nextQuestionNumber={sortedQuestions.length + 1}
        onSave={handleQuestionSave}
      />
    </>
  )
}
