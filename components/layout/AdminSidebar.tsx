'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, BookMarked, Headphones, PenLine, Mic, ClipboardList, Brain,
  FileText, GraduationCap, BarChart2, MessageSquare, CreditCard, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import { useUIStore } from '@/lib/store/ui-store'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Users',
    items: [
      { href: '/users', label: 'Users', icon: Users },
    ],
  },
  {
    label: 'IELTS Content',
    items: [
      { href: '/ielts/reading', label: 'Reading', icon: BookMarked },
      { href: '/ielts/listening', label: 'Listening', icon: Headphones },
      { href: '/ielts/writing', label: 'Writing', icon: PenLine },
      { href: '/ielts/speaking', label: 'Speaking', icon: Mic },
      { href: '/ielts/vocabulary', label: 'Vocabulary', icon: Brain },
      { href: '/ielts/mock-tests', label: 'Mock Tests', icon: ClipboardList },
    ],
  },
  {
    label: 'Platform Content',
    items: [
      { href: '/content/blog', label: 'Blog', icon: FileText },
      { href: '/content/exam-guide', label: 'Exam Guide', icon: GraduationCap },
      { href: '/content/band-tables', label: 'Band Tables', icon: BarChart2 },
    ],
  },
  {
    label: 'Engage',
    items: [
      { href: '/community', label: 'Community', icon: MessageSquare },
      { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-200',
        sidebarCollapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between px-3 border-b border-sidebar-border shrink-0">
        {!sidebarCollapsed && (
          <span className="font-semibold text-sm text-sidebar-foreground tracking-tight">
            Better IELTS <span className="text-primary font-bold">Admin</span>
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
            sidebarCollapsed && 'mx-auto'
          )}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {!sidebarCollapsed && (
              <p className="px-2 pt-3 pb-1 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest">
                {group.label}
              </p>
            )}
            {sidebarCollapsed && <div className="my-1 border-t border-sidebar-border/50" />}
            {group.items.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                    sidebarCollapsed && 'justify-center'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
