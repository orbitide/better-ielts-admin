'use client'

import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import type { VocabWord } from '@/lib/types/ielts'

const difficultyVariant: Record<VocabWord['difficulty'], 'success' | 'warning' | 'secondary'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'secondary',
}

type VocabWordViewModalProps = {
  open: boolean
  onClose: () => void
  word: VocabWord | null
}

export function VocabWordViewModal({ open, onClose, word }: VocabWordViewModalProps) {
  if (!word) return null

  return (
    <Modal open={open} onClose={onClose} title={word.word} className="max-w-2xl">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {word.phonetic && (
            <span className="text-sm font-mono text-muted-foreground">{word.phonetic}</span>
          )}
          <Badge variant={difficultyVariant[word.difficulty]}>{word.difficulty}</Badge>
        </div>

        {word.synonyms.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium">Synonyms</h3>
            <p className="text-sm text-muted-foreground">{word.synonyms.join(', ')}</p>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Definitions</h3>
          {word.definitions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No definitions added.</p>
          ) : (
            word.definitions.map((def, i) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-1.5">
                <Badge variant="secondary" className="text-xs">{def.partOfSpeech}</Badge>
                <p className="text-sm">{def.meaning}</p>
                {def.exampleSentence && (
                  <p className="text-sm text-muted-foreground italic">"{def.exampleSentence}"</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
