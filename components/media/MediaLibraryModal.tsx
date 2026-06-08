'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Image as ImageIcon, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { uploadMedia, listMedia, deleteMedia } from '@/lib/api/media'
import { cn } from '@/lib/utils/utils'
import type { MediaAsset, MediaFolder } from '@/lib/types/media'

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  folder?: MediaFolder
}

const PAGE_SIZE = 24

export function MediaLibraryModal({ open, onClose, onSelect, folder }: Props) {
  const [tab, setTab] = useState<'upload' | 'library'>('upload')
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [libLoading, setLibLoading] = useState(false)
  const [browseFolder, setBrowseFolder] = useState(folder ?? '')

  // Upload tab state
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<{ url: string; name: string; size: number } | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadLibrary = async (p = 1, f = browseFolder) => {
    setLibLoading(true)
    try {
      const result = await listMedia({ folder: f || undefined, mimeType: 'image', page: p, pageSize: PAGE_SIZE })
      setAssets(result.items)
      setTotalPages(result.totalPages)
      setPage(p)
    } catch {
      // silently fail — empty grid shown
    } finally {
      setLibLoading(false)
    }
  }

  useEffect(() => {
    if (open && tab === 'library') loadLibrary(1, browseFolder)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tab])

  useEffect(() => {
    if (!open) {
      setTab('upload')
      setPreview(null)
      setUploadError(null)
      setSelectedId(null)
    }
  }, [open])

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds the 5 MB limit.')
      return
    }
    setUploadError(null)
    const objectUrl = URL.createObjectURL(file)
    setPreview({ url: objectUrl, name: file.name, size: file.size })
  }

  const handleUpload = async () => {
    if (!preview) return
    setUploadLoading(true)
    setUploadError(null)
    try {
      const file = fileInputRef.current?.files?.[0]
      if (!file) throw new Error('No file selected.')
      const asset = await uploadMedia(file, folder ?? 'inline')
      setTab('library')
      await loadLibrary(1, browseFolder)
      setSelectedId(asset.id)
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleConfirm = () => {
    const asset = assets.find((a) => a.id === selectedId)
    if (asset) {
      onSelect(asset.url)
      onClose()
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await deleteMedia(id)
      setAssets((prev) => prev.filter((a) => a.id !== id))
      if (selectedId === id) setSelectedId(null)
    } catch {
      // ignore
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Modal open={open} onClose={onClose} title="Media Library" className="max-w-3xl">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-4">
        {(['upload', 'library'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t)
              if (t === 'library') loadLibrary(1, browseFolder)
            }}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors capitalize',
              tab === t
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Upload tab */}
      {tab === 'upload' && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors',
              dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/40'
            )}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drop an image here or click to browse</p>
            <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, GIF · Max 5 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>

          {preview && (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <img src={preview.url} alt={preview.name} className="h-16 w-16 rounded object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{preview.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(preview.size)}</p>
              </div>
            </div>
          )}

          {uploadError && (
            <p className="text-sm text-red-500">{uploadError}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!preview || uploadLoading}>
              {uploadLoading ? 'Uploading…' : 'Upload'}
            </Button>
          </div>
        </div>
      )}

      {/* Library tab */}
      {tab === 'library' && (
        <div className="space-y-4">
          {/* Folder filter */}
          <div className="flex items-center gap-2">
            <select
              value={browseFolder}
              onChange={(e) => { setBrowseFolder(e.target.value); loadLibrary(1, e.target.value) }}
              className="rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All folders</option>
              <option value="blog">Blog</option>
              <option value="writing">Writing</option>
              <option value="inline">Inline</option>
            </select>
            <span className="text-xs text-muted-foreground ml-auto">{assets.length} file{assets.length !== 1 ? 's' : ''}</span>
          </div>

          {libLoading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Loading…</div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
              <p className="text-sm">No images yet. Upload one first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedId(asset.id === selectedId ? null : asset.id)}
                  className={cn(
                    'group relative rounded-md border-2 cursor-pointer overflow-hidden',
                    selectedId === asset.id ? 'border-primary' : 'border-transparent hover:border-border'
                  )}
                >
                  <img
                    src={asset.url}
                    alt={asset.originalFileName}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white truncate">{asset.originalFileName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(asset.id, e)}
                    className="absolute top-1 right-1 rounded bg-black/50 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => loadLibrary(page - 1)}
                className="rounded p-1 hover:bg-accent disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-muted-foreground">{page} / {totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => loadLibrary(page + 1)}
                className="rounded p-1 hover:bg-accent disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={!selectedId}>Use this image</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
