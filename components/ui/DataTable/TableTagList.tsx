type TableTagListProps = {
  tags: string[]
  max?: number
}

export function TableTagList({ tags, max = 2 }: TableTagListProps) {
  const visible = tags.slice(0, max)
  const overflow = tags.length - max

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((tag) => (
        <span
          key={tag}
          className="inline-block rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
        >
          {tag}
        </span>
      ))}
      {overflow > 0 && (
        <span className="inline-block rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          +{overflow}
        </span>
      )}
    </div>
  )
}
