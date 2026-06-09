'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { Breadcrumb } from './Breadcrumb'
import { ImagePickerField } from '@/components/media/ImagePickerField'
import type { FullWritingTask, IeltsStatus, SetContext } from '@/lib/types/ielts'
import { updateWritingTask } from '@/lib/api/ielts'

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

const textareaClass =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none'

type WritingTaskDetailShellProps = {
  task: FullWritingTask
  setContext?: SetContext
}

export function WritingTaskDetailShell({ task: initial, setContext }: WritingTaskDetailShellProps) {
  const [task, setTask] = useState(initial)
  const [dirty, setDirty] = useState(false)

  const update = <K extends keyof FullWritingTask>(key: K, value: FullWritingTask[K]) => {
    setTask((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleDiscard = () => {
    setTask(initial)
    setDirty(false)
  }

  const handleSave = async () => {
    try {
      await updateWritingTask(task.id, task)
      setDirty(false)
    } catch {
      // keep dirty state so user can retry
    }
  }

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={setContext ? [
        { label: 'Sets', href: '/ielts/mock-tests' },
        { label: setContext.setTitle, href: `/ielts/mock-tests/${setContext.setId}` },
        { label: `Test ${setContext.testIndex}`, href: `/ielts/mock-tests/${setContext.setId}/tests/${setContext.testId}` },
        { label: task.title },
      ] : [
        { label: 'Writing Tasks', href: '/ielts/writing' },
        { label: task.title },
      ]} />

      <div className="space-y-3">
        <PageHeader title={task.title} description="">
          <div className="flex items-center gap-2">
            {dirty && (
              <>
                <Button size="sm" variant="ghost" onClick={handleDiscard}>Discard</Button>
                <Button size="sm" onClick={handleSave}>Save Changes</Button>
              </>
            )}
          </div>
        </PageHeader>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant[task.status]}>{task.status}</Badge>
          <Badge variant="secondary">{task.type.toUpperCase()}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <Input value={task.title} onChange={(e) => update('title', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Task Type</label>
              <Select value={task.type} onChange={(e) => update('type', e.target.value as 'task1' | 'task2')} className="w-full">
                <option value="task1">Task 1</option>
                <option value="task2">Task 2</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select value={task.status} onChange={(e) => update('status', e.target.value as IeltsStatus)} className="w-full">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Min Words</label>
              <Input type="number" min={50} value={task.wordMinimum} onChange={(e) => update('wordMinimum', Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Time (min)</label>
              <Input type="number" min={1} value={task.timeMinutes} onChange={(e) => update('timeMinutes', Number(e.target.value))} />
            </div>
          </div>

          {task.type === 'task1' && (
            <ImagePickerField
              label="Task Image"
              value={task.imageUrl}
              onChange={(url) => update('imageUrl', url)}
              folder="writing"
            />
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Prompt</label>
            <textarea
              value={task.prompt}
              onChange={(e) => update('prompt', e.target.value)}
              rows={6}
              className={textareaClass}
              placeholder="Enter the writing task prompt…"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Sample Answer</label>
          <textarea
            value={task.sampleAnswer}
            onChange={(e) => update('sampleAnswer', e.target.value)}
            rows={22}
            className={`${textareaClass} h-full min-h-[380px]`}
            placeholder="Enter a model/sample answer…"
          />
        </div>
      </div>

      {dirty && (
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={handleDiscard}>Discard</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      )}
    </div>
  )
}
