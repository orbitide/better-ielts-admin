import { getExamGuideSections } from '@/lib/data/content'
import { ExamGuideShell } from '@/components/content/ExamGuideShell'

export const metadata = { title: 'Exam Guide' }

export default async function ExamGuidePage() {
  const sections = await getExamGuideSections()
  return (
    <div className="p-5 sm:p-6 max-w-4xl mx-auto">
      <ExamGuideShell initialSections={sections} />
    </div>
  )
}
