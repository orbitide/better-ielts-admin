import type { IeltsSet } from '@/lib/types/ielts'

export const mockIeltsSets: IeltsSet[] = [
  {
    id: 'set-1',
    title: 'Cambridge IELTS Academic',
    description: 'Three full academic IELTS tests covering all four skills. Suitable for students targeting Band 6.5 and above.',
    type: 'academic',
    difficulty: 'intermediate',
    testCount: 3,
    status: 'published',
    createdAt: '2025-09-01',
  },
  {
    id: 'set-2',
    title: 'Cambridge IELTS General Training',
    description: 'A complete General Training mock test set with everyday reading texts and practical writing tasks.',
    type: 'general',
    difficulty: 'beginner',
    testCount: 1,
    status: 'published',
    createdAt: '2025-11-12',
  },
]
