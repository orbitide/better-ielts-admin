import httpClient from '@/lib/api/http'
import type {
  ReadingTest, ReadingTestDetail, ReadingSection, ReadingQuestion,
  McqQuestion, TfngQuestion, MatchingQuestion, FillBlankQuestion,
  McqOption, MatchingOption,
  ListeningTest, FullListeningTest, ListeningSection, ListeningQuestion,
  WritingTask, FullWritingTask,
  SpeakingSession, FullSpeakingSession,
  VocabTopic, FullVocabTopic, VocabWord, VocabWordDefinition,
  IeltsSet, IeltsSetDetail, FullIeltsSet, IeltsTest, FullIeltsTest, MockTestSection,
  IeltsStatus,
} from '@/lib/types/ielts'

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

type ApiReadingTestDetail = { id: string; title: string; type: string; durationMinutes: number; status: string; createdAt: string; setId?: string; setName?: string; testId?: string; testName?: string }
type ApiReadingPassage = { id: string; title: string; body: string; wordCount: number }
type ApiReadingSectionDto = { id: string; readingTestId: string; passageIndex: number; passage: ApiReadingPassage; questionCount: number }
type ApiReadingTestSummary = { id: string; title: string; type: string; passageCount: number; questionCount: number; durationMinutes: number; status: string; createdAt: string; setName?: string; testName?: string }

function mapReadingTestSummary(r: ApiReadingTestSummary): ReadingTest {
  return { id: r.id, title: r.title, type: r.type as ReadingTest['type'], passageCount: r.passageCount, questionCount: r.questionCount, durationMinutes: r.durationMinutes, status: r.status as IeltsStatus, createdAt: r.createdAt, setName: r.setName, testName: r.testName }
}

function mapReadingTestDetail(r: ApiReadingTestDetail): ReadingTestDetail {
  return { id: r.id, title: r.title, type: r.type as ReadingTestDetail['type'], durationMinutes: r.durationMinutes, status: r.status as IeltsStatus, createdAt: r.createdAt, setId: r.setId, setName: r.setName, testId: r.testId, testName: r.testName }
}

function mapReadingSection(s: ApiReadingSectionDto): ReadingSection {
  return { id: s.id, readingTestId: s.readingTestId, passageIndex: s.passageIndex, passage: s.passage, questionCount: s.questionCount }
}

export type ReadingTestsPage = { items: ReadingTest[]; totalCount: number; totalPages: number; page: number; pageSize: number }
export type ReadingSectionsPage = { items: ReadingSection[]; totalCount: number; totalPages: number; page: number; pageSize: number }
export type ReadingQuestionsPage = { items: ReadingQuestion[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchReadingTests(page = 1, pageSize = 20, status?: string, setId?: string, testId?: string): Promise<ReadingTestsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (status) params.set('status', status)
  if (setId) params.set('setId', setId)
  if (testId) params.set('testId', testId)
  const { data } = await httpClient.get<ApiResponse<PagedResult<ApiReadingTestSummary>>>(`/api/admin/ielts/reading?${params}`)
  const r = data.data
  return { items: r.items.map(mapReadingTestSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchReadingTestById(id: string): Promise<ReadingTestDetail> {
  const { data } = await httpClient.get<ApiResponse<ApiReadingTestDetail>>(`/api/admin/ielts/reading/${id}`)
  return mapReadingTestDetail(data.data)
}

export async function createReadingTest(payload: { title: string; type?: string; durationMinutes?: number }): Promise<ReadingTestDetail> {
  const { data } = await httpClient.post<ApiResponse<ApiReadingTestDetail>>('/api/admin/ielts/reading', { title: payload.title, type: payload.type ?? 'academic', durationMinutes: payload.durationMinutes ?? 60 })
  return mapReadingTestDetail(data.data)
}

export async function updateReadingTest(id: string, payload: { title: string; type: string; durationMinutes: number; status: IeltsStatus }): Promise<ReadingTestDetail> {
  const { data } = await httpClient.put<ApiResponse<ApiReadingTestDetail>>(`/api/admin/ielts/reading/${id}`, payload)
  return mapReadingTestDetail(data.data)
}

export async function deleteReadingTest(id: string): Promise<void> {
  await httpClient.delete(`/api/admin/ielts/reading/${id}`)
}

export async function fetchReadingSections(testId: string, page = 1, pageSize = 10): Promise<ReadingSectionsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  const { data } = await httpClient.get<ApiResponse<PagedResult<ApiReadingSectionDto>>>(`/api/admin/ielts/reading/${testId}/sections?${params}`)
  const r = data.data
  return { items: r.items.map(mapReadingSection), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchReadingSectionById(sectionId: string): Promise<ReadingSection> {
  const { data } = await httpClient.get<ApiResponse<ApiReadingSectionDto>>(`/api/admin/ielts/reading/sections/${sectionId}`)
  return mapReadingSection(data.data)
}

export async function createReadingSection(testId: string, payload: { passageIndex: number; passage: { title: string; body: string; wordCount: number } }): Promise<ReadingSection> {
  const { data } = await httpClient.post<ApiResponse<ApiReadingSectionDto>>(`/api/admin/ielts/reading/${testId}/sections`, payload)
  return mapReadingSection(data.data)
}

export async function updateReadingSection(sectionId: string, payload: { passageIndex: number; passage: { title: string; body: string; wordCount: number } }): Promise<ReadingSection> {
  const { data } = await httpClient.put<ApiResponse<ApiReadingSectionDto>>(`/api/admin/ielts/reading/sections/${sectionId}`, payload)
  return mapReadingSection(data.data)
}

export async function deleteReadingSection(sectionId: string): Promise<void> {
  await httpClient.delete(`/api/admin/ielts/reading/sections/${sectionId}`)
}

export async function fetchReadingQuestions(sectionId: string, page = 1, pageSize = 20): Promise<ReadingQuestionsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  const { data } = await httpClient.get<ApiResponse<PagedResult<ApiReadingQuestion>>>(`/api/admin/ielts/reading/sections/${sectionId}/questions?${params}`)
  const r = data.data
  return { items: r.items.map(mapReadingQuestion), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function createReadingQuestion(sectionId: string, question: ReadingQuestion): Promise<ReadingQuestion> {
  const { data } = await httpClient.post<ApiResponse<ApiReadingQuestion>>(`/api/admin/ielts/reading/sections/${sectionId}/questions`, mapReadingQuestionToRequest(question))
  return mapReadingQuestion(data.data)
}

export async function updateReadingQuestion(questionId: string, question: ReadingQuestion): Promise<ReadingQuestion> {
  const { data } = await httpClient.put<ApiResponse<ApiReadingQuestion>>(`/api/admin/ielts/reading/questions/${questionId}`, mapReadingQuestionToRequest(question))
  return mapReadingQuestion(data.data)
}

export async function deleteReadingQuestion(questionId: string): Promise<void> {
  await httpClient.delete(`/api/admin/ielts/reading/questions/${questionId}`)
}

// ─── Listening ────────────────────────────────────────────────────────────────

type ApiListeningQuestion = { id: string; questionNumber: number; type: string; stem: string; correctAnswer: string; options?: unknown }
type ApiListeningSection = { id: string; sectionNumber: number; audioUrl: string; audioDurationSeconds: number; transcript: string; questions: ApiListeningQuestion[]; layout?: unknown }
type ApiListeningTestSummary = { id: string; title: string; sectionCount: number; questionCount: number; durationMinutes: number; status: string; createdAt: string; setName?: string; testName?: string }
type ApiFullListeningTest = { id: string; title: string; durationMinutes: number; status: string; createdAt: string; sections: ApiListeningSection[] }

function mapListeningQuestion(q: ApiListeningQuestion): ListeningQuestion {
  return { id: q.id, type: q.type as ListeningQuestion['type'], questionNumber: q.questionNumber, stem: q.stem, correctAnswer: q.correctAnswer, options: q.options as ListeningQuestion['options'] }
}

function mapListeningTestSummary(r: ApiListeningTestSummary): ListeningTest {
  return { id: r.id, title: r.title, sectionCount: r.sectionCount, questionCount: r.questionCount, durationMinutes: r.durationMinutes, audioUrl: null, status: r.status as IeltsStatus, createdAt: r.createdAt, setName: r.setName, testName: r.testName }
}

function mapFullListeningTest(r: ApiFullListeningTest): FullListeningTest {
  const summary: ListeningTest = { id: r.id, title: r.title, sectionCount: r.sections.length, questionCount: r.sections.reduce((n, s) => n + s.questions.length, 0), durationMinutes: r.durationMinutes, audioUrl: null, status: r.status as IeltsStatus, createdAt: r.createdAt }
  return { ...summary, sections: r.sections.map(s => ({ id: s.id, sectionNumber: s.sectionNumber as 1|2|3|4, audioUrl: s.audioUrl, audioDurationSeconds: s.audioDurationSeconds, transcript: s.transcript, questions: s.questions.map(mapListeningQuestion), layout: s.layout as ListeningSection['layout'] })) }
}

function mapListeningTestToUpdateRequest(test: FullListeningTest) {
  return {
    title: test.title, durationMinutes: test.durationMinutes, status: test.status,
    sections: test.sections.map(s => ({ sectionNumber: s.sectionNumber, audioUrl: s.audioUrl, audioDurationSeconds: s.audioDurationSeconds, transcript: s.transcript, questions: s.questions.map(q => ({ questionNumber: q.questionNumber, type: q.type, stem: q.stem, correctAnswer: q.correctAnswer, optionsJson: q.options ? JSON.stringify(q.options) : undefined })), layoutJson: s.layout ? JSON.stringify(s.layout) : undefined }))
  }
}

export type ListeningTestsPage = { items: ListeningTest[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchListeningTests(page = 1, pageSize = 20, status?: string, setId?: string, testId?: string): Promise<ListeningTestsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (status) params.set('status', status)
  if (setId) params.set('setId', setId)
  if (testId) params.set('testId', testId)
  const { data } = await httpClient.get<ApiResponse<PagedResult<ApiListeningTestSummary>>>(`/api/admin/ielts/listening?${params}`)
  const r = data.data
  return { items: r.items.map(mapListeningTestSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchListeningTestById(id: string): Promise<FullListeningTest> {
  const { data } = await httpClient.get<ApiResponse<ApiFullListeningTest>>(`/api/admin/ielts/listening/${id}`)
  return mapFullListeningTest(data.data)
}

export async function createListeningTest(payload: { title: string; durationMinutes?: number }): Promise<ListeningTest> {
  const { data } = await httpClient.post<ApiResponse<ApiListeningTestSummary>>('/api/admin/ielts/listening', { title: payload.title, durationMinutes: payload.durationMinutes ?? 40, sections: [] })
  return mapListeningTestSummary(data.data)
}

export async function updateListeningTest(id: string, test: FullListeningTest): Promise<FullListeningTest> {
  const { data } = await httpClient.put<ApiResponse<ApiFullListeningTest>>(`/api/admin/ielts/listening/${id}`, mapListeningTestToUpdateRequest(test))
  return mapFullListeningTest(data.data)
}

export async function deleteListeningTest(id: string): Promise<void> {
  await httpClient.delete(`/api/admin/ielts/listening/${id}`)
}

// ─── Writing ──────────────────────────────────────────────────────────────────

type ApiWritingTaskSummary = { id: string; title: string; type: string; wordMinimum: number; timeMinutes: number; status: string; createdAt: string; setName?: string; testName?: string }
type ApiWritingTaskDetail = ApiWritingTaskSummary & { prompt: string; imageUrl?: string; imageAlt?: string; sampleAnswer?: string }

function mapWritingTaskSummary(r: ApiWritingTaskSummary): WritingTask {
  return { id: r.id, title: r.title, type: r.type as WritingTask['type'], prompt: '', wordMinimum: r.wordMinimum, timeMinutes: r.timeMinutes, status: r.status as IeltsStatus, createdAt: r.createdAt, setName: r.setName, testName: r.testName }
}

function mapFullWritingTask(r: ApiWritingTaskDetail): FullWritingTask {
  return { id: r.id, title: r.title, type: r.type as WritingTask['type'], prompt: r.prompt, wordMinimum: r.wordMinimum, timeMinutes: r.timeMinutes, status: r.status as IeltsStatus, createdAt: r.createdAt, imageUrl: r.imageUrl, imageAlt: r.imageAlt, sampleAnswer: r.sampleAnswer }
}

export type WritingTasksPage = { items: WritingTask[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchWritingTasks(page = 1, pageSize = 20, status?: string, setId?: string, testId?: string): Promise<WritingTasksPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (status) params.set('status', status)
  if (setId) params.set('setId', setId)
  if (testId) params.set('testId', testId)
  const { data } = await httpClient.get<ApiResponse<PagedResult<ApiWritingTaskSummary>>>(`/api/admin/ielts/writing?${params}`)
  const r = data.data
  return { items: r.items.map(mapWritingTaskSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchWritingTaskById(id: string): Promise<FullWritingTask> {
  const { data } = await httpClient.get<ApiResponse<ApiWritingTaskDetail>>(`/api/admin/ielts/writing/${id}`)
  return mapFullWritingTask(data.data)
}

export async function createWritingTask(payload: { title: string; type?: string }): Promise<WritingTask> {
  const { data } = await httpClient.post<ApiResponse<ApiWritingTaskSummary>>('/api/admin/ielts/writing', { title: payload.title, type: payload.type ?? 'task1', prompt: '', wordMinimum: 150, timeMinutes: 20 })
  return mapWritingTaskSummary(data.data)
}

export async function updateWritingTask(id: string, task: FullWritingTask): Promise<FullWritingTask> {
  const { data } = await httpClient.put<ApiResponse<ApiWritingTaskDetail>>(`/api/admin/ielts/writing/${id}`, { title: task.title, type: task.type, prompt: task.prompt, wordMinimum: task.wordMinimum, timeMinutes: task.timeMinutes, status: task.status, imageUrl: task.imageUrl, imageAlt: task.imageAlt, sampleAnswer: task.sampleAnswer })
  return mapFullWritingTask(data.data)
}

export async function deleteWritingTask(id: string): Promise<void> {
  await httpClient.delete(`/api/admin/ielts/writing/${id}`)
}

// ─── Speaking ─────────────────────────────────────────────────────────────────

type ApiSpeakingPart = { id: string; partNumber: number; topic: string; questions: string[]; cueCardPrompt?: string; preparationSeconds?: number; speakingMinutes: number }
type ApiSpeakingSessionSummary = { id: string; title: string; topic: string; partCount: number; status: string; createdAt: string; setName?: string; testName?: string }
type ApiFullSpeakingSession = { id: string; title: string; topic: string; status: string; createdAt: string; parts: ApiSpeakingPart[] }

function mapSpeakingSessionSummary(r: ApiSpeakingSessionSummary): SpeakingSession {
  return { id: r.id, title: r.title, topic: r.topic, partCount: r.partCount, status: r.status as IeltsStatus, createdAt: r.createdAt, setName: r.setName, testName: r.testName }
}

function mapFullSpeakingSession(r: ApiFullSpeakingSession): FullSpeakingSession {
  return { id: r.id, title: r.title, topic: r.topic, partCount: r.parts.length, status: r.status as IeltsStatus, createdAt: r.createdAt, parts: r.parts.map(p => ({ part: p.partNumber as 1|2|3, topic: p.topic, questions: p.questions, cueCardPrompt: p.cueCardPrompt, preparationSeconds: p.preparationSeconds, speakingMinutes: p.speakingMinutes })) }
}

export type SpeakingSessionsPage = { items: SpeakingSession[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchSpeakingSessions(page = 1, pageSize = 20, status?: string, setId?: string, testId?: string): Promise<SpeakingSessionsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (status) params.set('status', status)
  if (setId) params.set('setId', setId)
  if (testId) params.set('testId', testId)
  const { data } = await httpClient.get<ApiResponse<PagedResult<ApiSpeakingSessionSummary>>>(`/api/admin/ielts/speaking?${params}`)
  const r = data.data
  return { items: r.items.map(mapSpeakingSessionSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchSpeakingSessionById(id: string): Promise<FullSpeakingSession> {
  const { data } = await httpClient.get<ApiResponse<ApiFullSpeakingSession>>(`/api/admin/ielts/speaking/${id}`)
  return mapFullSpeakingSession(data.data)
}

export async function createSpeakingSession(payload: { title: string }): Promise<SpeakingSession> {
  const { data } = await httpClient.post<ApiResponse<ApiSpeakingSessionSummary>>('/api/admin/ielts/speaking', { title: payload.title, topic: '', parts: [] })
  return mapSpeakingSessionSummary(data.data)
}

export async function updateSpeakingSession(id: string, session: FullSpeakingSession): Promise<FullSpeakingSession> {
  const { data } = await httpClient.put<ApiResponse<ApiFullSpeakingSession>>(`/api/admin/ielts/speaking/${id}`, { title: session.title, topic: session.topic, status: session.status, parts: session.parts.map(p => ({ partNumber: p.part, topic: p.topic, questions: p.questions, cueCardPrompt: p.cueCardPrompt, preparationSeconds: p.preparationSeconds, speakingMinutes: p.speakingMinutes })) })
  return mapFullSpeakingSession(data.data)
}

export async function deleteSpeakingSession(id: string): Promise<void> {
  await httpClient.delete(`/api/admin/ielts/speaking/${id}`)
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
  const { data } = await httpClient.get<ApiResponse<PagedResult<ApiVocabTopicSummary>>>(`/api/admin/ielts/vocabulary?${params}`)
  const r = data.data
  return { items: r.items.map(mapVocabTopicSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchVocabTopicById(id: string): Promise<FullVocabTopic> {
  const { data } = await httpClient.get<ApiResponse<ApiVocabTopicDetail>>(`/api/admin/ielts/vocabulary/${id}`)
  return mapFullVocabTopic(data.data)
}

export async function createVocabTopic(payload: { title: string; difficulty?: string }): Promise<VocabTopic> {
  const { data } = await httpClient.post<ApiResponse<ApiVocabTopicSummary>>('/api/admin/ielts/vocabulary', { title: payload.title, slug: slugify(payload.title), description: '', iconName: 'book', difficulty: payload.difficulty ?? 'beginner', words: [] })
  return mapVocabTopicSummary(data.data)
}

export async function updateVocabTopic(id: string, topic: FullVocabTopic): Promise<FullVocabTopic> {
  const { data } = await httpClient.put<ApiResponse<ApiVocabTopicDetail>>(`/api/admin/ielts/vocabulary/${id}`, { title: topic.title, slug: topic.slug, description: topic.description, iconName: topic.iconName, difficulty: topic.difficulty, status: topic.status, words: topic.words.map(mapVocabWordToRequest) })
  return mapFullVocabTopic(data.data)
}

export async function deleteVocabTopic(id: string): Promise<void> {
  await httpClient.delete(`/api/admin/ielts/vocabulary/${id}`)
}

// ─── Sets (Mock Tests) ────────────────────────────────────────────────────────

type ApiMockTestSection = { id: string; skill: string; orderIndex: number; durationMinutes: number; skillContentId?: string }
type ApiMockTestInSet = { id: string; orderIndex: number; title: string; durationMinutes: number; status: string; sectionCount: number }
type ApiIeltsSetSummary = { id: string; title: string; description: string; type: string; difficulty: string; testCount: number; status: string; createdAt: string }
type ApiIeltsSetDetail = Omit<ApiIeltsSetSummary, 'testCount'>

function mapIeltsSetSummary(r: ApiIeltsSetSummary): IeltsSet {
  return { id: r.id, title: r.title, description: r.description, type: r.type as IeltsSet['type'], difficulty: r.difficulty as IeltsSet['difficulty'], testCount: r.testCount, status: r.status as IeltsStatus, createdAt: r.createdAt }
}

function mapIeltsSetDetail(r: ApiIeltsSetDetail): IeltsSetDetail {
  return { id: r.id, title: r.title, description: r.description, type: r.type as IeltsSet['type'], difficulty: r.difficulty as IeltsSet['difficulty'], status: r.status as IeltsStatus, createdAt: r.createdAt }
}

function mapMockTestSection(s: ApiMockTestSection): MockTestSection {
  return { id: s.id, skill: s.skill as MockTestSection['skill'], orderIndex: s.orderIndex, durationMinutes: s.durationMinutes, testId: s.skillContentId ?? '' }
}

function mapMockTestInSet(t: ApiMockTestInSet, setId: string): IeltsTest {
  return { id: t.id, setId, orderIndex: t.orderIndex, title: t.title, durationMinutes: t.durationMinutes, sectionCount: t.sectionCount, status: t.status as IeltsStatus, createdAt: '' }
}

export type IeltsSetsPage = { items: IeltsSet[]; totalCount: number; totalPages: number; page: number; pageSize: number }
export type SetTestsPage = { items: IeltsTest[]; totalCount: number; totalPages: number; page: number; pageSize: number }
export type TestSectionsPage = { items: MockTestSection[]; totalCount: number; totalPages: number; page: number; pageSize: number }

export async function fetchIeltsSets(page = 1, pageSize = 20, status?: string): Promise<IeltsSetsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (status) params.set('status', status)
  const { data } = await httpClient.get<ApiResponse<PagedResult<ApiIeltsSetSummary>>>(`/api/admin/ielts/sets?${params}`)
  const r = data.data
  return { items: r.items.map(mapIeltsSetSummary), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

export async function fetchIeltsSetById(id: string): Promise<IeltsSetDetail> {
  const { data } = await httpClient.get<ApiResponse<ApiIeltsSetDetail>>(`/api/admin/ielts/sets/${id}`)
  return mapIeltsSetDetail(data.data)
}

// Tests within a Set (paginated) — no sections embedded; fetch via fetchTestSections.
export async function fetchSetTests(setId: string, page = 1, pageSize = 50): Promise<SetTestsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  const { data } = await httpClient.get<ApiResponse<PagedResult<ApiMockTestInSet>>>(`/api/admin/ielts/sets/${setId}/tests?${params}`)
  const r = data.data
  return { items: r.items.map((t) => mapMockTestInSet(t, setId)), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

// Skill sections for a single test (paginated).
export async function fetchTestSections(testId: string, page = 1, pageSize = 10): Promise<TestSectionsPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  const { data } = await httpClient.get<ApiResponse<PagedResult<ApiMockTestSection>>>(`/api/admin/ielts/sets/tests/${testId}/sections?${params}`)
  const r = data.data
  return { items: r.items.map(mapMockTestSection), totalCount: r.totalCount, totalPages: r.totalPages, page: r.page, pageSize: r.pageSize }
}

// Composes the Set + its tests + each test's sections via separate paginated calls.
export async function fetchFullIeltsSet(setId: string): Promise<FullIeltsSet> {
  const set = await fetchIeltsSetById(setId)
  const testsPage = await fetchSetTests(setId, 1, 100)
  const tests: FullIeltsTest[] = await Promise.all(
    testsPage.items.map(async (t) => ({ ...t, sections: (await fetchTestSections(t.id, 1, 10)).items }))
  )
  return { ...set, testCount: testsPage.totalCount, tests }
}

export async function createIeltsSet(payload: { title: string; type?: string }): Promise<IeltsSet> {
  const { data } = await httpClient.post<ApiResponse<ApiIeltsSetSummary>>('/api/admin/ielts/sets', { title: payload.title, description: '', type: payload.type ?? 'academic', difficulty: 'intermediate' })
  return mapIeltsSetSummary(data.data)
}

export async function updateIeltsSet(id: string, set: Pick<IeltsSet, 'title' | 'description' | 'type' | 'difficulty' | 'status'>): Promise<IeltsSetDetail> {
  const { data } = await httpClient.put<ApiResponse<ApiIeltsSetDetail>>(`/api/admin/ielts/sets/${id}`, { title: set.title, description: set.description, type: set.type, difficulty: set.difficulty, status: set.status })
  return mapIeltsSetDetail(data.data)
}

export async function deleteIeltsSet(id: string): Promise<void> {
  await httpClient.delete(`/api/admin/ielts/sets/${id}`)
}

export async function addTestToSet(setId: string, payload: { title: string; orderIndex?: number; durationMinutes?: number; sections?: { skill: string; orderIndex: number; durationMinutes: number }[] }): Promise<FullIeltsTest> {
  const { data } = await httpClient.post<ApiResponse<ApiMockTestInSet>>(`/api/admin/ielts/sets/${setId}/tests`, { title: payload.title, orderIndex: payload.orderIndex ?? 1, durationMinutes: payload.durationMinutes ?? 170, sections: payload.sections ?? [] })
  return { ...mapMockTestInSet(data.data, setId), sections: [] }
}

export async function updateTestInSet(testId: string, setId: string, test: FullIeltsTest): Promise<FullIeltsTest> {
  const { data } = await httpClient.put<ApiResponse<ApiMockTestInSet>>(`/api/admin/ielts/sets/tests/${testId}`, { orderIndex: test.orderIndex, title: test.title, durationMinutes: test.durationMinutes, status: test.status, sections: test.sections.map(s => ({ skill: s.skill, orderIndex: s.orderIndex, durationMinutes: s.durationMinutes, skillContentId: s.testId || null })) })
  return { ...mapMockTestInSet(data.data, setId), sections: test.sections }
}

export async function deleteTestFromSet(testId: string): Promise<void> {
  await httpClient.delete(`/api/admin/ielts/sets/tests/${testId}`)
}
