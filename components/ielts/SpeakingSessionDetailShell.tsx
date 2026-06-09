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
import { updateSpeakingSession } from '@/lib/api/ielts'

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

type SpeakingSessionDetailShellProps = {
  session: FullSpeakingSession
  setContext?: SetContext
}

export function SpeakingSessionDetailShell({ session: initial, setContext }: SpeakingSessionDetailShellProps) {
  const [session, setSession] = useState(initial)
  const [metaModalOpen, setMetaModalOpen] = useState(false)

  const handleMetaSave = async ({ title, status }: { title: string; type: string; status: IeltsStatus }) => {
    const prev = session
    const updated = { ...session, title, status }
    setSession(updated)
    try {
      const saved = await updateSpeakingSession(session.id, updated)
      setSession(saved)
    } catch (err) {
      setSession(prev)
      toast.error((err as Error).message ?? 'Failed to save.')
    }
  }

  const handlePartUpdate = async (updatedPart: SpeakingPart) => {
    const prev = session
    const updated = { ...session, parts: session.parts.map((p) => (p.part === updatedPart.part ? updatedPart : p)) }
    setSession(updated)
    try {
      const saved = await updateSpeakingSession(session.id, updated)
      setSession(saved)
    } catch (err) {
      setSession(prev)
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
    const prev = session
    const updated = { ...session, parts: [...session.parts, newPart].sort((a, b) => a.part - b.part), partCount: session.parts.length + 1 }
    setSession(updated)
    try {
      const saved = await updateSpeakingSession(session.id, updated)
      setSession(saved)
    } catch (err) {
      setSession(prev)
      toast.error((err as Error).message ?? 'Failed to add part.')
    }
  }

  const sortedParts = [...session.parts].sort((a, b) => a.part - b.part)
  const missingParts = ([1, 2, 3] as const).filter((n) => !session.parts.some((p) => p.part === n))

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
