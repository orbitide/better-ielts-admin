'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Ban, Eye, MoreHorizontal, Pencil, Shield, ShieldOff, Trash2 } from 'lucide-react'
import type { User } from '@/lib/types/user'

type Props = {
  user: User
  suspended: boolean
  banned: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onBan: (user: User) => void
  onToggleStatus: (user: User) => void
}

export function UserActionsMenu({ user, suspended, banned, onEdit, onDelete, onBan, onToggleStatus }: Props) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<{ top: number; right: number }>({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  function handleToggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuStyle({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      })
    }
    setOpen((v) => !v)
  }

  function close() {
    setOpen(false)
  }

  return (
    <div>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        aria-label="User actions"
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: menuStyle.top, right: menuStyle.right }}
          className="w-44 rounded-xl border border-border bg-card shadow-xl z-50 py-1 text-sm"
        >
          <Link
            href={`/users/${user.id}`}
            onClick={close}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/60 w-full transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            View Profile
          </Link>

          <button
            onClick={() => { close(); onEdit(user) }}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/60 w-full text-left transition-colors"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            Edit
          </button>

          <div className="my-1 border-t border-border" />

          <button
            onClick={() => { close(); onToggleStatus(user) }}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/60 w-full text-left transition-colors"
          >
            {suspended ? (
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ShieldOff className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            {suspended ? 'Unsuspend' : 'Suspend'}
          </button>

          <button
            onClick={() => { close(); onBan(user) }}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/60 w-full text-left transition-colors"
            disabled={banned}
          >
            <Ban className="h-3.5 w-3.5 text-muted-foreground" />
            {banned ? 'Banned' : 'Ban User'}
          </button>

          <div className="my-1 border-t border-border" />

          <button
            onClick={() => { close(); onDelete(user) }}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 w-full text-left transition-colors text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
