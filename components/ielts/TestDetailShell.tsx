'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { BookMarked, Headphones, PenLine, Mic, ArrowRight, Check, Plus, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Breadcrumb } from './Breadcrumb'
import type { FullIeltsTest, IeltsStatus, MockTestSection } from '@/lib/types/ielts'
import { updateTestInSet } from '@/lib/api/ielts'

type Skill = MockTestSection['skill']

const SKILLS: Skill[] = ['listening', 'reading', 'writing', 'speaking']

const skillConfig: Record<Skill, { label: string; icon: React.ElementType; color: string; duration: number }> = {
  reading:   { label: 'Reading',   icon: BookMarked, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',     duration: 60 },
  listening: { label: 'Listening', icon: Headphones,  color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', duration: 40 },
  writing:   { label: 'Writing',   icon: PenLine,     color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',   duration: 60 },
  speaking:  { label: 'Speaking',  icon: Mic,         color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',   duration: 15 },
}

const skillHref: Record<Skill, string> = {
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
  availableSkills: Record<Skill, SkillOption[]>
  skillTitles: Record<string, string>
}

export function TestDetailShell({ setId, setTitle, test: initial, availableSkills, skillTitles }: TestDetailShellProps) {
  const [sections, setSections] = useState(initial.sections)
  const [test, setTest] = useState(initial)
  const [changingSkill, setChangingSkill] = useState<Skill | null>(null)
  const [draftId, setDraftId] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(initial.title)
  const [editStatus, setEditStatus] = useState<IeltsStatus>(initial.status)
  const [editDuration, setEditDuration] = useState(String(initial.durationMinutes))
  const [editSaving, setEditSaving] = useState(false)

  const openEdit = () => {
    setEditTitle(test.title)
    setEditStatus(test.status)
    setEditDuration(String(test.durationMinutes))
    setEditOpen(true)
  }

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const duration = parseInt(editDuration, 10)
    if (!editTitle.trim() || isNaN(duration) || duration < 1) return
    setEditSaving(true)
    const updated: FullIeltsTest = { ...test, title: editTitle.trim(), status: editStatus, durationMinutes: duration, sections }
    try {
      await updateTestInSet(test.id, setId, updated)
      setTest(updated)
      setEditOpen(false)
      toast.success('Test updated.')
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to update test.')
    }
    setEditSaving(false)
  }

  const sectionBySkill: Partial<Record<Skill, MockTestSection>> = {}
  for (const s of sections) sectionBySkill[s.skill] = s

  const openChange = (skill: Skill) => {
    setChangingSkill(skill)
    setDraftId(sectionBySkill[skill]?.testId ?? '')
  }

  const handleSave = async () => {
    if (!changingSkill) return

    let updatedSections: MockTestSection[]
    const existing = sectionBySkill[changingSkill]
    if (existing) {
      updatedSections = sections.map((s) => s.skill === changingSkill ? { ...s, testId: draftId } : s)
    } else {
      const newSection: MockTestSection = {
        id: '',
        skill: changingSkill,
        orderIndex: sections.length + 1,
        durationMinutes: skillConfig[changingSkill].duration,
        testId: draftId,
      }
      updatedSections = [...sections, newSection]
    }

    setSections(updatedSections)
    setChangingSkill(null)
    try {
      await updateTestInSet(test.id, setId, { ...test, sections: updatedSections })
    } catch { /* best-effort */ }
  }

  const contextParams = () =>
    `?setId=${setId}&setTitle=${encodeURIComponent(setTitle)}&testId=${test.id}&testIndex=${test.orderIndex}&from=set`

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={[
          { label: 'Sets', href: '/ielts/mock-tests' },
          { label: setTitle, href: `/ielts/mock-tests/${setId}` },
          { label: test.title },
        ]} />

        <div className="space-y-3">
          <PageHeader
            title={`${setTitle} — ${test.title}`}
            description={`${test.durationMinutes} min total · ${test.sectionCount} skill sections`}
          >
            <Button size="sm" variant="ghost" onClick={openEdit}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </PageHeader>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant[test.status]}>{test.status}</Badge>
            <span className="text-xs text-muted-foreground">{test.durationMinutes} min</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Skill Sections</h2>
          {SKILLS.map((skill) => {
            const config = skillConfig[skill]
            const Icon = config.icon
            const section = sectionBySkill[skill]
            const isAssigned = !!(section?.testId)
            const title = isAssigned ? (skillTitles[section!.testId] ?? section!.testId) : null
            const href = isAssigned ? `${skillHref[skill]}/${section!.testId}${contextParams()}` : null

            return (
              <div key={skill} className="rounded-xl border border-border bg-card p-4 flex items-start gap-4">
                <div className={`rounded-lg p-2.5 shrink-0 ${config.color}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium text-sm">{config.label}</p>
                  {isAssigned ? (
                    <>
                      <p className="text-xs text-muted-foreground truncate">{title}</p>
                      <p className="text-xs text-muted-foreground">{section!.durationMinutes} min</p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Not assigned</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isAssigned ? (
                    <>
                      <button
                        onClick={() => openChange(skill)}
                        className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-2.5 py-1 transition-colors"
                      >
                        Change
                      </button>
                      <Link
                        href={href!}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title={`Open ${config.label} content`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => openChange(skill)}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 border border-primary/30 rounded-md px-2.5 py-1 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Assign
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Test">
        <form onSubmit={handleEditSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="e.g. Test 1" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select value={editStatus} onChange={(e) => setEditStatus(e.target.value as IeltsStatus)} className="w-full">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Duration (min)</label>
              <Input type="number" min={1} value={editDuration} onChange={(e) => setEditDuration(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={editSaving || !editTitle.trim()}>
              {editSaving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {changingSkill && (
        <Modal
          open={!!changingSkill}
          onClose={() => setChangingSkill(null)}
          title={`${sectionBySkill[changingSkill] ? 'Change' : 'Assign'} ${skillConfig[changingSkill].label} Content`}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the {skillConfig[changingSkill].label.toLowerCase()} content to assign to this test.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableSkills[changingSkill].map((opt) => (
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
              {availableSkills[changingSkill].length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No {skillConfig[changingSkill].label.toLowerCase()} content found. Create some first.
                </p>
              )}
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setChangingSkill(null)}>Cancel</Button>
              <Button type="button" size="sm" onClick={handleSave} disabled={!draftId}>Save</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
