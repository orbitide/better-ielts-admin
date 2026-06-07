'use client'

import { Moon, Sun } from 'lucide-react'
import { useUIStore } from '@/lib/store/ui-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'

export default function SettingsPage() {
  const { theme, toggleTheme } = useUIStore()

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-2xl mx-auto">
      <PageHeader title="Settings" description="Manage your preferences." />

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the admin panel looks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {theme === 'dark' ? 'Dark mode is on' : 'Light mode is on'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-3.5 w-3.5" />
                  Light
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5" />
                  Dark
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
