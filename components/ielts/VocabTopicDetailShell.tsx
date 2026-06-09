'use client'

import { useState } from 'react'
import { Pencil, Plus, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PageHeader } from '@/components/ui/PageHeader'
import { Breadcrumb } from './Breadcrumb'
import { VocabWordFormModal } from './VocabWordFormModal'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import type { FullVocabTopic, VocabWord, IeltsStatus } from '@/lib/types/ielts'
import { updateVocabTopic } from '@/lib/api/ielts'

const difficultyVariant: Record<VocabWord['difficulty'], 'success' | 'warning' | 'secondary'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'secondary',
}

const statusVariant: Record<IeltsStatus, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
}

type VocabTopicDetailShellProps = {
  topic: FullVocabTopic
}

export function VocabTopicDetailShell({ topic: initial }: VocabTopicDetailShellProps) {
  const [topic, setTopic] = useState(initial)
  const [editMetaOpen, setEditMetaOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState(initial.title)
  const [draftDifficulty, setDraftDifficulty] = useState<FullVocabTopic['difficulty']>(initial.difficulty)
  const [draftStatus, setDraftStatus] = useState<IeltsStatus>(initial.status)
  const [wordModalOpen, setWordModalOpen] = useState(false)
  const [editingWord, setEditingWord] = useState<VocabWord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<VocabWord | null>(null)

  const persist = async (updated: FullVocabTopic) => {
    const prev = topic
    setTopic(updated)
    try {
      const saved = await updateVocabTopic(updated.id, updated)
      setTopic(saved)
    } catch {
      setTopic(prev)
    }
  }

  const openEditMeta = () => {
    setDraftTitle(topic.title)
    setDraftDifficulty(topic.difficulty)
    setDraftStatus(topic.status)
    setEditMetaOpen(true)
  }

  const handleMetaSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditMetaOpen(false)
    await persist({ ...topic, title: draftTitle, difficulty: draftDifficulty, status: draftStatus })
  }

  const handleWordSave = async (word: Omit<VocabWord, 'id' | 'isLearned'> & { id?: string }) => {
    let updatedWords: VocabWord[]
    if (word.id) {
      updatedWords = topic.words.map((w) => w.id === word.id ? { ...word, id: word.id, isLearned: false } : w)
    } else {
      updatedWords = [...topic.words, { ...word, id: `temp-${Date.now()}`, isLearned: false }]
    }
    await persist({ ...topic, words: updatedWords, wordCount: updatedWords.length })
  }

  const handleDeleteWord = async () => {
    if (!deleteTarget) return
    const updatedWords = topic.words.filter((w) => w.id !== deleteTarget.id)
    setDeleteTarget(null)
    await persist({ ...topic, words: updatedWords, wordCount: updatedWords.length })
  }

  const openAddWord = () => { setEditingWord(null); setWordModalOpen(true) }
  const openEditWord = (word: VocabWord) => { setEditingWord(word); setWordModalOpen(true) }

  return (
    <>
      <div className="p-5 sm:p-6 space-y-6 max-w-3xl mx-auto">
        <Breadcrumb items={[
          { label: 'Vocabulary', href: '/ielts/vocabulary' },
          { label: topic.title },
        ]} />

        <div className="space-y-4">
          <PageHeader title={topic.title} description={topic.description || 'No description.'}>
            <Button size="sm" variant="ghost" onClick={openEditMeta}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button size="sm" onClick={openAddWord}>
              <Plus className="h-3.5 w-3.5" />
              Add Word
            </Button>
          </PageHeader>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant[topic.status]}>{topic.status}</Badge>
            <Badge variant={difficultyVariant[topic.difficulty]}>{topic.difficulty}</Badge>
            <span className="text-xs text-muted-foreground">{topic.wordCount} word{topic.wordCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Words ({topic.words.length})
          </h2>

          {topic.words.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center">
              <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No words yet.</p>
              <button onClick={openAddWord} className="mt-2 text-sm text-primary hover:underline">
                Add the first word
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">Word</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">Phonetic</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">Level</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Defs</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topic.words.map((word) => (
                    <tr key={word.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{word.word}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden sm:table-cell">{word.phonetic || '—'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={difficultyVariant[word.difficulty]} className="text-xs">
                          {word.difficulty}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{word.definitions.length}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => openEditWord(word)}
                            className="rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(word)}
                            className="rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-red-100 hover:text-red-600 transition-colors"
                          >
                            Delete
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

      <Modal open={editMetaOpen} onClose={() => setEditMetaOpen(false)} title="Edit Topic">
        <form onSubmit={handleMetaSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <Input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="Topic title" autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Difficulty</label>
            <Select value={draftDifficulty} onChange={(e) => setDraftDifficulty(e.target.value as FullVocabTopic['difficulty'])} className="w-full">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Status</label>
            <Select value={draftStatus} onChange={(e) => setDraftStatus(e.target.value as IeltsStatus)} className="w-full">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditMetaOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save Changes</Button>
          </div>
        </form>
      </Modal>

      <VocabWordFormModal
        open={wordModalOpen}
        onClose={() => setWordModalOpen(false)}
        editing={editingWord}
        onSave={handleWordSave}
      />

      <Modal open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete Word">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.word}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteWord}>Delete</Button>
        </div>
      </Modal>
    </>
  )
}
