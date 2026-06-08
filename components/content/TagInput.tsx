'use client'

import { useState, useRef } from 'react'
import { X, Pencil, Check } from 'lucide-react'
import { cn } from '@/lib/utils/utils'

type TagInputProps = {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ value, onChange, placeholder = 'Add tag…' }: TagInputProps) {
  const [input, setInput] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const editRef = useRef<HTMLInputElement>(null)

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase()
    if (tag && !value.includes(tag)) {
      onChange([...value, tag])
    }
    setInput('')
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditValue(value[index])
    setTimeout(() => editRef.current?.focus(), 0)
  }

  const commitEdit = () => {
    if (editingIndex === null) return
    const tag = editValue.trim().toLowerCase()
    if (tag && !value.some((t, i) => t === tag && i !== editingIndex)) {
      const updated = [...value]
      updated[editingIndex] = tag
      onChange(updated)
    }
    setEditingIndex(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && input === '' && value.length > 0 && editingIndex === null) {
      removeTag(value.length - 1)
    }
  }

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); commitEdit() }
    if (e.key === 'Escape') { e.preventDefault(); cancelEdit() }
  }

  return (
    <div
      className={cn(
        'flex flex-wrap gap-1.5 min-h-[38px] w-full rounded-md border border-input bg-background px-2 py-1.5 cursor-text',
        'focus-within:ring-1 focus-within:ring-ring',
      )}
      onClick={() => { if (editingIndex === null) inputRef.current?.focus() }}
    >
      {value.map((tag, i) =>
        editingIndex === i ? (
          <span key={tag + i} className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary px-2 py-0.5">
            <input
              ref={editRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={commitEdit}
              className="bg-transparent text-xs font-medium outline-none w-[80px] min-w-0"
            />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); commitEdit() }}
              className="rounded-full hover:bg-primary/20 transition-colors"
              title="Save"
            >
              <Check className="h-2.5 w-2.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); cancelEdit() }}
              className="rounded-full hover:bg-primary/20 transition-colors"
              title="Cancel"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ) : (
          <span
            key={tag + i}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium group"
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); startEdit(i) }}
              className="rounded-full hover:bg-primary/20 transition-colors opacity-0 group-hover:opacity-100"
              title="Edit tag"
            >
              <Pencil className="h-2.5 w-2.5" />
            </button>
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i) }}
              className="rounded-full hover:bg-primary/20 transition-colors"
              title="Remove tag"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        )
      )}
      {editingIndex === null && (
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addTag(input) }}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      )}
    </div>
  )
}
