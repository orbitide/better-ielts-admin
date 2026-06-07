import type { FullSpeakingSession } from '@/lib/types/ielts'

export const mockFullSpeakingSessions: FullSpeakingSession[] = [
  {
    id: 'ss-1',
    title: 'Speaking Test 1 — Hometown & Travel',
    topic: 'Hometown and Travel Experiences',
    partCount: 3,
    status: 'published',
    createdAt: '2025-08-22',
    parts: [
      {
        part: 1,
        topic: 'Personal Background & Hometown',
        speakingMinutes: 4,
        questions: [
          'Can you tell me where you are from?',
          'What do you like most about your hometown?',
          'Has your hometown changed a lot in recent years?',
          'Do you think you will continue to live there in the future?',
          'What kind of accommodation do you live in?',
          'Do you prefer living in the city or the countryside? Why?',
        ],
      },
      {
        part: 2,
        topic: 'A Place You Have Visited',
        speakingMinutes: 2,
        preparationSeconds: 60,
        cueCardPrompt: `Describe a place you have visited that you found particularly interesting.

You should say:
  • where the place is
  • when you visited it
  • what you did there
  • and explain why you found it particularly interesting.`,
        questions: [
          'How did you travel to this place?',
          'Who did you go with?',
          'Would you recommend this place to others?',
        ],
      },
      {
        part: 3,
        topic: 'Tourism and Travel in Society',
        speakingMinutes: 5,
        questions: [
          'How has tourism changed in your country over the past few decades?',
          'What are the advantages and disadvantages of mass tourism for local communities?',
          'Do you think people travel for different reasons today compared to the past?',
          'How might climate change affect international travel in the future?',
          'Should governments limit the number of tourists visiting popular destinations? Why or why not?',
        ],
      },
    ],
  },
  {
    id: 'ss-2',
    title: 'Speaking Test 2 — Work & Technology',
    topic: 'Work, Career, and Technology',
    partCount: 3,
    status: 'published',
    createdAt: '2025-09-10',
    parts: [
      {
        part: 1,
        topic: 'Work and Daily Routine',
        speakingMinutes: 4,
        questions: [
          'Do you work or are you a student?',
          'What do you enjoy most about your work or studies?',
          'How do you usually spend your free time?',
          'Do you find it easy to manage your time?',
          'Have you ever worked with people from other countries?',
          'What kind of job would you like to have in the future?',
        ],
      },
      {
        part: 2,
        topic: 'A Piece of Technology You Use',
        speakingMinutes: 2,
        preparationSeconds: 60,
        cueCardPrompt: `Describe a piece of technology you use regularly in your daily life.

You should say:
  • what it is
  • how often you use it
  • what you use it for
  • and explain why you find it useful or important.`,
        questions: [
          'How long have you been using this technology?',
          'Do you think you could manage without it?',
          'Has this technology changed the way you work or study?',
        ],
      },
      {
        part: 3,
        topic: 'Technology and Society',
        speakingMinutes: 5,
        questions: [
          'How has technology changed the way people work over the past 20 years?',
          'Do you think automation will create more problems than it solves for the workforce?',
          'What are the risks of society becoming too dependent on technology?',
          'How important is it for schools to teach children about technology and digital skills?',
          'Do you think technology has made communication better or worse? In what ways?',
          'What responsibilities do technology companies have towards their users and society?',
        ],
      },
    ],
  },
  {
    id: 'ss-3',
    title: 'Speaking Test 3 — Health & Sport',
    topic: 'Health, Fitness, and Sport',
    partCount: 3,
    status: 'draft',
    createdAt: '2025-10-05',
    parts: [],
  },
  {
    id: 'ss-4',
    title: 'Speaking Test 4 — Environment & Nature',
    topic: 'Environment, Nature, and Wildlife',
    partCount: 3,
    status: 'draft',
    createdAt: '2025-11-12',
    parts: [],
  },
]
