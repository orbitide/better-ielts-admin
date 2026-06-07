import type { MockTest } from '@/lib/types/ielts'

export const mockMockTests: MockTest[] = [
  {
    id: 'mt-1',
    title: 'Full Mock Test 1 — Academic',
    type: 'academic',
    durationMinutes: 165,
    sectionCount: 4,
    status: 'published',
    createdAt: '2025-09-01',
  },
  {
    id: 'mt-2',
    title: 'Full Mock Test 2 — Academic',
    type: 'academic',
    durationMinutes: 165,
    sectionCount: 4,
    status: 'published',
    createdAt: '2025-10-05',
  },
  {
    id: 'mt-3',
    title: 'Full Mock Test 1 — General Training',
    type: 'general',
    durationMinutes: 165,
    sectionCount: 4,
    status: 'published',
    createdAt: '2025-11-12',
  },
  {
    id: 'mt-4',
    title: 'Full Mock Test 3 — Academic',
    type: 'academic',
    durationMinutes: 165,
    sectionCount: 4,
    status: 'draft',
    createdAt: '2026-02-08',
  },
]
