import type { FullListeningTest, ListeningLayoutNode } from '@/lib/types/ielts'

export type LayoutAnswerKey = {
  inputId: string
  questionNumber: number
  correctAnswer: string
}

/**
 * Flattens all leaf input fields (table input cells, mcq_group sub-questions,
 * gap_fill input blocks, image_label points) across an array of layout nodes
 * into a flat list of {inputId, questionNumber, correctAnswer}.
 */
export function getLayoutAnswerKeys(nodes: ListeningLayoutNode[] | undefined): LayoutAnswerKey[] {
  if (!nodes) return []
  const keys: LayoutAnswerKey[] = []

  for (const node of nodes) {
    if (node.type === 'table') {
      for (const row of node.rows) {
        for (const cell of row.cells) {
          if (cell.type === 'input') keys.push(cell)
        }
      }
    } else if (node.type === 'mcq_group') {
      for (const q of node.questions) {
        keys.push({ inputId: q.inputId, questionNumber: q.questionNumber, correctAnswer: q.correctAnswer })
      }
    } else if (node.type === 'gap_fill') {
      for (const block of node.blocks) {
        if (block.type === 'input') keys.push(block)
      }
    } else if (node.type === 'image_label') {
      for (const point of node.points) keys.push(point)
    }
  }

  return keys.sort((a, b) => a.questionNumber - b.questionNumber)
}

/**
 * Suggests the next available question number across the whole test —
 * scans every section's legacy `questions[]` plus all `layout.nodes` leaf
 * inputs (excluding the node currently being edited, so its own numbers
 * don't inflate the suggestion).
 */
export function getNextQuestionNumber(test: FullListeningTest, excludeNodeId?: string): number {
  let max = 0
  for (const section of test.sections) {
    for (const q of section.questions) max = Math.max(max, q.questionNumber)
    for (const node of section.layout?.nodes ?? []) {
      if (node.id === excludeNodeId) continue
      for (const key of getLayoutAnswerKeys([node])) max = Math.max(max, key.questionNumber)
    }
  }
  return max + 1
}

export function inputIdFor(questionNumber: number): string {
  return `q${questionNumber}`
}

export function genLayoutNodeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
