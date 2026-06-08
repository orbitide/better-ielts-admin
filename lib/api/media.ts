import type { MediaAsset, MediaFolder, MediaListResult } from '@/lib/types/media'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/$/, '')

export async function uploadMedia(file: File, folder: MediaFolder): Promise<MediaAsset> {
  const body = new FormData()
  body.append('file', file)
  body.append('folder', folder)

  const res = await fetch(`${API_URL}/api/media/upload`, {
    method: 'POST',
    body,
    credentials: 'include',
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.message ?? `Upload failed (${res.status})`)
  }

  const json = await res.json()
  return json.data as MediaAsset
}

export async function listMedia(params: {
  folder?: string
  mimeType?: string
  page?: number
  pageSize?: number
} = {}): Promise<MediaListResult> {
  const qs = new URLSearchParams()
  if (params.folder) qs.set('folder', params.folder)
  if (params.mimeType) qs.set('mimeType', params.mimeType)
  if (params.page) qs.set('page', String(params.page))
  if (params.pageSize) qs.set('pageSize', String(params.pageSize))

  const res = await fetch(`${API_URL}/api/media?${qs}`, { credentials: 'include' })

  if (!res.ok) throw new Error(`Failed to load media (${res.status})`)

  const json = await res.json()
  return json.data as MediaListResult
}

export async function deleteMedia(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/media/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Delete failed (${res.status})`)
}
