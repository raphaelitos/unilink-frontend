import type { Project } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink } from "lucide-react"

interface PostHeaderProps {
  project: Project
  createdAt: string
}

export function PostHeader({ project, createdAt }: PostHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={project.photo || "/placeholder.svg"} alt={project.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(project.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1 group"
          >
            {project.name}
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <span className="text-sm text-muted-foreground">{formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
