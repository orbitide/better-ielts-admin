import type { BlogCategory } from '@/lib/types/content'

export const mockBlogCategories: BlogCategory[] = [
  { id: 'cat-1', name: 'Study Tips',  slug: 'study-tips',  description: 'General strategies and study habits for IELTS preparation' },
  { id: 'cat-2', name: 'Writing',     slug: 'writing',     description: 'IELTS Writing Task 1 & Task 2 guides and techniques' },
  { id: 'cat-3', name: 'Reading',     slug: 'reading',     description: 'Reading skills, passage strategies, and question types' },
  { id: 'cat-4', name: 'Listening',   slug: 'listening',   description: 'Listening comprehension strategies and accent training' },
  { id: 'cat-5', name: 'Speaking',    slug: 'speaking',    description: 'Speaking test tips, fluency, and pronunciation guidance' },
  { id: 'cat-6', name: 'Vocabulary',  slug: 'vocabulary',  description: 'Word lists, collocations, and vocabulary building methods' },
  { id: 'cat-7', name: 'General',     slug: 'general',     description: 'General IELTS information, test formats, and comparisons' },
]
