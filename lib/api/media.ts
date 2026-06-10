import httpClient from '@/lib/api/http'
import type { MediaAsset, MediaFolder, MediaListResult } from '@/lib/types/media'

export async function uploadMedia(file: File, folder: MediaFolder): Promise<MediaAsset> {
  const body = new FormData()
  body.append('file', file)
  body.append('folder', folder)
  const { data } = await httpClient.post<{ data: MediaAsset }>('/api/media/upload', body, {
    headers: { 'Content-Type': undefined },
  })
  return data.data
}

export async function listMedia(params: {
  folder?: string
  mimeType?: string
  page?: number
  pageSize?: number
} = {}): Promise<MediaListResult> {
  const { data } = await httpClient.get<{ data: MediaListResult }>('/api/media', { params })
  return data.data
}

export async function deleteMedia(id: string): Promise<void> {
  await httpClient.delete(`/api/media/${id}`)
}
