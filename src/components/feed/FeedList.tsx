import type { Post } from "@/types"
import { PostCard } from "./PostCard"

interface FeedListProps {
  posts: Post[]
}

export function FeedList({ posts }: FeedListProps) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
