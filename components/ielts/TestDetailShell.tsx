'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookMarked, Headphones, PenLine, Mic, ArrowRight, Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Breadcrumb } from './Breadcrumb'
import type { FullIeltsTest, IeltsStatus, MockTestSection } from '@/lib/types/ielts'
import { updateTestInSet } from '@/lib/api/ielts'

const skillConfig = {
  reading: { label: 'Reading', icon: BookMarked, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  listening: { label: 'Listening', icon: Headphones, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  writing: { label: 'Writing', icon: PenLine, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  speaking: { label: 'Speaking', icon: Mic, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
}

const skillHref: Record<MockTestSection['skill'], string> = {
  reading: '/ielts/reading',
  listening: '/ielts/listening',
  writing: '/ielts/writing',
  speaking: '/ielts/speaking',
}

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

type SkillOption = { id: string; title: string }

type TestDetailShellProps = {
  setId: string
  setTitle: string
  test: FullIeltsTest
  availableSkills: {
    reading: SkillOption[]
    listening: SkillOption[]
    writing: SkillOption[]
    speaking: SkillOption[]
  }
  skillTitles: Record<string, string>
}

export function TestDetailShell({ setId, setTitle, test: initial, availableSkills, skillTitles }: TestDetailShellProps) {
  const [sections, setSections] = useState(initial.sections)
  const [changingSection, setChangingSection] = useState<MockTestSection | null>(null)
  const [draftId, setDraftId] = useState('')

  const sortedSections = [...sections].sort((a, b) => a.orderIndex - b.orderIndex)

  const openChange = (section: MockTestSection) => {
    setChangingSection(section)
    setDraftId(section.testId)
  }

  const handleSave = async () => {
    if (!changingSection) return
    const updatedSections = sections.map((s) => s.id === changingSection.id ? { ...s, testId: draftId } : s)
    setSections(updatedSections)
    setChangingSection(null)
    try {
      await updateTestInSet(initial.id, setId, { ...initial, sections: updatedSections })
    } catch { /* best-effort */ }
  }

  const contextParams = () =>
    `?setId=${setId}&setTitle=${encodeURIComponent(setTitle)}&testId=${initial.id}&testIndex=${initial.orderIndex}&from=set`

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={[
          { label: 'Sets', href: '/ielts/mock-tests' },
          { label: setTitle, href: `/ielts/mock-tests/${setId}` },
          { label: initial.title },
        ]} />

        <div className="space-y-3">
          <PageHeader
            title={`${setTitle} — ${initial.title}`}
            description={`${initial.durationMinutes} min total · ${initial.sectionCount} skill sections`}
          />
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant[initial.status]}>{initial.status}</Badge>
            <span className="text-xs text-muted-foreground">{initial.durationMinutes} min</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Skill Sections</h2>
          {sortedSections.map((section) => {
            const config = skillConfig[section.skill]
            const Icon = config.icon
            const title = skillTitles[section.testId] ?? section.testId
            const href = `${skillHref[section.skill]}/${section.testId}${contextParams()}`

            return (
              <div key={section.id} className="rounded-xl border border-border bg-card p-4 flex items-start gap-4">
                <div className={`rounded-lg p-2.5 shrink-0 ${config.color}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium text-sm">{config.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{title}</p>
                  <p className="text-xs text-muted-foreground">{section.durationMinutes} min</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openChange(section)}
                    className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-2.5 py-1 transition-colors"
                  >
                    Change
                  </button>
                  <Link
                    href={href}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title={`Open ${config.label} content`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {changingSection && (
        <Modal
          open={!!changingSection}
          onClose={() => setChangingSection(null)}
          title={`Change ${skillConfig[changingSection.skill].label} Content`}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the {skillConfig[changingSection.skill].label.toLowerCase()} content to assign to this test.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableSkills[changingSection.skill].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDraftId(opt.id)}
                  className={`w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm text-left transition-colors ${
                    draftId === opt.id
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <span className="truncate pr-2">{opt.title}</span>
                  {draftId === opt.id && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setChangingSection(null)}>Cancel</Button>
              <Button type="button" size="sm" onClick={handleSave}>Save</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
