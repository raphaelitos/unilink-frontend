import type { Post } from "@/types"
import { FeedList } from "./FeedList"
import { EmptyState } from "./EmptyState"
import { ErrorState } from "./ErrorState"

interface FeedProps {
  posts: Post[]
  error?: string
  loading?: boolean
}

export function Feed({ posts, error, loading }: FeedProps) {
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[700px] mx-auto px-4 py-8">
          <ErrorState message={error} />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[700px] mx-auto px-4 py-8">
          <div className="space-y-6">{/* Loading skeletons would go here */}</div>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[700px] mx-auto px-4 py-8">
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[700px] mx-auto px-4 py-8">
        <FeedList posts={posts} />
      </div>
    </div>
  )
}
