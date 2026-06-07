import type { ExamGuideSection } from '@/lib/types/content'

export const mockExamGuideSections: ExamGuideSection[] = [
  {
    id: 'eg-1',
    title: 'IELTS Overview & Format',
    skill: 'general',
    order: 1,
    status: 'published',
    updatedAt: '2025-08-15',
  },
  {
    id: 'eg-2',
    title: 'Listening Section Guide',
    skill: 'listening',
    order: 2,
    status: 'published',
    updatedAt: '2025-08-20',
  },
  {
    id: 'eg-3',
    title: 'Reading Section Guide',
    skill: 'reading',
    order: 3,
    status: 'published',
    updatedAt: '2025-08-20',
  },
  {
    id: 'eg-4',
    title: 'Writing Section Guide',
    skill: 'writing',
    order: 4,
    status: 'published',
    updatedAt: '2025-09-01',
  },
  {
    id: 'eg-5',
    title: 'Speaking Section Guide',
    skill: 'speaking',
    order: 5,
    status: 'published',
    updatedAt: '2025-09-01',
  },
]
