'use client'

import { useState } from 'react'
import { ImageIcon, X } from 'lucide-react'
import { MediaLibraryModal } from './MediaLibraryModal'
import type { MediaFolder } from '@/lib/types/media'

type Props = {
  value: string | undefined
  onChange: (url: string | undefined) => void
  folder?: MediaFolder
  label?: string
}

export function ImagePickerField({ value, onChange, folder, label }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium">{label}</label>}

      {value ? (
        <div className="relative rounded-md border border-border overflow-hidden">
          <img src={value} alt="Selected" className="h-36 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/50 px-2 py-1.5">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-xs text-white hover:underline"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="rounded p-0.5 text-white hover:text-red-400 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/20 py-6 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
        >
          <ImageIcon className="h-6 w-6" />
          <span className="text-xs font-medium">Upload / Choose Image</span>
        </button>
      )}

      <MediaLibraryModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(url) => { onChange(url); setOpen(false) }}
        folder={folder}
      />
    </div>
  )
}
