'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import { NodeSelection } from '@tiptap/pm/state'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExt from '@tiptap/extension-underline'
import LinkExt from '@tiptap/extension-link'
import ImageExt from '@tiptap/extension-image'
import { Table as TiptapTable, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import {
  Bold, Italic, Underline, Strikethrough,
  Heading2, Heading3,
  List, ListOrdered, Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft, AlignCenter, AlignRight,
  Minus, Code2,
  Undo2, Redo2,
  X, Check, Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils/utils'

/* ─── Image style computation ─────────────────────────────────────────── */
function computeImageStyle(width: string, height: string, align: string): string {
  const parts: string[] = []

  // Width – 'auto' keeps natural size; anything else (50%, 400px…) is applied directly
  if (!width || width === 'auto') {
    parts.push('width: auto', 'max-width: 100%')
  } else {
    parts.push(`width: ${width}`, 'max-width: 100%')
  }

  // Height
  if (height && height !== 'auto') {
    parts.push(`height: ${height}`, 'object-fit: cover')
  }

  // Block display + alignment via margin
  parts.push('display: block')
  if (align === 'center') {
    parts.push('margin-left: auto', 'margin-right: auto')
  } else if (align === 'right') {
    parts.push('margin-left: auto', 'margin-right: 0')
  } else {
    parts.push('margin-left: 0', 'margin-right: auto')
  }

  return parts.join('; ')
}

/* ─── Image Tiptap extension (width + height + align attrs) ───────────── */
const RichImage = ImageExt.configure({ inline: false, allowBase64: false }).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '50%',
        parseHTML: (el) => el.getAttribute('data-width') ?? '50%',
        renderHTML: (attrs) => ({
          'data-width': attrs.width,
          style: computeImageStyle(
            attrs.width as string,
            attrs.height as string,
            attrs.align as string,
          ),
        }),
      },
      height: {
        default: 'auto',
        parseHTML: (el) => el.getAttribute('data-height') ?? 'auto',
        renderHTML: (attrs) => ({ 'data-height': attrs.height }),
      },
      align: {
        default: 'center',
        parseHTML: (el) => el.getAttribute('data-align') ?? 'center',
        renderHTML: (attrs) => ({ 'data-align': attrs.align }),
      },
    }
  },
})

/* ─── Toolbar button ──────────────────────────────────────────────────── */
function TB({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'rounded p-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none',
        active
          ? 'bg-accent text-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
      )}
    >
      {children}
    </button>
  )
}

/* ─── Contextual small button ─────────────────────────────────────────── */
function CB({
  onClick, active, children, destructive, title,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
  destructive?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'rounded px-1.5 py-0.5 text-xs font-medium transition-colors',
        destructive
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          : active
          ? 'bg-accent text-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
      )}
    >
      {children}
    </button>
  )
}

/* ─── Image contextual bar ────────────────────────────────────────────── */
// Separate component so its state resets when you click a different image
function ImageBar({ editor }: { editor: Editor }) {
  const attrs = editor.getAttributes('image')
  const [width, setWidth] = useState(attrs.width ?? '50%')
  const [height, setHeight] = useState(attrs.height ?? 'auto')

  // Sync inputs when the selected image changes (keyed on src)
  useEffect(() => {
    setWidth(attrs.width ?? '50%')
    setHeight(attrs.height ?? 'auto')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attrs.src])

  const apply = (updates: Record<string, string>) =>
    editor.chain().focus().updateAttributes('image', updates).run()

  const align = attrs.align ?? 'center'

  return (
    <div className="flex items-center gap-3 flex-wrap border-b border-input bg-amber-50/60 dark:bg-amber-900/10 px-3 py-1.5">
      <span className="text-xs text-muted-foreground shrink-0">Image:</span>

      {/* Width */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">W</span>
        <input
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          onBlur={() => apply({ width })}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); apply({ width }) } }}
          placeholder="50% or 400px"
          className="w-28 rounded border border-input bg-background px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Height */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">H</span>
        <input
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          onBlur={() => apply({ height })}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); apply({ height }) } }}
          placeholder="auto or 300px"
          className="w-28 rounded border border-input bg-background px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="w-px h-4 bg-border shrink-0" />

      {/* Alignment */}
      <div className="flex items-center gap-0.5">
        <CB onClick={() => apply({ align: 'left' })} active={align === 'left'} title="Align left">
          <AlignLeft className="h-3 w-3" />
        </CB>
        <CB onClick={() => apply({ align: 'center' })} active={align === 'center'} title="Align center">
          <AlignCenter className="h-3 w-3" />
        </CB>
        <CB onClick={() => apply({ align: 'right' })} active={align === 'right'} title="Align right">
          <AlignRight className="h-3 w-3" />
        </CB>
      </div>

      <p className="text-xs text-muted-foreground hidden sm:block">
        Press Enter or click outside to apply
      </p>

      <button
        type="button"
        onClick={() => editor.chain().focus().deleteSelection().run()}
        title="Remove image"
        className="ml-auto flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        <Trash2 className="h-3 w-3" />
        Remove
      </button>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────────────────── */
type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
}

const SEP = <div className="w-px h-4 bg-border mx-0.5 shrink-0" />

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [imageBarOpen, setImageBarOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [linkBarOpen, setLinkBarOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      UnderlineExt,
      LinkExt.configure({ openOnClick: false }),
      RichImage,
      TiptapTable.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    editorProps: {
      attributes: { class: 'outline-none min-h-[600px] text-sm' },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  /* Image insert helpers */
  const openImageBar = () => { setImageUrl(''); setImageBarOpen(true); setLinkBarOpen(false) }
  const closeImageBar = () => { setImageBarOpen(false); setImageUrl('') }
  const insertImage = () => {
    if (!imageUrl.trim()) return
    editor.chain().focus().setImage({ src: imageUrl.trim() }).run()
    closeImageBar()
  }

  /* Link helpers */
  const openLinkBar = () => {
    setLinkUrl(editor.getAttributes('link').href ?? '')
    setLinkBarOpen(true)
    setImageBarOpen(false)
  }
  const closeLinkBar = () => { setLinkBarOpen(false); setLinkUrl('') }
  const applyLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.trim() }).run()
    }
    closeLinkBar()
  }
  const handleLinkButton = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      openLinkBar()
    }
  }

  const inTable = editor.isActive('table')
  const { selection } = editor.state
  const inImage = selection instanceof NodeSelection && selection.node.type.name === 'image'

  return (
    <div className="rounded-md border border-input [overflow:clip] focus-within:ring-1 focus-within:ring-ring">

      {/* ── Sticky toolbar group ───────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-card">

      {/* ── Main toolbar ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 border-b border-input bg-muted/40 px-2 py-1.5 flex-wrap">
        <TB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold className="h-3.5 w-3.5" />
        </TB>
        <TB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic className="h-3.5 w-3.5" />
        </TB>
        <TB onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <Underline className="h-3.5 w-3.5" />
        </TB>
        <TB onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough className="h-3.5 w-3.5" />
        </TB>

        {SEP}

        <TB onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 className="h-3.5 w-3.5" />
        </TB>
        <TB onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 className="h-3.5 w-3.5" />
        </TB>

        {SEP}

        <TB onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List className="h-3.5 w-3.5" />
        </TB>
        <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
          <ListOrdered className="h-3.5 w-3.5" />
        </TB>
        <TB onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote className="h-3.5 w-3.5" />
        </TB>

        {SEP}

        <TB onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
          <Code2 className="h-3.5 w-3.5" />
        </TB>
        <TB onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <Minus className="h-3.5 w-3.5" />
        </TB>

        {SEP}

        <TB onClick={handleLinkButton} active={editor.isActive('link') || linkBarOpen} title={editor.isActive('link') ? 'Remove link' : 'Add link'}>
          <LinkIcon className="h-3.5 w-3.5" />
        </TB>
        <TB onClick={imageBarOpen ? closeImageBar : openImageBar} active={imageBarOpen} title="Insert image">
          <ImageIcon className="h-3.5 w-3.5" />
        </TB>
        <TB
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          active={inTable}
          title="Insert table"
        >
          <TableIcon className="h-3.5 w-3.5" />
        </TB>

        {SEP}

        <TB onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo2 className="h-3.5 w-3.5" />
        </TB>
        <TB onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo2 className="h-3.5 w-3.5" />
        </TB>
      </div>

      {/* ── Image URL insert bar ──────────────────────────────────────── */}
      {imageBarOpen && (
        <div className="flex items-center gap-2 border-b border-input bg-muted/20 px-3 py-2">
          <ImageIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL (https://…)"
            className="flex-1 text-sm rounded border border-input bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); insertImage() } if (e.key === 'Escape') closeImageBar() }}
          />
          <button type="button" onClick={insertImage} className="flex items-center gap-1 rounded px-2 py-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Check className="h-3 w-3" /> Insert
          </button>
          <button type="button" onClick={closeImageBar} className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Link URL bar ──────────────────────────────────────────────── */}
      {linkBarOpen && (
        <div className="flex items-center gap-2 border-b border-input bg-muted/20 px-3 py-2">
          <LinkIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Paste link URL (https://…)"
            className="flex-1 text-sm rounded border border-input bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyLink() } if (e.key === 'Escape') closeLinkBar() }}
          />
          <button type="button" onClick={applyLink} className="flex items-center gap-1 rounded px-2 py-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Check className="h-3 w-3" /> Apply
          </button>
          <button type="button" onClick={closeLinkBar} className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Image size + position controls (shows when image is selected) */}
      {inImage && <ImageBar editor={editor} />}

      {/* ── Table controls (shows when cursor is inside a table) ──────── */}
      {inTable && (
        <div className="flex items-center gap-0.5 flex-wrap border-b border-input bg-blue-50/60 dark:bg-blue-900/10 px-2 py-1">
          <span className="text-xs text-muted-foreground mr-1 shrink-0">Table:</span>
          <CB onClick={() => editor.chain().focus().addColumnBefore().run()}>+ Col Before</CB>
          <CB onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Col After</CB>
          <CB onClick={() => editor.chain().focus().deleteColumn().run()}>− Col</CB>
          {SEP}
          <CB onClick={() => editor.chain().focus().addRowBefore().run()}>+ Row Before</CB>
          <CB onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row After</CB>
          <CB onClick={() => editor.chain().focus().deleteRow().run()}>− Row</CB>
          {SEP}
          <CB onClick={() => editor.chain().focus().deleteTable().run()} destructive>Delete Table</CB>
        </div>
      )}

      </div>{/* end sticky toolbar group */}

      {/* ── Editor area ───────────────────────────────────────────────── */}
      <EditorContent
        editor={editor}
        className={cn(
          'bg-background px-4 py-3 cursor-text',
          '[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[600px]',
          '[&_.ProseMirror_h2]:text-base [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:mb-2',
          '[&_.ProseMirror_h3]:text-[0.875rem] [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:mb-1',
          '[&_.ProseMirror_p]:mb-2 [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p:last-child]:mb-0',
          '[&_.ProseMirror_strong]:font-semibold',
          '[&_.ProseMirror_em]:italic',
          '[&_.ProseMirror_u]:underline [&_.ProseMirror_u]:underline-offset-2',
          '[&_.ProseMirror_s]:line-through',
          '[&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-xs [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:rounded',
          '[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-2',
          '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ul]:mb-2',
          '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_ol]:mb-2',
          '[&_.ProseMirror_li]:mb-0.5',
          '[&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:pl-3 [&_.ProseMirror_blockquote]:text-muted-foreground [&_.ProseMirror_blockquote]:mb-2',
          '[&_.ProseMirror_hr]:border-0 [&_.ProseMirror_hr]:border-t [&_.ProseMirror_hr]:border-border [&_.ProseMirror_hr]:my-4',
          '[&_.ProseMirror_img]:rounded-md [&_.ProseMirror_img]:my-2',
          '[&_.ProseMirror_img.ProseMirror-selectednode]:ring-2 [&_.ProseMirror_img.ProseMirror-selectednode]:ring-primary [&_.ProseMirror_img.ProseMirror-selectednode]:ring-offset-2',
          '[&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:mb-4 [&_.ProseMirror_table]:text-sm',
          '[&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-border [&_.ProseMirror_th]:px-3 [&_.ProseMirror_th]:py-2 [&_.ProseMirror_th]:bg-muted/60 [&_.ProseMirror_th]:font-semibold [&_.ProseMirror_th]:text-left',
          '[&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-border [&_.ProseMirror_td]:px-3 [&_.ProseMirror_td]:py-2 [&_.ProseMirror_td]:align-top',
          '[&_.ProseMirror_.selectedCell]:bg-primary/10',
          '[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0',
        )}
      />
    </div>
  )
}
