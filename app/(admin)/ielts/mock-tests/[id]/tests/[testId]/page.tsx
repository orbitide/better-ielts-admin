import { notFound } from 'next/navigation'
import { getFullIeltsTestInSet, getReadingTests, getListeningTests, getWritingTasks, getSpeakingSessions } from '@/lib/data/ielts'
import { TestDetailShell } from '@/components/ielts/TestDetailShell'

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ id: string; testId: string }>
}) {
  const { id: setId, testId } = await params
  const [result, reading, listening, writing, speaking] = await Promise.all([
    getFullIeltsTestInSet(setId, testId),
    getReadingTests(),
    getListeningTests(),
    getWritingTasks(),
    getSpeakingSessions(),
  ])

  if (!result) notFound()
  const { set, test } = result

  const titleMap: Record<string, string> = {}
  reading.forEach((t) => { titleMap[t.id] = t.title })
  listening.forEach((t) => { titleMap[t.id] = t.title })
  writing.forEach((t) => { titleMap[t.id] = t.title })
  speaking.forEach((t) => { titleMap[t.id] = t.title })

  return (
    <TestDetailShell
      setId={set.id}
      setTitle={set.title}
      test={test}
      skillTitles={titleMap}
      availableSkills={{
        reading: reading.map((t) => ({ id: t.id, title: t.title })),
        listening: listening.map((t) => ({ id: t.id, title: t.title })),
        writing: writing.map((t) => ({ id: t.id, title: t.title })),
        speaking: speaking.map((t) => ({ id: t.id, title: t.title })),
      }}
    />
  )
}
