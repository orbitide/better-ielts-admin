import type { FullIeltsSet } from '@/lib/types/ielts'
import { mockFullMockTests } from '@/lib/mock/mock-tests-full'

// Pull the section arrays from the existing mock-tests-full data
const mt = (id: string) => mockFullMockTests.find((t) => t.id === id)!

export const mockFullIeltsSets: FullIeltsSet[] = [
  {
    id: 'set-1',
    title: 'Cambridge IELTS Academic',
    description: 'Three full academic IELTS tests covering all four skills. Suitable for students targeting Band 6.5 and above.',
    type: 'academic',
    difficulty: 'intermediate',
    testCount: 3,
    status: 'published',
    createdAt: '2025-09-01',
    tests: [
      {
        id: 'mt-1',
        setId: 'set-1',
        orderIndex: 1,
        title: 'Test 1',
        durationMinutes: 165,
        sectionCount: 4,
        status: 'published',
        createdAt: '2025-09-01',
        sections: mt('mt-1').sections,
      },
      {
        id: 'mt-2',
        setId: 'set-1',
        orderIndex: 2,
        title: 'Test 2',
        durationMinutes: 165,
        sectionCount: 4,
        status: 'published',
        createdAt: '2025-10-05',
        sections: mt('mt-2').sections,
      },
      {
        id: 'mt-4',
        setId: 'set-1',
        orderIndex: 3,
        title: 'Test 3',
        durationMinutes: 165,
        sectionCount: 4,
        status: 'draft',
        createdAt: '2026-02-08',
        sections: mt('mt-4').sections,
      },
    ],
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
    tests: [
      {
        id: 'mt-3',
        setId: 'set-2',
        orderIndex: 1,
        title: 'Test 1',
        durationMinutes: 165,
        sectionCount: 4,
        status: 'published',
        createdAt: '2025-11-12',
        sections: mt('mt-3').sections,
      },
    ],
  },
]
