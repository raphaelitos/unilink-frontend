import { FileText } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet</h3>
      <p className="text-muted-foreground max-w-md">
        Extension projects havent shared any updates yet. Check back later to see the latest research and project
        developments.
      </p>
    </div>
  )
}
