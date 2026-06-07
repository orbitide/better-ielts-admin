import type { SpeakingSession } from '@/lib/types/ielts'

export const mockSpeakingSessions: SpeakingSession[] = [
  {
    id: 'ss-1',
    title: 'Speaking Session: Environment',
    topic: 'Environment & Climate Change',
    partCount: 3,
    status: 'published',
    createdAt: '2025-08-20',
  },
  {
    id: 'ss-2',
    title: 'Speaking Session: Technology',
    topic: 'Technology in Daily Life',
    partCount: 3,
    status: 'published',
    createdAt: '2025-09-15',
  },
  {
    id: 'ss-3',
    title: 'Speaking Session: Education',
    topic: 'Education & Learning',
    partCount: 3,
    status: 'published',
    createdAt: '2025-10-28',
  },
  {
    id: 'ss-4',
    title: 'Speaking Session: Health & Wellbeing',
    topic: 'Health, Diet & Lifestyle',
    partCount: 3,
    status: 'draft',
    createdAt: '2026-01-20',
  },
]
