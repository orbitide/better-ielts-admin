export type IeltsStatus = 'published' | 'draft' | 'archived'

// ─── Flat list types (used by list pages) ────────────────────────────────────

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

// ─── Shared question option shapes ───────────────────────────────────────────

export type McqOption = { label: string; text: string }
export type MatchingOption = { key: string; text: string }

// ─── Reading nested types ─────────────────────────────────────────────────────

export type McqQuestion = {
  id: string
  type: 'mcq'
  questionNumber: number
  stem: string
  options: McqOption[]
  correctAnswer: string
}

export type TfngQuestion = {
  id: string
  type: 'tfng'
  questionNumber: number
  statement: string
  correctAnswer: 'TRUE' | 'FALSE' | 'NOT GIVEN'
}

export type MatchingQuestion = {
  id: string
  type: 'matching'
  questionNumber: number
  stem: string
  correctAnswer: string
  options: MatchingOption[]
}

export type FillBlankQuestion = {
  id: string
  type: 'fill-blank'
  questionNumber: number
  stem: string
  correctAnswer: string
  wordLimit?: number
}

export type ReadingQuestion = McqQuestion | TfngQuestion | MatchingQuestion | FillBlankQuestion

export type ReadingPassage = {
  id: string
  title: string
  body: string
  wordCount: number
}

export type ReadingSection = {
  id: string
  passageIndex: number
  passage: ReadingPassage
  questions: ReadingQuestion[]
}

export type FullReadingTest = ReadingTest & {
  sections: ReadingSection[]
}

// ─── Listening nested types ───────────────────────────────────────────────────

export type ListeningQuestionType = 'mcq' | 'fill-blank' | 'matching'

export type ListeningQuestion = {
  id: string
  type: ListeningQuestionType
  questionNumber: number
  stem: string
  options?: McqOption[] | MatchingOption[]
  correctAnswer: string
}

export type ListeningSection = {
  id: string
  sectionNumber: 1 | 2 | 3 | 4
  audioUrl: string
  audioDurationSeconds: number
  transcript: string
  questions: ListeningQuestion[]
}

export type FullListeningTest = ListeningTest & {
  sections: ListeningSection[]
}

// ─── Writing nested types ─────────────────────────────────────────────────────

export type FullWritingTask = WritingTask & {
  imageUrl?: string
  sampleAnswer: string
}

// ─── Speaking nested types ────────────────────────────────────────────────────

export type SpeakingPart = {
  part: 1 | 2 | 3
  topic: string
  questions: string[]
  cueCardPrompt?: string
  preparationSeconds?: number
  speakingMinutes: number
}

export type FullSpeakingSession = SpeakingSession & {
  parts: SpeakingPart[]
}

// ─── Set (full MockTest) types ────────────────────────────────────────────────

export type MockTestSection = {
  id: string
  skill: 'listening' | 'reading' | 'writing' | 'speaking'
  orderIndex: number
  durationMinutes: number
  testId: string
}

export type FullMockTest = MockTest & {
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  sections: MockTestSection[]
}
