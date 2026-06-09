'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, BookMarked, Headphones, PenLine, Mic, Layers2, Brain,
  FileText, GraduationCap, BarChart2, MessageSquare, CreditCard, ChevronLeft, ChevronRight,
  LogOut, User, Settings, ChevronUp, ShieldCheck, KeyRound,
} from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import { useUIStore } from '@/lib/store/ui-store'
import { useAdminAuthStore } from '@/lib/store/auth-store'
import { hasPermission, type Permission } from '@/lib/auth/permissions'

type NavItem = { href: string; label: string; icon: React.ElementType }
type NavGroup = { label: string; permission?: Permission; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Users',
    permission: 'users:view',
    items: [
      { href: '/users', label: 'Users', icon: Users },
    ],
  },
  {
    label: 'IELTS Content',
    permission: 'ielts:view',
    items: [
      { href: '/ielts/mock-tests', label: 'Sets', icon: Layers2 },
      { href: '/ielts/reading', label: 'Reading', icon: BookMarked },
      { href: '/ielts/listening', label: 'Listening', icon: Headphones },
      { href: '/ielts/writing', label: 'Writing', icon: PenLine },
      { href: '/ielts/speaking', label: 'Speaking', icon: Mic },
      { href: '/ielts/vocabulary', label: 'Vocabulary', icon: Brain },
    ],
  },
  {
    label: 'Platform Content',
    permission: 'content:view',
    items: [
      { href: '/content/blog', label: 'Blog', icon: FileText },
      { href: '/content/exam-guide', label: 'Exam Guide', icon: GraduationCap },
      { href: '/content/band-tables', label: 'Band Tables', icon: BarChart2 },
    ],
  },
  {
    label: 'Engage',
    permission: 'community:view',
    items: [
      { href: '/community', label: 'Community', icon: MessageSquare },
      { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const admin = useAdminAuthStore((s) => s.admin)
  const logout = useAdminAuthStore((s) => s.logout)

  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [profileOpen])

  const handleLogout = async () => {
    setProfileOpen(false)
    await logout()
    router.replace('/login')
  }

  const visibleGroups = navGroups.filter(
    (g) => !g.permission || (admin && hasPermission(admin.role, g.permission))
  )

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
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Better IELTS" width={28} height={28} />
            <span className="font-semibold text-sm text-sidebar-foreground tracking-tight">
              Better IELTS <span className="text-primary font-bold">Admin</span>
            </span>
          </div>
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
        {visibleGroups.map((group) => (
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

      {/* Account / Profile Dropdown */}
      <div ref={profileRef} className="relative border-t border-sidebar-border shrink-0">
        {/* Dropdown menu */}
        {profileOpen && (
          <div
            className={cn(
              'absolute z-30 rounded-xl border border-border bg-card shadow-xl py-1 text-sm',
              sidebarCollapsed
                ? 'left-full bottom-0 ml-1 w-44'
                : 'bottom-full left-0 right-0 mb-1 mx-2'
            )}
          >
            <Link
              href="/profile"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/60 w-full transition-colors"
            >
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/60 w-full transition-colors"
            >
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              Settings
            </Link>
            {admin?.role === 'SuperAdmin' && (
              <>
                <Link
                  href="/settings/admins"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/60 w-full transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  Admin Management
                </Link>
                <Link
                  href="/settings/roles"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/60 w-full transition-colors"
                >
                  <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                  Role & Permissions
                </Link>
              </>
            )}
            <div className="my-1 border-t border-border" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 w-full text-left transition-colors text-red-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        )}

        {sidebarCollapsed ? (
          <div className="flex justify-center py-3">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              title="Account menu"
              className="rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2.5 px-3 py-3 w-full hover:bg-sidebar-accent/60 transition-colors"
          >
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{admin?.name}</p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">{admin?.email}</p>
            </div>
            <ChevronUp
              className={cn(
                'h-3.5 w-3.5 text-sidebar-foreground/40 shrink-0 transition-transform duration-200',
                !profileOpen && 'rotate-180'
              )}
            />
          </button>
        )}
      </div>
    </aside>
  )
}
