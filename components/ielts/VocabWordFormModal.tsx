'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { VocabWord, VocabWordDefinition } from '@/lib/types/ielts'

type VocabWordFormModalProps = {
  open: boolean
  onClose: () => void
  editing: VocabWord | null
  onSave: (word: Omit<VocabWord, 'id' | 'isLearned'> & { id?: string }) => void
}

const emptyDef = (): VocabWordDefinition => ({ partOfSpeech: 'noun', meaning: '', exampleSentence: '' })

export function VocabWordFormModal({ open, onClose, editing, onSave }: VocabWordFormModalProps) {
  const [word, setWord] = useState('')
  const [phonetic, setPhonetic] = useState('')
  const [difficulty, setDifficulty] = useState<VocabWord['difficulty']>('intermediate')
  const [synonymsText, setSynonymsText] = useState('')
  const [definitions, setDefinitions] = useState<VocabWordDefinition[]>([emptyDef()])

  useEffect(() => {
    if (editing) {
      setWord(editing.word)
      setPhonetic(editing.phonetic)
      setDifficulty(editing.difficulty)
      setSynonymsText(editing.synonyms.join(', '))
      setDefinitions(editing.definitions.length > 0 ? editing.definitions : [emptyDef()])
    } else {
      setWord('')
      setPhonetic('')
      setDifficulty('intermediate')
      setSynonymsText('')
      setDefinitions([emptyDef()])
    }
  }, [editing, open])

  const addDefinition = () => setDefinitions((prev) => [...prev, emptyDef()])
  const removeDefinition = (i: number) => setDefinitions((prev) => prev.filter((_, idx) => idx !== i))
  const updateDefinition = <K extends keyof VocabWordDefinition>(i: number, key: K, value: VocabWordDefinition[K]) =>
    setDefinitions((prev) => prev.map((d, idx) => idx === i ? { ...d, [key]: value } : d))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!word.trim()) return
    const synonyms = synonymsText.split(',').map((s) => s.trim()).filter(Boolean)
    onSave({ id: editing?.id, word: word.trim(), phonetic: phonetic.trim(), difficulty, synonyms, definitions: definitions.filter((d) => d.meaning.trim()) })
    onClose()
  }

  const textareaClass = 'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none'

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Word' : 'Add Word'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Word</label>
            <Input value={word} onChange={(e) => setWord(e.target.value)} placeholder="e.g. ephemeral" autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Phonetic</label>
            <Input value={phonetic} onChange={(e) => setPhonetic(e.target.value)} placeholder="/ɪˈfem.ər.əl/" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Difficulty</label>
            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as VocabWord['difficulty'])} className="w-full">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Synonyms</label>
            <Input value={synonymsText} onChange={(e) => setSynonymsText(e.target.value)} placeholder="brief, transient, fleeting" />
            <p className="text-xs text-muted-foreground">Comma-separated</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Definitions</label>
            <Button type="button" size="sm" variant="ghost" onClick={addDefinition}>
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
          {definitions.map((def, i) => (
            <div key={i} className="rounded-lg border border-border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Select value={def.partOfSpeech} onChange={(e) => updateDefinition(i, 'partOfSpeech', e.target.value)} className="w-36">
                  {['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'phrase'].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
                {definitions.length > 1 && (
                  <button type="button" onClick={() => removeDefinition(i)} className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-red-100 hover:text-red-600 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <Input value={def.meaning} onChange={(e) => updateDefinition(i, 'meaning', e.target.value)} placeholder="Meaning / definition" />
              <textarea value={def.exampleSentence} onChange={(e) => updateDefinition(i, 'exampleSentence', e.target.value)} placeholder="Example sentence…" rows={2} className={textareaClass} />
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">{editing ? 'Save Changes' : 'Add Word'}</Button>
        </div>
      </form>
    </Modal>
  )
}
