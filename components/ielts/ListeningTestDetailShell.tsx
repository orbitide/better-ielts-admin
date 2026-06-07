'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { ContentFormModal } from './ContentFormModal'
import { ListeningSectionFormModal } from './ListeningSectionFormModal'
import { Breadcrumb } from './Breadcrumb'
import type { FullListeningTest, ListeningSection, IeltsStatus } from '@/lib/types/ielts'

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

type ListeningTestDetailShellProps = {
  test: FullListeningTest
}

function genId() {
  return `ls-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function ListeningTestDetailShell({ test: initial }: ListeningTestDetailShellProps) {
  const [test, setTest] = useState(initial)
  const [metaModalOpen, setMetaModalOpen] = useState(false)
  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<ListeningSection | null>(null)

  const handleMetaSave = ({ title, status }: { title: string; type: string; status: IeltsStatus }) => {
    setTest((prev) => ({ ...prev, title, status }))
  }

  const handleSectionSave = ({ sectionNumber, audioUrl, audioDurationSeconds, transcript }: {
    sectionNumber: 1 | 2 | 3 | 4
    audioUrl: string
    audioDurationSeconds: number
    transcript: string
  }) => {
    if (editingSection) {
      setTest((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === editingSection.id
            ? { ...s, sectionNumber, audioUrl, audioDurationSeconds, transcript }
            : s
        ),
      }))
    } else {
      const newSection: ListeningSection = {
        id: genId(),
        sectionNumber,
        audioUrl,
        audioDurationSeconds,
        transcript,
        questions: [],
      }
      setTest((prev) => ({ ...prev, sections: [...prev.sections, newSection] }))
    }
  }

  const handleDeleteSection = (id: string) => {
    setTest((prev) => ({ ...prev, sections: prev.sections.filter((s) => s.id !== id) }))
  }

  const sortedSections = [...test.sections].sort((a, b) => a.sectionNumber - b.sectionNumber)

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={[{ label: 'Listening Tests', href: '/ielts/listening' }, { label: test.title }]} />

        <div className="space-y-3">
          <PageHeader title={test.title} description={`${test.durationMinutes} min · ${test.sections.length} sections`}>
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
            <span className="text-xs text-muted-foreground">{test.durationMinutes} min</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Sections</h2>
          {sortedSections.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center">
              <p className="text-sm text-muted-foreground">No sections yet.</p>
              <button onClick={() => { setEditingSection(null); setSectionModalOpen(true) }} className="mt-2 text-sm text-primary hover:underline">
                Add the first section
              </button>
            </div>
          ) : (
            sortedSections.map((section) => (
              <div key={section.id} className="rounded-xl border border-border bg-card p-4 flex items-start gap-4">
                <div className="rounded-lg bg-muted flex items-center justify-center h-9 w-9 text-sm font-semibold shrink-0">
                  {section.sectionNumber}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="font-medium text-sm">Section {section.sectionNumber}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {section.audioUrl || 'No audio URL'} · {formatDuration(section.audioDurationSeconds)} · {section.questions.length} questions
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/ielts/listening/${test.id}/sections/${section.id}`}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title="Manage section"
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => { setEditingSection(section); setSectionModalOpen(true) }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title="Edit section"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                    title="Delete"
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
        editing={{ id: test.id, title: test.title, meta: 'standard', status: test.status, createdAt: test.createdAt }}
        typeOptions={['standard']}
        typeLabel="Type"
        onSave={handleMetaSave}
      />
      <ListeningSectionFormModal
        open={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        editing={editingSection}
        onSave={handleSectionSave}
      />
    </>
  )
}
