export type MediaFolder = 'blog' | 'writing' | 'inline'

export type MediaAsset = {
  id: string
  originalFileName: string
  url: string
  mimeType: string
  sizeBytes: number
  folder: string
  createdAt: string
}

export type MediaListResult = {
  items: MediaAsset[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
