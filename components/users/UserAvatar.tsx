const COLORS = [
  'bg-violet-500',
  'bg-teal-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-indigo-500',
  'bg-orange-500',
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getColor(name: string): string {
  let hash = 0
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return COLORS[hash % COLORS.length]
}

const sizeClass = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-14 h-14 text-base',
}

export function UserAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  return (
    <div
      className={`${sizeClass[size]} ${getColor(name)} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
    >
      {getInitials(name)}
    </div>
  )
}
