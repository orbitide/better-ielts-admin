'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAdminAuthStore } from '@/lib/store/auth-store'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { LoginSchema } from '@/lib/validations/auth'
import { fieldErrors } from '@/lib/validations/utils'

export function LoginForm() {
  const [email, setEmail] = useState('superadmin@betterielts.com')
  const [password, setPassword] = useState('123456a')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const login = useAdminAuthStore((s) => s.login)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = LoginSchema.safeParse({ email, password })
    if (!result.success) {
      setErrors(fieldErrors(result.error))
      return
    }
    setErrors({})

    setLoading(true)
    const { ok, error: loginError } = await login(email, password)

    if (ok) {
      const redirect = searchParams.get('redirect') ?? '/dashboard';
      router.replace(redirect)
    } else {
      setError(loginError ?? 'Invalid email or password.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
        />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
