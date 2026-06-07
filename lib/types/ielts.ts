export type IeltsStatus = 'published' | 'draft' | 'archived'

export type ReadingTest = {
  id: string
  title: string
  type: 'academic' | 'general'
  passageCount: number
  questionCount: number
  durationMinutes: number
  status: IeltsStatus
  createdAt: string
}

export type ListeningTest = {
  id: string
  title: string
  sectionCount: number
  questionCount: number
  durationMinutes: number
  audioUrl: string | null
  status: IeltsStatus
  createdAt: string
}

export type WritingTask = {
  id: string
  title: string
  type: 'task1' | 'task2'
  prompt: string
  wordMinimum: number
  timeMinutes: number
  status: IeltsStatus
  createdAt: string
}

export type SpeakingSession = {
  id: string
  title: string
  topic: string
  partCount: number
  status: IeltsStatus
  createdAt: string
}

export type MockTest = {
  id: string
  title: string
  type: 'academic' | 'general'
  durationMinutes: number
  sectionCount: number
  status: IeltsStatus
  createdAt: string
}

export type VocabTopic = {
  id: string
  slug: string
  title: string
  wordCount: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: IeltsStatus
  createdAt: string
}
