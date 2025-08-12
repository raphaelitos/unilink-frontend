import * as React from "react"
import type { Tag } from "@/types"

type Props = {
  tag: Tag
  className?: string
}

export function TagPill({ tag, className }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-black ${className ?? ""}`}
      style={{ backgroundColor: tag.color }}
      title={tag.text}
      aria-label={`tag ${tag.text}`}
    >
      {tag.text}
    </span>
  )
}
