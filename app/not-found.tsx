import { buttonVariants } from '@/components/ui/button-variants'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center">
        <p className="text-8xl font-extrabold text-primary/20 mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground text-sm mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className={buttonVariants({ variant: 'outline' })}>Go home</Link>
          <Link href="/dashboard" className={buttonVariants()}>Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
