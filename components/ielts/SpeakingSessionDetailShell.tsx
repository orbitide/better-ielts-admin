'use client'

import { useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { ContentFormModal } from './ContentFormModal'
import { SpeakingPartCard } from './SpeakingPartCard'
import { Breadcrumb } from './Breadcrumb'
import type { FullSpeakingSession, SpeakingPart, IeltsStatus, SetContext } from '@/lib/types/ielts'
import { updateSpeakingSession, createSpeakingPart, updateSpeakingPart } from '@/lib/api/ielts'

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

type SpeakingSessionDetailShellProps = {
  session: FullSpeakingSession
  initialParts: SpeakingPart[]
  setContext?: SetContext
}

export function SpeakingSessionDetailShell({ session: initial, initialParts, setContext }: SpeakingSessionDetailShellProps) {
  const [session, setSession] = useState(initial)
  const [parts, setParts] = useState(initialParts)
  const [metaModalOpen, setMetaModalOpen] = useState(false)

  const handleMetaSave = async ({ title, status }: { title: string; type: string; status: IeltsStatus }) => {
    const prev = session
    const updated = { ...session, title, status }
    setSession(updated)
    try {
      const saved = await updateSpeakingSession(session.id, { ...updated, partCount: parts.length })
      setSession(saved)
    } catch (err) {
      setSession(prev)
      toast.error((err as Error).message ?? 'Failed to save.')
    }
  }

  const handlePartUpdate = async (updatedPart: SpeakingPart) => {
    const prev = parts
    setParts(parts.map((p) => (p.part === updatedPart.part ? updatedPart : p)))
    try {
      if (updatedPart.id) {
        const saved = await updateSpeakingPart(updatedPart.id, updatedPart)
        setParts((current) => current.map((p) => (p.part === saved.part ? saved : p)))
      }
    } catch (err) {
      setParts(prev)
      toast.error((err as Error).message ?? 'Failed to save part.')
    }
  }

  const handleAddPart = async (partNumber: 1 | 2 | 3) => {
    const newPart: SpeakingPart = {
      part: partNumber,
      topic: '',
      questions: [],
      speakingMinutes: partNumber === 2 ? 3 : 4,
      ...(partNumber === 2 && { cueCardPrompt: '', preparationSeconds: 60 }),
    }
    try {
      const saved = await createSpeakingPart(session.id, newPart)
      setParts((current) => [...current, saved].sort((a, b) => a.part - b.part))
      setSession((current) => ({ ...current, partCount: current.partCount + 1 }))
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to add part.')
    }
  }

  const sortedParts = [...parts].sort((a, b) => a.part - b.part)
  const missingParts = ([1, 2, 3] as const).filter((n) => !parts.some((p) => p.part === n))

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={setContext ? [
          { label: 'Sets', href: '/ielts/mock-tests' },
          { label: setContext.setTitle, href: `/ielts/mock-tests/${setContext.setId}` },
          { label: `Test ${setContext.testIndex}`, href: `/ielts/mock-tests/${setContext.setId}/tests/${setContext.testId}` },
          { label: session.title },
        ] : [
          { label: 'Speaking Sessions', href: '/ielts/speaking' },
          { label: session.title },
        ]} />

        <div className="space-y-3">
          <PageHeader title={session.title} description={`Topic: ${session.topic}`}>
            <Button size="sm" variant="ghost" onClick={() => setMetaModalOpen(true)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </PageHeader>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant[session.status]}>{session.status}</Badge>
            <span className="text-xs text-muted-foreground">{sortedParts.length} parts</span>
          </div>
        </div>

        <div className="space-y-4">
          {sortedParts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center">
              <p className="text-sm text-muted-foreground mb-4">No parts yet. Add parts to get started.</p>
              <div className="flex justify-center gap-2">
                {missingParts.map((n) => (
                  <Button key={n} size="sm" variant="ghost" onClick={() => handleAddPart(n)}>
                    <Plus className="h-3.5 w-3.5" />
                    Add Part {n}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {sortedParts.map((part) => (
                <SpeakingPartCard key={part.part} part={part} onUpdate={handlePartUpdate} />
              ))}
              {missingParts.length > 0 && (
                <div className="flex gap-2">
                  {missingParts.map((n) => (
                    <Button key={n} size="sm" variant="ghost" onClick={() => handleAddPart(n)}>
                      <Plus className="h-3.5 w-3.5" />
                      Add Part {n}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ContentFormModal
        open={metaModalOpen}
        onClose={() => setMetaModalOpen(false)}
        editing={{ id: session.id, title: session.title, meta: session.topic, status: session.status, createdAt: session.createdAt }}
        typeOptions={[session.topic]}
        typeLabel="Topic"
        onSave={handleMetaSave}
      />
    </>
  )
}
