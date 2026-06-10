// NOTE: Unlike ielts.ts (zod-based), these are plain validator functions.
// The new layout node shapes are too heterogeneous/nested for a single
// discriminated-union form payload; each editor validates its own draft
// node directly and returns a Record<string,string> error map, matching
// the existing `errors` + fieldErrors() display pattern used elsewhere.

import type { TableNode, McqGroupNode, GapFillNode, ImageLabelNode } from '@/lib/types/ielts'

export function validateTableNode(node: TableNode): Record<string, string> {
  const errors: Record<string, string> = {}
  if (node.headers.length === 0) {
    errors.headers = 'At least one column is required'
  } else if (node.headers.some((h) => !h.trim())) {
    errors.headers = 'Column headers cannot be empty'
  }

  if (node.rows.length === 0) {
    errors.rows = 'At least one row is required'
  } else if (node.rows.some((row) => row.cells.some((cell) => cell.type === 'input' && !cell.correctAnswer.trim()))) {
    errors.rows = 'All input cells need a correct answer'
  }

  return errors
}

export function validateMcqGroupNode(node: McqGroupNode): Record<string, string> {
  const errors: Record<string, string> = {}
  if (node.questions.length === 0) {
    errors.questions = 'At least one sub-question is required'
    return errors
  }
  for (const q of node.questions) {
    if (!q.text.trim()) { errors.questions = 'Each sub-question needs question text'; break }
    if (q.options.length < 2) { errors.questions = 'Each sub-question needs at least 2 options'; break }
    if (q.options.some((o) => !o.text.trim())) { errors.questions = 'All option text fields must be filled in'; break }
    if (!q.correctAnswer.trim()) { errors.questions = 'Each sub-question needs a correct answer'; break }
  }
  return errors
}

export function validateGapFillNode(node: GapFillNode): Record<string, string> {
  const errors: Record<string, string> = {}
  const inputBlocks = node.blocks.filter((b) => b.type === 'input')
  if (inputBlocks.length === 0) {
    errors.blocks = 'Use {{answer}} to mark at least one blank'
  } else if (inputBlocks.some((b) => b.type === 'input' && !b.correctAnswer.trim())) {
    errors.blocks = 'Blanks cannot be empty — {{}} is not allowed'
  }
  return errors
}

export function validateImageLabelNode(node: ImageLabelNode): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!node.imageUrl) errors.imageUrl = 'An image is required'

  if (node.points.length === 0) {
    errors.points = 'At least one label point is required'
    return errors
  }
  for (const p of node.points) {
    if (!p.label.trim()) { errors.points = 'Each point needs a label'; break }
    if (!p.correctAnswer.trim()) { errors.points = 'Each point needs a correct answer'; break }
    if (p.x < 0 || p.x > 100 || p.y < 0 || p.y > 100) { errors.points = 'X/Y must be between 0 and 100'; break }
  }
  return errors
}
