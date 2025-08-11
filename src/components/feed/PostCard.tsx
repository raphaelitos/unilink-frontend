import type { Post } from "@/types"
import { Card } from "@/components/ui/card"
import { PostHeader } from "./PostHeader"
import { PostBody } from "./PostBody"
import { PostMedia } from "./PostMedia"
import { Separator } from "@/components/ui/separator"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <PostHeader project={post.project} createdAt={post.createdAt} />
        <Separator className="my-4" />
        <PostBody caption={post.caption} />
        {post.imageUrl && (
          <>
            <div className="mt-4">
              <PostMedia imageUrl={post.imageUrl} />
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
