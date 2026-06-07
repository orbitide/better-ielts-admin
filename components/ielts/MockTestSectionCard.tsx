'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BookMarked, Headphones, PenLine, Mic, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { MockTestSection } from '@/lib/types/ielts'

const skillConfig = {
  reading: { label: 'Reading', icon: BookMarked, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  listening: { label: 'Listening', icon: Headphones, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  writing: { label: 'Writing', icon: PenLine, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  speaking: { label: 'Speaking', icon: Mic, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
}

const skillDetailHref: Record<MockTestSection['skill'], string> = {
  reading: '/ielts/reading',
  listening: '/ielts/listening',
  writing: '/ielts/writing',
  speaking: '/ielts/speaking',
}

type MockTestSectionCardProps = {
  section: MockTestSection
  onChangeTestId: (sectionId: string, newTestId: string) => void
}

export function MockTestSectionCard({ section, onChangeTestId }: MockTestSectionCardProps) {
  const [changeOpen, setChangeOpen] = useState(false)
  const [draftId, setDraftId] = useState(section.testId)
  const config = skillConfig[section.skill]
  const Icon = config.icon

  const handleSave = () => {
    onChangeTestId(section.id, draftId)
    setChangeOpen(false)
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-4">
        <div className={`rounded-lg p-2.5 shrink-0 ${config.color}`}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{config.label}</span>
            <Badge variant="secondary">{section.durationMinutes} min</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Test ID: <code className="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">{section.testId}</code>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { setDraftId(section.testId); setChangeOpen(true) }}
            className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-2.5 py-1 transition-colors"
          >
            Change
          </button>
          <Link
            href={`${skillDetailHref[section.skill]}/${section.testId}`}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title={`Open ${config.label} test`}
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Modal open={changeOpen} onClose={() => setChangeOpen(false)} title={`Change ${config.label} Test`}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the ID of the {config.label.toLowerCase()} test to assign to this set section.
          </p>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Test ID</label>
            <Input
              value={draftId}
              onChange={(e) => setDraftId(e.target.value)}
              placeholder="e.g. rt-1"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => setChangeOpen(false)}>Cancel</Button>
            <Button type="button" size="sm" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
