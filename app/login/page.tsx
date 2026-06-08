import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = { title: 'Login' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-sm p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">Better IELTS <span className="text-primary">Admin</span></h1>
          <p className="text-sm text-muted-foreground">Sign in to manage the platform.</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <div className="space-y-1.5 border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground text-center mb-2">Test accounts</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><span className="font-mono text-foreground">superadmin@betterielts.com</span> / <span className="font-mono text-foreground">super123</span> — Super Admin</p>
            <p><span className="font-mono text-foreground">content@betterielts.com</span> / <span className="font-mono text-foreground">content123</span> — Content Manager</p>
            <p><span className="font-mono text-foreground">mod@betterielts.com</span> / <span className="font-mono text-foreground">mod123</span> — Moderator</p>
          </div>
        </div>
      </div>
    </div>
  )
}
