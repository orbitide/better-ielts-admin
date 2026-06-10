import type { IeltsStatus } from './ielts'

export type CallTopic = {
  id: string
  label: string
  icon: string
  description: string
  questions: string[]
  status: IeltsStatus
  sortOrder: number
  createdAt: string
}

export const CALL_TOPIC_ICON_OPTIONS = [
  'Leaf', 'Cpu', 'GraduationCap', 'Heart', 'Plane', 'Briefcase',
  'Users', 'Palette', 'UtensilsCrossed', 'Trophy', 'Building2', 'Radio',
] as const
