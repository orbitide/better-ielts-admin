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
  setName?: string
  testName?: string
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

export type VocabWordDefinition = {
  partOfSpeech: string
  meaning: string
  exampleSentence: string
}

export type VocabWord = {
  id: string
  word: string
  phonetic: string
  definitions: VocabWordDefinition[]
  synonyms: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isLearned: boolean
}

export type FullVocabTopic = VocabTopic & {
  description: string
  iconName: string
  words: VocabWord[]
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
  readingTestId: string
  passageIndex: number
  passage: ReadingPassage
  questionCount: number
}

export type ReadingTestDetail = {
  id: string
  title: string
  type: 'academic' | 'general'
  durationMinutes: number
  status: IeltsStatus
  createdAt: string
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
  layout?: ListeningLayout
}

export type FullListeningTest = ListeningTest & {
  sections: ListeningSection[]
}

// ─── Listening structured layout types (Beta, additive) ──────────────────────
// A section may have BOTH `questions` and `layout`; both are graded.
// `inputId` is globally unique across the test, conventionally `q${questionNumber}`.

export type TableCell =
  | { type: 'text'; value: string }
  | { type: 'input'; inputId: string; questionNumber: number; correctAnswer: string }

export type TableRow = {
  id: string
  cells: TableCell[]
}

export type TableNode = {
  type: 'table'
  id: string
  title?: string
  headers: string[]
  rows: TableRow[]
}

export type McqGroupQuestion = {
  id: string
  inputId: string
  questionNumber: number
  text: string
  options: McqOption[]
  correctAnswer: string
}

export type McqGroupNode = {
  type: 'mcq_group'
  id: string
  title?: string
  instructions?: string
  questions: McqGroupQuestion[]
}

export type GapFillBlock =
  | { type: 'text'; value: string }
  | { type: 'input'; inputId: string; questionNumber: number; correctAnswer: string }

export type GapFillNode = {
  type: 'gap_fill'
  id: string
  title?: string
  blocks: GapFillBlock[]
}

export type ImageLabelPoint = {
  label: string
  inputId: string
  questionNumber: number
  correctAnswer: string
  x: number // 0-100, % from left
  y: number // 0-100, % from top
}

export type ImageLabelNode = {
  type: 'image_label'
  id: string
  title?: string
  imageUrl: string
  points: ImageLabelPoint[]
}

export type ListeningLayoutNode = TableNode | McqGroupNode | GapFillNode | ImageLabelNode

export type ListeningLayout = {
  nodes: ListeningLayoutNode[]
}

// ─── Writing nested types ─────────────────────────────────────────────────────

export type FullWritingTask = WritingTask & {
  imageUrl?: string
  imageAlt?: string
  sampleAnswer?: string
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

// ─── Set → Test hierarchy types ───────────────────────────────────────────────

// A Set groups multiple complete Tests (e.g. "Cambridge IELTS 17")
export type IeltsSet = {
  id: string
  title: string
  description: string
  type: 'academic' | 'general'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  testCount: number
  status: IeltsStatus
  createdAt: string
}

// One complete IELTS test (4 skills) within a Set — e.g. "Test 1"
export type IeltsTest = {
  id: string
  setId: string
  orderIndex: number      // 1-based position within the Set
  title: string           // "Test 1", "Test 2"
  durationMinutes: number
  sectionCount: number
  status: IeltsStatus
  createdAt: string
}

export type FullIeltsTest = IeltsTest & {
  sections: MockTestSection[]
}

export type FullIeltsSet = IeltsSet & {
  tests: FullIeltsTest[]
}

// Optional context passed from Test → skill pages for breadcrumb enrichment
export type SetContext = {
  setId: string
  setTitle: string
  testId: string
  testIndex: number   // 1-based, e.g. 1 → "Test 1"
}
