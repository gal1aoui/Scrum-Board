import { Link } from "react-router-dom"
import { Users, GitBranch, MoreVertical } from "lucide-react"

interface ProjectCardProps {
  id: string
  name: string
  description: string
  key: string
  memberCount: number
  status: string
  githubRepo?: string
}

export default function ProjectCard({ id, name, description, key, memberCount, status, githubRepo }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${id}`}
      className="group rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:border-primary"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
              {key}
            </span>
            <span className="text-xs font-medium text-muted-foreground capitalize">{status}</span>
          </div>

          <h3 className="mt-2 text-lg font-semibold group-hover:text-primary">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        <button className="text-muted-foreground hover:text-foreground">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Users size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{memberCount}</span>
          </div>

          {githubRepo && (
            <div className="flex items-center gap-1">
              <GitBranch size={16} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground truncate">{githubRepo}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
