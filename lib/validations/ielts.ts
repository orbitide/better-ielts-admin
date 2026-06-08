import { z } from 'zod'

export const MockTestSchema = z.object({
  title:       z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  type:        z.enum(['academic', 'general']),
  difficulty:  z.enum(['beginner', 'intermediate', 'advanced']),
  status:      z.enum(['draft', 'published', 'archived']),
})

export const ContentSchema = z.object({
  title:  z.string().min(1, 'Title is required').max(200),
  type:   z.string().min(1, 'Type is required'),
  status: z.enum(['draft', 'published', 'archived']),
})

export const ReadingSectionSchema = z.object({
  passageTitle: z.string().min(1, 'Passage title is required').max(200),
  passageBody:  z.string().min(1, 'Passage text is required'),
  passageIndex: z.number().min(0),
})

export const ReadingQuestionSchema = z.discriminatedUnion('qType', [
  z.object({
    qType:      z.literal('mcq'),
    qNumber:    z.number().min(1),
    mcqStem:    z.string().min(1, 'Question text is required'),
    mcqOptions: z.array(z.object({ label: z.string(), text: z.string().min(1, 'Option text required') })).min(2, 'At least 2 options required'),
    mcqAnswer:  z.string().min(1, 'Please select the correct answer'),
  }),
  z.object({
    qType:         z.literal('tfng'),
    qNumber:       z.number().min(1),
    tfngStatement: z.string().min(1, 'Statement is required'),
    tfngAnswer:    z.enum(['TRUE', 'FALSE', 'NOT GIVEN']),
  }),
  z.object({
    qType:        z.literal('matching'),
    qNumber:      z.number().min(1),
    matchStem:    z.string().min(1, 'Instruction is required'),
    matchOptions: z.array(z.object({ key: z.string(), text: z.string().min(1, 'Option text required') })).min(2, 'At least 2 options required'),
    matchAnswer:  z.string().min(1, 'Please select the correct answer'),
  }),
  z.object({
    qType:       z.literal('fill-blank'),
    qNumber:     z.number().min(1),
    fbStem:      z.string().min(1, 'Question is required'),
    fbAnswer:    z.string().min(1, 'Answer is required'),
    fbWordLimit: z.number().optional(),
  }),
])

export const ListeningSectionSchema = z.object({
  sectionNumber:        z.coerce.number().int().min(1).max(4),
  audioUrl:             z.string().min(1, 'Audio URL is required'),
  audioDurationSeconds: z.number().min(0),
  transcript:           z.string().optional(),
})

export const ListeningQuestionSchema = z.discriminatedUnion('qType', [
  z.object({
    qType:    z.literal('fill-blank'),
    qNumber:  z.number().min(1),
    stem:     z.string().min(1, 'Question is required'),
    fbAnswer: z.string().min(1, 'Answer is required'),
  }),
  z.object({
    qType:      z.literal('mcq'),
    qNumber:    z.number().min(1),
    stem:       z.string().min(1, 'Question is required'),
    mcqOptions: z.array(z.object({ label: z.string(), text: z.string().min(1, 'Option text required') })).min(2, 'At least 2 options required'),
    mcqAnswer:  z.string().min(1, 'Please select the correct answer'),
  }),
  z.object({
    qType:        z.literal('matching'),
    qNumber:      z.number().min(1),
    stem:         z.string().min(1, 'Instruction is required'),
    matchOptions: z.array(z.object({ key: z.string(), text: z.string().min(1, 'Option text required') })).min(2, 'At least 2 options required'),
    matchAnswer:  z.string().min(1, 'Please select the correct answer'),
  }),
])

export const SpeakingPartSchema = z.object({
  topic:              z.string().min(1, 'Topic is required').max(200),
  speakingMinutes:    z.number().min(1, 'Must be at least 1 minute').max(15, 'Must be 15 minutes or fewer'),
  cueCardPrompt:      z.string().optional(),
  preparationSeconds: z.number().min(30, 'Minimum 30 seconds').max(120, 'Maximum 120 seconds').optional(),
})
