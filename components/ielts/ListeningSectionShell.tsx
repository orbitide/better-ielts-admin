'use client'

import { useState, useEffect } from 'react'
import { Plus, ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Breadcrumb } from './Breadcrumb'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { ListeningQuestionFormModal } from './ListeningQuestionFormModal'
import { QuestionsDataTable } from './QuestionsDataTable'
import { TableNodeFormModal } from './layout/TableNodeFormModal'
import { McqGroupNodeFormModal } from './layout/McqGroupNodeFormModal'
import { GapFillNodeFormModal } from './layout/GapFillNodeFormModal'
import { ImageLabelNodeFormModal } from './layout/ImageLabelNodeFormModal'
import type { FullListeningTest, ListeningSection, ListeningQuestion, ListeningLayoutNode, SetContext } from '@/lib/types/ielts'
import { RoleGate } from '@/components/auth/RoleGate'
import { updateListeningTest } from '@/lib/api/ielts'
import { getLayoutAnswerKeys } from '@/lib/utils/listening-layout'

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

const layoutNodeMeta: Record<ListeningLayoutNode['type'], { label: string; variant: 'secondary' | 'success' | 'warning' | 'default' }> = {
  table: { label: 'Table', variant: 'secondary' },
  mcq_group: { label: 'MCQ Group', variant: 'success' },
  gap_fill: { label: 'Gap Fill', variant: 'warning' },
  image_label: { label: 'Image Label', variant: 'default' },
}

function layoutNodeTitle(node: ListeningLayoutNode): string {
  if (node.title) return node.title
  return `Untitled ${layoutNodeMeta[node.type].label}`
}

function layoutNodeQuestionRange(node: ListeningLayoutNode): string {
  const numbers = getLayoutAnswerKeys([node]).map((k) => k.questionNumber)
  if (numbers.length === 0) return '—'
  const min = Math.min(...numbers)
  const max = Math.max(...numbers)
  return min === max ? `Q${min}` : `Q${min}-${max}`
}

function layoutStorageKey(sectionId: string) {
  return `better-ielts-admin:listening-layout:${sectionId}`
}

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

  // Layout (Beta) — persisted to localStorage only until the backend phase lands.
  const [layoutNodes, setLayoutNodes] = useState<ListeningLayoutNode[]>(initialSection.layout?.nodes ?? [])
  const [layoutDirty, setLayoutDirty] = useState(false)
  const [editingLayoutNode, setEditingLayoutNode] = useState<ListeningLayoutNode | null>(null)
  const [tableModalOpen, setTableModalOpen] = useState(false)
  const [mcqModalOpen, setMcqModalOpen] = useState(false)
  const [gapFillModalOpen, setGapFillModalOpen] = useState(false)
  const [imageLabelModalOpen, setImageLabelModalOpen] = useState(false)
  const [deleteLayoutTarget, setDeleteLayoutTarget] = useState<ListeningLayoutNode | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(layoutStorageKey(section.id))
    if (stored) {
      try {
        setLayoutNodes(JSON.parse(stored))
        return
      } catch { /* ignore corrupted localStorage data */ }
    }
    setLayoutNodes(section.layout?.nodes ?? [])
  }, [section.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reflects the in-progress layout draft for this section so question-number
  // suggestions in the node editors account for nodes added earlier in this session.
  const effectiveTest: FullListeningTest = {
    ...test,
    sections: test.sections.map((s) => (s.id === section.id ? { ...s, layout: { nodes: layoutNodes } } : s)),
  }

  const handleSaveLayout = () => {
    localStorage.setItem(layoutStorageKey(section.id), JSON.stringify(layoutNodes))
    setLayoutDirty(false)
  }

  const handleSaveLayoutNode = (node: ListeningLayoutNode) => {
    setLayoutNodes((prev) => {
      const index = prev.findIndex((n) => n.id === node.id)
      if (index >= 0) {
        const next = [...prev]
        next[index] = node
        return next
      }
      return [...prev, node]
    })
    setLayoutDirty(true)
  }

  const openAddLayoutModal = (type: ListeningLayoutNode['type']) => {
    setEditingLayoutNode(null)
    if (type === 'table') setTableModalOpen(true)
    else if (type === 'mcq_group') setMcqModalOpen(true)
    else if (type === 'gap_fill') setGapFillModalOpen(true)
    else setImageLabelModalOpen(true)
  }

  const handleEditLayoutNode = (node: ListeningLayoutNode) => {
    setEditingLayoutNode(node)
    if (node.type === 'table') setTableModalOpen(true)
    else if (node.type === 'mcq_group') setMcqModalOpen(true)
    else if (node.type === 'gap_fill') setGapFillModalOpen(true)
    else setImageLabelModalOpen(true)
  }

  const moveLayoutNode = (index: number, direction: -1 | 1) => {
    setLayoutNodes((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setLayoutDirty(true)
  }

  const handleDeleteLayoutNode = () => {
    if (!deleteLayoutTarget) return
    setLayoutNodes((prev) => prev.filter((n) => n.id !== deleteLayoutTarget.id))
    setLayoutDirty(true)
    setDeleteLayoutTarget(null)
  }

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

        {/* Layout (Beta) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Layout ({layoutNodes.length})
              </h2>
              <Badge variant="outline">Beta</Badge>
            </div>
            {layoutDirty && (
              <Button size="sm" onClick={handleSaveLayout}>Save Layout</Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Build richer question formats (tables, grouped MCQs, gap-fill passages, image labelling). Saved locally on this device for now.
          </p>

          <RoleGate permission="ielts:edit">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => openAddLayoutModal('table')}>
                <Plus className="h-3.5 w-3.5" /> Table
              </Button>
              <Button size="sm" variant="outline" onClick={() => openAddLayoutModal('mcq_group')}>
                <Plus className="h-3.5 w-3.5" /> MCQ Group
              </Button>
              <Button size="sm" variant="outline" onClick={() => openAddLayoutModal('gap_fill')}>
                <Plus className="h-3.5 w-3.5" /> Gap Fill
              </Button>
              <Button size="sm" variant="outline" onClick={() => openAddLayoutModal('image_label')}>
                <Plus className="h-3.5 w-3.5" /> Image Label
              </Button>
            </div>
          </RoleGate>

          {layoutNodes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center">
              <p className="text-sm text-muted-foreground">No layout blocks yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {layoutNodes.map((node, index) => (
                <div key={node.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <RoleGate permission="ielts:edit">
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveLayoutNode(index, -1)}
                        disabled={index === 0}
                        className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveLayoutNode(index, 1)}
                        disabled={index === layoutNodes.length - 1}
                        className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </RoleGate>

                  <Badge variant={layoutNodeMeta[node.type].variant}>{layoutNodeMeta[node.type].label}</Badge>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{layoutNodeTitle(node)}</p>
                    <p className="text-xs text-muted-foreground font-mono">{layoutNodeQuestionRange(node)}</p>
                  </div>

                  <RoleGate permission="ielts:edit">
                    <button
                      onClick={() => handleEditLayoutNode(node)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </RoleGate>
                  <RoleGate permission="ielts:delete">
                    <button
                      onClick={() => setDeleteLayoutTarget(node)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </RoleGate>
                </div>
              ))}
            </div>
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

      <Modal open={deleteLayoutTarget !== null} onClose={() => setDeleteLayoutTarget(null)} title="Delete Layout Block">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete this{' '}
          <span className="font-semibold text-foreground">
            {deleteLayoutTarget ? layoutNodeMeta[deleteLayoutTarget.type].label : ''}
          </span>{' '}
          block ({deleteLayoutTarget ? layoutNodeQuestionRange(deleteLayoutTarget) : ''})? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeleteLayoutTarget(null)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteLayoutNode}>Delete</Button>
        </div>
      </Modal>

      <TableNodeFormModal
        open={tableModalOpen}
        onClose={() => { setTableModalOpen(false); setEditingLayoutNode(null) }}
        editing={editingLayoutNode?.type === 'table' ? editingLayoutNode : null}
        test={effectiveTest}
        onSave={handleSaveLayoutNode}
      />

      <McqGroupNodeFormModal
        open={mcqModalOpen}
        onClose={() => { setMcqModalOpen(false); setEditingLayoutNode(null) }}
        editing={editingLayoutNode?.type === 'mcq_group' ? editingLayoutNode : null}
        test={effectiveTest}
        onSave={handleSaveLayoutNode}
      />

      <GapFillNodeFormModal
        open={gapFillModalOpen}
        onClose={() => { setGapFillModalOpen(false); setEditingLayoutNode(null) }}
        editing={editingLayoutNode?.type === 'gap_fill' ? editingLayoutNode : null}
        test={effectiveTest}
        onSave={handleSaveLayoutNode}
      />

      <ImageLabelNodeFormModal
        open={imageLabelModalOpen}
        onClose={() => { setImageLabelModalOpen(false); setEditingLayoutNode(null) }}
        editing={editingLayoutNode?.type === 'image_label' ? editingLayoutNode : null}
        test={effectiveTest}
        onSave={handleSaveLayoutNode}
      />
    </>
  )
}
