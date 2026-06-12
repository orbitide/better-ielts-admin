'use client'

import { useState } from 'react'
import { Mail, Shield, User, Lock } from 'lucide-react'
import { useAdminAuthStore } from '@/lib/store/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import axios from 'axios'
import { httpClient } from '@/lib/api/http'

const roleLabels: Record<string, string> = {
  SuperAdmin: 'Super Admin',
  ContentManager: 'Content Manager',
  Moderator: 'Moderator',
}

export default function ProfilePage() {
  const admin = useAdminAuthStore((s) => s.admin)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')

    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters.')
      return
    }

    setPwLoading(true)
    try {
      const { data: json } = await httpClient.post('/api/admin/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      })
      if (json.success) {
        setPwSuccess('Password changed successfully.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPwError(json.message ?? 'Failed to change password.')
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setPwError(err.response.data?.message ?? 'Failed to change password.')
      } else {
        setPwError('Unable to connect to server.')
      }
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="p-5 sm:p-6 space-y-6 max-w-2xl mx-auto">
      <PageHeader title="Profile" description="Your account information." />

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 py-2 border-b border-border">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{admin?.name ?? '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2 border-b border-border">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{admin?.email ?? '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium">
                {admin?.role ? (roleLabels[admin.role] ?? admin.role) : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            {pwError && <p className="text-sm text-destructive">{pwError}</p>}
            {pwSuccess && <p className="text-sm text-green-600">{pwSuccess}</p>}
            <Button type="submit" disabled={pwLoading}>
              {pwLoading ? 'Saving…' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
