import { notFound } from 'next/navigation'
import { getUserById } from '@/lib/data/users'
import Link from 'next/link'
import { ArrowLeft, Target, Clock, BookMarked } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { UserAvatar } from '@/components/users/UserAvatar'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUserById(id)
  return { title: user ? user.name : 'User Not Found' }
}

const planVariant: Record<string, 'default' | 'success' | 'secondary'> = {
  elite: 'default',
  pro: 'success',
  free: 'secondary',
}

const skills = ['overall', 'listening', 'reading', 'writing', 'speaking'] as const

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUserById(id)
  if (!user) notFound()

  return (
    <div className="p-5 sm:p-6 space-y-5 max-w-3xl mx-auto">
      <Link
        href="/users"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Users
      </Link>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{user.name}</h1>
                <Badge variant={planVariant[user.plan]}>{user.plan}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Joined {user.joinedAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <BookMarked className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Band</p>
              <p className="text-xl font-bold text-primary">{user.currentBand.overall}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/30">
              <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Target Band</p>
              <p className="text-xl font-bold">{user.targetBand}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-900/30">
              <Clock className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Study Hours</p>
              <p className="text-xl font-bold">{user.totalStudyHours}h</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Band Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {skills.map((skill) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="text-sm capitalize w-20 shrink-0">{skill}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(user.currentBand[skill] / 9) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-mono font-semibold w-8 text-right">{user.currentBand[skill]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
