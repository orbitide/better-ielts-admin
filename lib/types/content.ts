export type BlogPost = {
  id: string
  title: string
  slug: string
  category: string
  author: string
  status: 'published' | 'draft'
  publishedAt: string | null
  updatedAt: string
  excerpt: string
}

export type ExamGuideSection = {
  id: string
  title: string
  skill: 'listening' | 'reading' | 'writing' | 'speaking' | 'general'
  order: number
  status: 'published' | 'draft'
  updatedAt: string
}

export type BandTableRow = {
  rawScore: number
  band: number
}

export type BandTable = {
  id: string
  skill: 'listening' | 'reading'
  type: 'academic' | 'general'
  rows: BandTableRow[]
  updatedAt: string
}
