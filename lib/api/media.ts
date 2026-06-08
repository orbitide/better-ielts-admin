import axios from 'axios'
import type { MediaAsset, MediaFolder, MediaListResult } from '@/lib/types/media'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/$/, '')

const api = axios.create({
  baseURL: `${API_URL}/api/media`,
  withCredentials: true,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? 'Request failed'
    return Promise.reject(new Error(message))
  }
)

export async function uploadMedia(file: File, folder: MediaFolder): Promise<MediaAsset> {
  const body = new FormData()
  body.append('file', file)
  body.append('folder', folder)
  const { data } = await api.post<{ data: MediaAsset }>('/upload', body)
  return data.data
}

export async function listMedia(params: {
  folder?: string
  mimeType?: string
  page?: number
  pageSize?: number
} = {}): Promise<MediaListResult> {
  const { data } = await api.get<{ data: MediaListResult }>('', { params })
  return data.data
}

export async function deleteMedia(id: string): Promise<void> {
  await api.delete(`/${id}`)
}
