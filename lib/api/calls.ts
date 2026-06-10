import httpClient from '@/lib/api/http'
import type { CallTopic } from '@/lib/types/calls'
import type { IeltsStatus } from '@/lib/types/ielts'

type ApiResponse<T> = { data: T }
type PagedResult<T> = { items: T[]; totalCount: number; page: number; pageSize: number; totalPages: number }

type ApiCallTopic = {
  id: string
  label: string
  icon: string
  description: string
  questions: string[]
  status: string
  sortOrder: number
  createdAt: string
}

function mapCallTopic(t: ApiCallTopic): CallTopic {
  return {
    id: t.id,
    label: t.label,
    icon: t.icon,
    description: t.description,
    questions: t.questions,
    status: t.status as IeltsStatus,
    sortOrder: t.sortOrder,
    createdAt: t.createdAt,
  }
}

export type CallTopicsPage = { items: CallTopic[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchCallTopics(page = 1, pageSize = 20, status?: string): Promise<CallTopicsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (status) params.set('status', status)
  const { data } = await httpClient.get<ApiResponse<PagedResult<ApiCallTopic>>>(`/api/admin/calls/topics?${params}`)
  const r = data.data
  return { items: r.items.map(mapCallTopic), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchCallTopicById(id: string): Promise<CallTopic> {
  const { data } = await httpClient.get<ApiResponse<ApiCallTopic>>(`/api/admin/calls/topics/${id}`)
  return mapCallTopic(data.data)
}

export async function createCallTopic(payload: { label: string; icon?: string; sortOrder?: number }): Promise<CallTopic> {
  const { data } = await httpClient.post<ApiResponse<ApiCallTopic>>('/api/admin/calls/topics', {
    label: payload.label,
    icon: payload.icon ?? 'MessageCircle',
    description: '',
    questions: [],
    status: 'draft',
    sortOrder: payload.sortOrder ?? 0,
  })
  return mapCallTopic(data.data)
}

export async function updateCallTopic(id: string, topic: CallTopic): Promise<CallTopic> {
  const { data } = await httpClient.put<ApiResponse<ApiCallTopic>>(`/api/admin/calls/topics/${id}`, {
    label: topic.label,
    icon: topic.icon,
    description: topic.description,
    questions: topic.questions,
    status: topic.status,
    sortOrder: topic.sortOrder,
  })
  return mapCallTopic(data.data)
}

export async function deleteCallTopic(id: string): Promise<void> {
  await httpClient.delete(`/api/admin/calls/topics/${id}`)
}
