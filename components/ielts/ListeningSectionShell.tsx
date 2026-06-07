'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Breadcrumb } from './Breadcrumb'
import { ListeningQuestionFormModal } from './ListeningQuestionFormModal'
import type { FullListeningTest, ListeningSection, ListeningQuestion } from '@/lib/types/ielts'

const typeLabels: Record<ListeningQuestion['type'], string> = {
  mcq: 'MCQ',
  'fill-blank': 'Fill Blank',
  matching: 'Matching',
}

const typeColors: Record<ListeningQuestion['type'], 'secondary' | 'warning' | 'success'> = {
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
}

export function ListeningSectionShell({ test, section: initialSection }: ListeningSectionShellProps) {
  const [section, setSection] = useState(initialSection)
  const [transcript, setTranscript] = useState(initialSection.transcript)
  const [transcriptDirty, setTranscriptDirty] = useState(false)
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<ListeningQuestion | null>(null)

  const handleTranscriptSave = () => {
    setSection((prev) => ({ ...prev, transcript }))
    setTranscriptDirty(false)
  }

  const handleQuestionSave = (q: ListeningQuestion) => {
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

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={[
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
            <Button size="sm" onClick={() => { setEditingQuestion(null); setQuestionModalOpen(true) }}>
              <Plus className="h-3.5 w-3.5" />
              Add Question
            </Button>
          </div>

          {sortedQuestions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center">
              <p className="text-sm text-muted-foreground">No questions yet.</p>
              <button onClick={() => { setEditingQuestion(null); setQuestionModalOpen(true) }} className="mt-2 text-sm text-primary hover:underline">
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
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Stem</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Answer</th>
                    <th className="px-4 py-2.5 w-20" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{q.questionNumber}</td>
                      <td className="px-4 py-3">
                        <Badge variant={typeColors[q.type]}>{typeLabels[q.type]}</Badge>
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">{q.stem}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell font-mono">{q.correctAnswer}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => { setEditingQuestion(q); setQuestionModalOpen(true) }} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleDeleteQuestion(q.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors">
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
