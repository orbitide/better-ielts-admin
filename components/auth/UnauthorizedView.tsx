import { ShieldOff } from 'lucide-react'

export function UnauthorizedView({ requiredRole }: { requiredRole?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-10 text-center space-y-3">
      <ShieldOff className="h-10 w-10 text-muted-foreground" />
      <h2 className="text-lg font-semibold">Access Restricted</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        {requiredRole ? (
          <>
            You need the{' '}
            <span className="font-mono font-medium">{requiredRole}</span> role to
            access this section.
          </>
        ) : (
          'You do not have permission to access this section.'
        )}
      </p>
    </div>
  )
}
