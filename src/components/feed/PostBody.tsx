interface PostBodyProps {
  caption: string
}

export function PostBody({ caption }: PostBodyProps) {
  return (
    <div className="text-foreground leading-relaxed">
      <p>{caption}</p>
    </div>
  )
}
