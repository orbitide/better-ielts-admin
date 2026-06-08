import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { DataTable, type ColumnDef } from '@/components/ui/DataTable'
import { RoleGate } from '@/components/auth/RoleGate'

type BaseQuestion = {
  id: string
  questionNumber: number
  correctAnswer: string
}

type QuestionsDataTableProps<TQuestion extends BaseQuestion> = {
  questions: TQuestion[]
  getTypeLabel: (q: TQuestion) => string
  getTypeVariant: (q: TQuestion) => 'secondary' | 'warning' | 'success'
  getStem: (q: TQuestion) => string
  onEdit: (q: TQuestion) => void
  onDelete: (q: TQuestion) => void
}

export function QuestionsDataTable<TQuestion extends BaseQuestion>({
  questions,
  getTypeLabel,
  getTypeVariant,
  getStem,
  onEdit,
  onDelete,
}: QuestionsDataTableProps<TQuestion>) {
  const columns: ColumnDef<TQuestion>[] = [
    {
      accessorKey: 'questionNumber',
      header: '#',
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.questionNumber}</span>
      ),
      meta: { className: 'w-10' },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant={getTypeVariant(row.original)}>{getTypeLabel(row.original)}</Badge>
      ),
    },
    {
      id: 'stem',
      header: 'Stem / Statement',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="max-w-xs truncate block text-sm">{getStem(row.original)}</span>
      ),
    },
    {
      accessorKey: 'correctAnswer',
      header: 'Answer',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-mono">{row.original.correctAnswer}</span>
      ),
      meta: { className: 'hidden md:table-cell' },
    },
    {
      id: 'actions',
      enableSorting: false,
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <RoleGate permission="ielts:edit">
            <button
              onClick={() => onEdit(row.original)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </RoleGate>
          <RoleGate permission="ielts:delete">
            <button
              onClick={() => onDelete(row.original)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </RoleGate>
        </div>
      ),
      meta: { className: 'w-20' },
    },
  ]

  return <DataTable columns={columns} data={questions} emptyMessage="No questions yet." />
}
