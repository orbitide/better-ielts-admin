'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Settings2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { DataTablePagination } from '@/components/ui/DataTable/DataTablePagination'
import { ContentFormModal } from './ContentFormModal'
import { ReadingSectionFormModal } from './ReadingSectionFormModal'
import { Breadcrumb } from './Breadcrumb'
import type { ReadingTestDetail, ReadingSection, IeltsStatus, SetContext } from '@/lib/types/ielts'
import { RoleGate } from '@/components/auth/RoleGate'
import {
  updateReadingTest,
  fetchReadingSections, createReadingSection, updateReadingSection, deleteReadingSection,
  type ReadingSectionsPage,
} from '@/lib/api/ielts'

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

type ReadingTestDetailShellProps = {
  test: ReadingTestDetail
  initialSectionsPage: ReadingSectionsPage
  setContext?: SetContext
}

export function ReadingTestDetailShell({ test: initial, initialSectionsPage, setContext }: ReadingTestDetailShellProps) {
  const [test, setTest] = useState(initial)
  const [sectionsPage, setSectionsPage] = useState(initialSectionsPage)
  const [loading, setLoading] = useState(false)
  const [metaModalOpen, setMetaModalOpen] = useState(false)
  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<ReadingSection | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ReadingSection | null>(null)

  const handleMetaSave = async ({ title, type, status }: { title: string; type: string; status: IeltsStatus }) => {
    const prev = test
    const updated = { ...test, title, type: type as 'academic' | 'general', status }
    setTest(updated)
    try {
      const saved = await updateReadingTest(test.id, { title: updated.title, type: updated.type, durationMinutes: updated.durationMinutes, status: updated.status })
      setTest(saved)
    } catch (err) {
      setTest(prev)
      toast.error((err as Error).message ?? 'Failed to save.')
    }
  }

  const handleSectionSave = async ({ passageTitle, passageBody, passageIndex }: { passageTitle: string; passageBody: string; passageIndex: number }) => {
    const wordCount = passageBody.trim() ? passageBody.trim().split(/\s+/).length : 0
    const payload = { passageIndex, passage: { title: passageTitle, body: passageBody, wordCount } }
    setLoading(true)
    try {
      if (editingSection) {
        await updateReadingSection(editingSection.id, payload)
      } else {
        await createReadingSection(test.id, payload)
      }
      const refreshed = await fetchReadingSections(test.id, sectionsPage.page, sectionsPage.pageSize)
      setSectionsPage(refreshed)
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to save section.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSection = async () => {
    if (!deleteTarget) return
    setLoading(true)
    try {
      await deleteReadingSection(deleteTarget.id)
      const remaining = sectionsPage.totalCount - 1
      const targetPage = Math.min(sectionsPage.page, Math.max(1, Math.ceil(remaining / sectionsPage.pageSize)))
      const refreshed = await fetchReadingSections(test.id, targetPage, sectionsPage.pageSize)
      setSectionsPage(refreshed)
      setDeleteTarget(null)
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to delete section.')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (page: number) => {
    setLoading(true)
    try {
      const refreshed = await fetchReadingSections(test.id, page, sectionsPage.pageSize)
      setSectionsPage(refreshed)
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to load sections.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={setContext ? [
          { label: 'Sets', href: '/ielts/mock-tests' },
          { label: setContext.setTitle, href: `/ielts/mock-tests/${setContext.setId}` },
          { label: `Test ${setContext.testIndex}`, href: `/ielts/mock-tests/${setContext.setId}/tests/${setContext.testId}` },
          { label: test.title },
        ] : test.setId && test.setName && test.testId && test.testName ? [
          { label: 'Sets', href: '/ielts/mock-tests' },
          { label: test.setName, href: `/ielts/mock-tests/${test.setId}` },
          { label: test.testName, href: `/ielts/mock-tests/${test.setId}/tests/${test.testId}` },
          { label: test.title },
        ] : [
          { label: 'Reading Tests', href: '/ielts/reading' },
          { label: test.title },
        ]} />

        <div className="space-y-3">
          <PageHeader title={test.title} description={`${test.type} · ${test.durationMinutes} min`}>
            <RoleGate permission="ielts:edit">
              <Button size="sm" variant="ghost" onClick={() => setMetaModalOpen(true)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button size="sm" onClick={() => { setEditingSection(null); setSectionModalOpen(true) }}>
                <Plus className="h-3.5 w-3.5" />
                Add Section
              </Button>
            </RoleGate>
          </PageHeader>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant[test.status]}>{test.status}</Badge>
            <Badge variant="secondary">{test.type}</Badge>
            <span className="text-xs text-muted-foreground">{sectionsPage.totalCount} section{sectionsPage.totalCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Sections</h2>
          {sectionsPage.items.length === 0 ? (
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
            <>
              {sectionsPage.items.map((section, i) => (
                <div key={section.id} className="rounded-xl border border-border bg-card p-4 flex items-start gap-4">
                  <div className="rounded-lg bg-muted flex items-center justify-center h-9 w-9 text-sm font-semibold shrink-0">
                    {(sectionsPage.page - 1) * sectionsPage.pageSize + i + 1}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="font-medium text-sm truncate">{section.passage.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {section.passage.wordCount} words · {section.questionCount} question{section.questionCount !== 1 ? 's' : ''}
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
                    <RoleGate permission="ielts:edit">
                      <button
                        onClick={() => { setEditingSection(section); setSectionModalOpen(true) }}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title="Edit passage"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </RoleGate>
                    <RoleGate permission="ielts:delete">
                      <button
                        onClick={() => setDeleteTarget(section)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete section"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </RoleGate>
                  </div>
                </div>
              ))}
              <DataTablePagination
                page={sectionsPage.page}
                totalPages={sectionsPage.totalPages}
                totalCount={sectionsPage.totalCount}
                sourceCount={sectionsPage.totalCount}
                onPageChange={handlePageChange}
                loading={loading}
                countLabel={`${sectionsPage.totalCount} section${sectionsPage.totalCount !== 1 ? 's' : ''}`}
              />
            </>
          )}
        </div>
      </div>

      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete Section">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.passage.title}</span>? All questions in this section will also be removed.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteSection}>Delete</Button>
        </div>
      </Modal>

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
        nextPassageIndex={sectionsPage.totalCount}
        onSave={handleSectionSave}
      />
    </>
  )
}
