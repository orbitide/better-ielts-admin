import axios from 'axios'
import type {
  ReadingTest, FullReadingTest, ReadingSection, ReadingQuestion,
  McqQuestion, TfngQuestion, MatchingQuestion, FillBlankQuestion,
  McqOption, MatchingOption,
  ListeningTest, FullListeningTest, ListeningQuestion,
  WritingTask, FullWritingTask,
  SpeakingSession, FullSpeakingSession,
  VocabTopic, FullVocabTopic, VocabWord, VocabWordDefinition,
  IeltsSet, FullIeltsSet, IeltsTest, FullIeltsTest, MockTestSection,
  IeltsStatus,
} from '@/lib/types/ielts'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/$/, '')

const api = axios.create({
  baseURL: `${API_URL}/api/admin/ielts`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers')
      const store = await cookies()
      const token = store.get('admin_access')?.value
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch { /* outside request context */ }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? 'Request failed'
    const error = new Error(message) as Error & { status?: number }
    error.status = err.response?.status
    return Promise.reject(error)
  }
)

type ApiResponse<T> = { data: T }
type PagedResult<T> = { items: T[]; totalCount: number; page: number; pageSize: number; totalPages: number }

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ─── Reading ──────────────────────────────────────────────────────────────────

type ApiReadingQuestion = {
  id: string; questionNumber: number; type: string; stem: string
  correctAnswer: string; options?: unknown
}

function mapReadingQuestion(q: ApiReadingQuestion): ReadingQuestion {
  if (q.type === 'mcq') {
    return { id: q.id, type: 'mcq', questionNumber: q.questionNumber, stem: q.stem, correctAnswer: q.correctAnswer, options: (q.options as McqOption[]) ?? [] } satisfies McqQuestion
  }
  if (q.type === 'tfng') {
    return { id: q.id, type: 'tfng', questionNumber: q.questionNumber, statement: q.stem, correctAnswer: q.correctAnswer as TfngQuestion['correctAnswer'] } satisfies TfngQuestion
  }
  if (q.type === 'matching') {
    return { id: q.id, type: 'matching', questionNumber: q.questionNumber, stem: q.stem, correctAnswer: q.correctAnswer, options: (q.options as MatchingOption[]) ?? [] } satisfies MatchingQuestion
  }
  return { id: q.id, type: 'fill-blank', questionNumber: q.questionNumber, stem: q.stem, correctAnswer: q.correctAnswer } satisfies FillBlankQuestion
}

function mapReadingQuestionToRequest(q: ReadingQuestion) {
  const stem = q.type === 'tfng' ? (q as TfngQuestion).statement : (q as McqQuestion | MatchingQuestion | FillBlankQuestion).stem
  const options = (q.type === 'mcq' || q.type === 'matching') ? (q as McqQuestion | MatchingQuestion).options : undefined
  return { questionNumber: q.questionNumber, type: q.type, stem, correctAnswer: q.correctAnswer, optionsJson: options ? JSON.stringify(options) : undefined }
}

type ApiReadingSection = { id: string; passageIndex: number; passage: { id: string; title: string; body: string; wordCount: number }; questions: ApiReadingQuestion[] }
type ApiFullReadingTest = { id: string; title: string; type: string; durationMinutes: number; status: string; createdAt: string; sections: ApiReadingSection[] }
type ApiReadingTestSummary = { id: string; title: string; type: string; passageCount: number; questionCount: number; durationMinutes: number; status: string; createdAt: string }

function mapReadingTestSummary(r: ApiReadingTestSummary): ReadingTest {
  return { id: r.id, title: r.title, type: r.type as ReadingTest['type'], passageCount: r.passageCount, questionCount: r.questionCount, durationMinutes: r.durationMinutes, status: r.status as IeltsStatus, createdAt: r.createdAt }
}

function mapFullReadingTest(r: ApiFullReadingTest): FullReadingTest {
  const summary: ReadingTest = { id: r.id, title: r.title, type: r.type as ReadingTest['type'], passageCount: r.sections.length, questionCount: r.sections.reduce((n, s) => n + s.questions.length, 0), durationMinutes: r.durationMinutes, status: r.status as IeltsStatus, createdAt: r.createdAt }
  const sections: ReadingSection[] = r.sections.map(s => ({ id: s.id, passageIndex: s.passageIndex, passage: s.passage, questions: s.questions.map(mapReadingQuestion) }))
  return { ...summary, sections }
}

function mapReadingTestToUpdateRequest(test: FullReadingTest) {
  return {
    title: test.title, type: test.type, durationMinutes: test.durationMinutes, status: test.status,
    sections: test.sections.map(s => ({ passageIndex: s.passageIndex, passage: { title: s.passage.title, body: s.passage.body, wordCount: s.passage.wordCount }, questions: s.questions.map(mapReadingQuestionToRequest) }))
  }
}

export type ReadingTestsPage = { items: ReadingTest[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchReadingTests(page = 1, pageSize = 20, status?: string): Promise<ReadingTestsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (status) params.set('status', status)
  const { data } = await api.get<ApiResponse<PagedResult<ApiReadingTestSummary>>>(`/reading?${params}`)
  const r = data.data
  return { items: r.items.map(mapReadingTestSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchReadingTestById(id: string): Promise<FullReadingTest> {
  const { data } = await api.get<ApiResponse<ApiFullReadingTest>>(`/reading/${id}`)
  return mapFullReadingTest(data.data)
}

export async function createReadingTest(payload: { title: string; type?: string; durationMinutes?: number }): Promise<ReadingTest> {
  const { data } = await api.post<ApiResponse<ApiReadingTestSummary>>('/reading', { title: payload.title, type: payload.type ?? 'academic', durationMinutes: payload.durationMinutes ?? 60, sections: [] })
  return mapReadingTestSummary(data.data)
}

export async function updateReadingTest(id: string, test: FullReadingTest): Promise<FullReadingTest> {
  const { data } = await api.put<ApiResponse<ApiFullReadingTest>>(`/reading/${id}`, mapReadingTestToUpdateRequest(test))
  return mapFullReadingTest(data.data)
}

export async function deleteReadingTest(id: string): Promise<void> {
  await api.delete(`/reading/${id}`)
}

// ─── Listening ────────────────────────────────────────────────────────────────

type ApiListeningQuestion = { id: string; questionNumber: number; type: string; stem: string; correctAnswer: string; options?: unknown }
type ApiListeningSection = { id: string; sectionNumber: number; audioUrl: string; audioDurationSeconds: number; transcript: string; questions: ApiListeningQuestion[] }
type ApiListeningTestSummary = { id: string; title: string; sectionCount: number; questionCount: number; durationMinutes: number; status: string; createdAt: string }
type ApiFullListeningTest = { id: string; title: string; durationMinutes: number; status: string; createdAt: string; sections: ApiListeningSection[] }

function mapListeningQuestion(q: ApiListeningQuestion): ListeningQuestion {
  return { id: q.id, type: q.type as ListeningQuestion['type'], questionNumber: q.questionNumber, stem: q.stem, correctAnswer: q.correctAnswer, options: q.options as ListeningQuestion['options'] }
}

function mapListeningTestSummary(r: ApiListeningTestSummary): ListeningTest {
  return { id: r.id, title: r.title, sectionCount: r.sectionCount, questionCount: r.questionCount, durationMinutes: r.durationMinutes, audioUrl: null, status: r.status as IeltsStatus, createdAt: r.createdAt }
}

function mapFullListeningTest(r: ApiFullListeningTest): FullListeningTest {
  const summary: ListeningTest = { id: r.id, title: r.title, sectionCount: r.sections.length, questionCount: r.sections.reduce((n, s) => n + s.questions.length, 0), durationMinutes: r.durationMinutes, audioUrl: null, status: r.status as IeltsStatus, createdAt: r.createdAt }
  return { ...summary, sections: r.sections.map(s => ({ id: s.id, sectionNumber: s.sectionNumber as 1|2|3|4, audioUrl: s.audioUrl, audioDurationSeconds: s.audioDurationSeconds, transcript: s.transcript, questions: s.questions.map(mapListeningQuestion) })) }
}

function mapListeningTestToUpdateRequest(test: FullListeningTest) {
  return {
    title: test.title, durationMinutes: test.durationMinutes, status: test.status,
    sections: test.sections.map(s => ({ sectionNumber: s.sectionNumber, audioUrl: s.audioUrl, audioDurationSeconds: s.audioDurationSeconds, transcript: s.transcript, questions: s.questions.map(q => ({ questionNumber: q.questionNumber, type: q.type, stem: q.stem, correctAnswer: q.correctAnswer, optionsJson: q.options ? JSON.stringify(q.options) : undefined })) }))
  }
}

export type ListeningTestsPage = { items: ListeningTest[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchListeningTests(page = 1, pageSize = 20, status?: string): Promise<ListeningTestsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (status) params.set('status', status)
  const { data } = await api.get<ApiResponse<PagedResult<ApiListeningTestSummary>>>(`/listening?${params}`)
  const r = data.data
  return { items: r.items.map(mapListeningTestSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchListeningTestById(id: string): Promise<FullListeningTest> {
  const { data } = await api.get<ApiResponse<ApiFullListeningTest>>(`/listening/${id}`)
  return mapFullListeningTest(data.data)
}

export async function createListeningTest(payload: { title: string; durationMinutes?: number }): Promise<ListeningTest> {
  const { data } = await api.post<ApiResponse<ApiListeningTestSummary>>('/listening', { title: payload.title, durationMinutes: payload.durationMinutes ?? 40, sections: [] })
  return mapListeningTestSummary(data.data)
}

export async function updateListeningTest(id: string, test: FullListeningTest): Promise<FullListeningTest> {
  const { data } = await api.put<ApiResponse<ApiFullListeningTest>>(`/listening/${id}`, mapListeningTestToUpdateRequest(test))
  return mapFullListeningTest(data.data)
}

export async function deleteListeningTest(id: string): Promise<void> {
  await api.delete(`/listening/${id}`)
}

// ─── Writing ──────────────────────────────────────────────────────────────────

type ApiWritingTaskSummary = { id: string; title: string; type: string; wordMinimum: number; timeMinutes: number; status: string; createdAt: string }
type ApiWritingTaskDetail = ApiWritingTaskSummary & { prompt: string; imageUrl?: string; imageAlt?: string; sampleAnswer?: string }

function mapWritingTaskSummary(r: ApiWritingTaskSummary): WritingTask {
  return { id: r.id, title: r.title, type: r.type as WritingTask['type'], prompt: '', wordMinimum: r.wordMinimum, timeMinutes: r.timeMinutes, status: r.status as IeltsStatus, createdAt: r.createdAt }
}

function mapFullWritingTask(r: ApiWritingTaskDetail): FullWritingTask {
  return { id: r.id, title: r.title, type: r.type as WritingTask['type'], prompt: r.prompt, wordMinimum: r.wordMinimum, timeMinutes: r.timeMinutes, status: r.status as IeltsStatus, createdAt: r.createdAt, imageUrl: r.imageUrl, imageAlt: r.imageAlt, sampleAnswer: r.sampleAnswer }
}

export type WritingTasksPage = { items: WritingTask[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchWritingTasks(page = 1, pageSize = 20, status?: string): Promise<WritingTasksPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (status) params.set('status', status)
  const { data } = await api.get<ApiResponse<PagedResult<ApiWritingTaskSummary>>>(`/writing?${params}`)
  const r = data.data
  return { items: r.items.map(mapWritingTaskSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchWritingTaskById(id: string): Promise<FullWritingTask> {
  const { data } = await api.get<ApiResponse<ApiWritingTaskDetail>>(`/writing/${id}`)
  return mapFullWritingTask(data.data)
}

export async function createWritingTask(payload: { title: string; type?: string }): Promise<WritingTask> {
  const { data } = await api.post<ApiResponse<ApiWritingTaskSummary>>('/writing', { title: payload.title, type: payload.type ?? 'task1', prompt: '', wordMinimum: 150, timeMinutes: 20 })
  return mapWritingTaskSummary(data.data)
}

export async function updateWritingTask(id: string, task: FullWritingTask): Promise<FullWritingTask> {
  const { data } = await api.put<ApiResponse<ApiWritingTaskDetail>>(`/writing/${id}`, { title: task.title, type: task.type, prompt: task.prompt, wordMinimum: task.wordMinimum, timeMinutes: task.timeMinutes, status: task.status, imageUrl: task.imageUrl, imageAlt: task.imageAlt, sampleAnswer: task.sampleAnswer })
  return mapFullWritingTask(data.data)
}

export async function deleteWritingTask(id: string): Promise<void> {
  await api.delete(`/writing/${id}`)
}

// ─── Speaking ─────────────────────────────────────────────────────────────────

type ApiSpeakingPart = { id: string; partNumber: number; topic: string; questions: string[]; cueCardPrompt?: string; preparationSeconds?: number; speakingMinutes: number }
type ApiSpeakingSessionSummary = { id: string; title: string; topic: string; partCount: number; status: string; createdAt: string }
type ApiFullSpeakingSession = { id: string; title: string; topic: string; status: string; createdAt: string; parts: ApiSpeakingPart[] }

function mapSpeakingSessionSummary(r: ApiSpeakingSessionSummary): SpeakingSession {
  return { id: r.id, title: r.title, topic: r.topic, partCount: r.partCount, status: r.status as IeltsStatus, createdAt: r.createdAt }
}

function mapFullSpeakingSession(r: ApiFullSpeakingSession): FullSpeakingSession {
  return { id: r.id, title: r.title, topic: r.topic, partCount: r.parts.length, status: r.status as IeltsStatus, createdAt: r.createdAt, parts: r.parts.map(p => ({ part: p.partNumber as 1|2|3, topic: p.topic, questions: p.questions, cueCardPrompt: p.cueCardPrompt, preparationSeconds: p.preparationSeconds, speakingMinutes: p.speakingMinutes })) }
}

export type SpeakingSessionsPage = { items: SpeakingSession[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchSpeakingSessions(page = 1, pageSize = 20, status?: string): Promise<SpeakingSessionsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (status) params.set('status', status)
  const { data } = await api.get<ApiResponse<PagedResult<ApiSpeakingSessionSummary>>>(`/speaking?${params}`)
  const r = data.data
  return { items: r.items.map(mapSpeakingSessionSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchSpeakingSessionById(id: string): Promise<FullSpeakingSession> {
  const { data } = await api.get<ApiResponse<ApiFullSpeakingSession>>(`/speaking/${id}`)
  return mapFullSpeakingSession(data.data)
}

export async function createSpeakingSession(payload: { title: string }): Promise<SpeakingSession> {
  const { data } = await api.post<ApiResponse<ApiSpeakingSessionSummary>>('/speaking', { title: payload.title, topic: '', parts: [] })
  return mapSpeakingSessionSummary(data.data)
}

export async function updateSpeakingSession(id: string, session: FullSpeakingSession): Promise<FullSpeakingSession> {
  const { data } = await api.put<ApiResponse<ApiFullSpeakingSession>>(`/speaking/${id}`, { title: session.title, topic: session.topic, status: session.status, parts: session.parts.map(p => ({ partNumber: p.part, topic: p.topic, questions: p.questions, cueCardPrompt: p.cueCardPrompt, preparationSeconds: p.preparationSeconds, speakingMinutes: p.speakingMinutes })) })
  return mapFullSpeakingSession(data.data)
}

export async function deleteSpeakingSession(id: string): Promise<void> {
  await api.delete(`/speaking/${id}`)
}

// ─── Vocabulary ───────────────────────────────────────────────────────────────

type ApiVocabWord = { id: string; word: string; phonetic: string; definitions: VocabWordDefinition[]; synonyms: string[]; difficulty: string }
type ApiVocabTopicSummary = { id: string; title: string; slug: string; description: string; wordCount: number; iconName: string; difficulty: string; status: string; createdAt: string }
type ApiVocabTopicDetail = ApiVocabTopicSummary & { words: ApiVocabWord[] }

function mapVocabTopicSummary(r: ApiVocabTopicSummary): VocabTopic {
  return { id: r.id, slug: r.slug, title: r.title, wordCount: r.wordCount, difficulty: r.difficulty as VocabTopic['difficulty'], status: r.status as IeltsStatus, createdAt: r.createdAt }
}

function mapFullVocabTopic(r: ApiVocabTopicDetail): FullVocabTopic {
  const summary = mapVocabTopicSummary(r)
  return { ...summary, description: r.description, iconName: r.iconName, words: r.words.map(w => ({ id: w.id, word: w.word, phonetic: w.phonetic, definitions: w.definitions, synonyms: w.synonyms, difficulty: w.difficulty as VocabWord['difficulty'], isLearned: false })) }
}

function mapVocabWordToRequest(w: VocabWord) {
  return { word: w.word, phonetic: w.phonetic, definitionsJson: JSON.stringify(w.definitions), synonymsJson: JSON.stringify(w.synonyms), difficulty: w.difficulty }
}

export type VocabTopicsPage = { items: VocabTopic[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchVocabTopics(page = 1, pageSize = 20, difficulty?: string, status?: string): Promise<VocabTopicsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (difficulty) params.set('difficulty', difficulty)
  if (status) params.set('status', status)
  const { data } = await api.get<ApiResponse<PagedResult<ApiVocabTopicSummary>>>(`/vocabulary?${params}`)
  const r = data.data
  return { items: r.items.map(mapVocabTopicSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchVocabTopicById(id: string): Promise<FullVocabTopic> {
  const { data } = await api.get<ApiResponse<ApiVocabTopicDetail>>(`/vocabulary/${id}`)
  return mapFullVocabTopic(data.data)
}

export async function createVocabTopic(payload: { title: string; difficulty?: string }): Promise<VocabTopic> {
  const { data } = await api.post<ApiResponse<ApiVocabTopicSummary>>('/vocabulary', { title: payload.title, slug: slugify(payload.title), description: '', iconName: 'book', difficulty: payload.difficulty ?? 'beginner', words: [] })
  return mapVocabTopicSummary(data.data)
}

export async function updateVocabTopic(id: string, topic: FullVocabTopic): Promise<FullVocabTopic> {
  const { data } = await api.put<ApiResponse<ApiVocabTopicDetail>>(`/vocabulary/${id}`, { title: topic.title, slug: topic.slug, description: topic.description, iconName: topic.iconName, difficulty: topic.difficulty, status: topic.status, words: topic.words.map(mapVocabWordToRequest) })
  return mapFullVocabTopic(data.data)
}

export async function deleteVocabTopic(id: string): Promise<void> {
  await api.delete(`/vocabulary/${id}`)
}

// ─── Sets (Mock Tests) ────────────────────────────────────────────────────────

type ApiMockTestSection = { id: string; skill: string; orderIndex: number; durationMinutes: number; skillContentId?: string }
type ApiMockTestInSet = { id: string; orderIndex: number; title: string; durationMinutes: number; status: string; sections: ApiMockTestSection[] }
type ApiIeltsSetSummary = { id: string; title: string; description: string; type: string; difficulty: string; testCount: number; status: string; createdAt: string }
type ApiIeltsSetDetail = Omit<ApiIeltsSetSummary, 'testCount'> & { tests: ApiMockTestInSet[] }

function mapIeltsSetSummary(r: ApiIeltsSetSummary): IeltsSet {
  return { id: r.id, title: r.title, description: r.description, type: r.type as IeltsSet['type'], difficulty: r.difficulty as IeltsSet['difficulty'], testCount: r.testCount, status: r.status as IeltsStatus, createdAt: r.createdAt }
}

function mapFullIeltsSet(r: ApiIeltsSetDetail): FullIeltsSet {
  const setBase: IeltsSet = { id: r.id, title: r.title, description: r.description, type: r.type as IeltsSet['type'], difficulty: r.difficulty as IeltsSet['difficulty'], testCount: r.tests.length, status: r.status as IeltsStatus, createdAt: r.createdAt }
  const tests: FullIeltsTest[] = r.tests.map(t => {
    const testBase: IeltsTest = { id: t.id, setId: r.id, orderIndex: t.orderIndex, title: t.title, durationMinutes: t.durationMinutes, sectionCount: t.sections.length, status: t.status as IeltsStatus, createdAt: '' }
    const sections: MockTestSection[] = t.sections.map(s => ({ id: s.id, skill: s.skill as MockTestSection['skill'], orderIndex: s.orderIndex, durationMinutes: s.durationMinutes, testId: s.skillContentId ?? '' }))
    return { ...testBase, sections }
  })
  return { ...setBase, tests }
}

function mapMockTestInSet(t: ApiMockTestInSet, setId: string): FullIeltsTest {
  const base: IeltsTest = { id: t.id, setId, orderIndex: t.orderIndex, title: t.title, durationMinutes: t.durationMinutes, sectionCount: t.sections.length, status: t.status as IeltsStatus, createdAt: '' }
  const sections: MockTestSection[] = t.sections.map(s => ({ id: s.id, skill: s.skill as MockTestSection['skill'], orderIndex: s.orderIndex, durationMinutes: s.durationMinutes, testId: t.id }))
  return { ...base, sections }
}

export type IeltsSetsPage = { items: IeltsSet[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchIeltsSets(page = 1, pageSize = 20, status?: string): Promise<IeltsSetsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (status) params.set('status', status)
  const { data } = await api.get<ApiResponse<PagedResult<ApiIeltsSetSummary>>>(`/sets?${params}`)
  const r = data.data
  return { items: r.items.map(mapIeltsSetSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchIeltsSetById(id: string): Promise<FullIeltsSet> {
  const { data } = await api.get<ApiResponse<ApiIeltsSetDetail>>(`/sets/${id}`)
  return mapFullIeltsSet(data.data)
}

export async function createIeltsSet(payload: { title: string; type?: string }): Promise<IeltsSet> {
  const { data } = await api.post<ApiResponse<ApiIeltsSetSummary>>('/sets', { title: payload.title, description: '', type: payload.type ?? 'academic', difficulty: 'intermediate' })
  return mapIeltsSetSummary(data.data)
}

export async function updateIeltsSet(id: string, set: FullIeltsSet): Promise<FullIeltsSet> {
  const { data } = await api.put<ApiResponse<ApiIeltsSetDetail>>(`/sets/${id}`, { title: set.title, description: set.description, type: set.type, difficulty: set.difficulty, status: set.status })
  return mapFullIeltsSet(data.data)
}

export async function deleteIeltsSet(id: string): Promise<void> {
  await api.delete(`/sets/${id}`)
}

export async function addTestToSet(setId: string, payload: { title: string; orderIndex?: number; durationMinutes?: number; sections?: { skill: string; orderIndex: number; durationMinutes: number }[] }): Promise<FullIeltsTest> {
  const { data } = await api.post<ApiResponse<ApiMockTestInSet>>(`/sets/${setId}/tests`, { title: payload.title, orderIndex: payload.orderIndex ?? 1, durationMinutes: payload.durationMinutes ?? 170, sections: payload.sections ?? [] })
  return mapMockTestInSet(data.data, setId)
}

export async function updateTestInSet(testId: string, setId: string, test: FullIeltsTest): Promise<FullIeltsTest> {
  const { data } = await api.put<ApiResponse<ApiMockTestInSet>>(`/sets/tests/${testId}`, { orderIndex: test.orderIndex, title: test.title, durationMinutes: test.durationMinutes, status: test.status, sections: test.sections.map(s => ({ skill: s.skill, orderIndex: s.orderIndex, durationMinutes: s.durationMinutes, skillContentId: s.testId || null })) })
  return mapMockTestInSet(data.data, setId)
}

export async function deleteTestFromSet(testId: string): Promise<void> {
  await api.delete(`/sets/tests/${testId}`)
}
