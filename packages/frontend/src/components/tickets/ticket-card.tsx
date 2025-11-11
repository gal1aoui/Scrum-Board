import { AlertCircle, User } from "lucide-react"
import type { TicketType, TicketPriority, TicketStatus } from "@scrum-board/shared"

interface TicketCardProps {
  id: string
  title: string
  type: TicketType
  priority: TicketPriority
  status: TicketStatus
  assignee?: string
  storyPoints?: number
}

const typeColors: Record<TicketType, string> = {
  STORY: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  TASK: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  BUG: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  IMPROVEMENT: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  SPIKE: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

const priorityColors: Record<TicketPriority, string> = {
  LOW: "text-gray-500",
  MEDIUM: "text-yellow-600",
  HIGH: "text-orange-600",
  CRITICAL: "text-red-600",
}

export default function TicketCard({ id, title, type, priority, status, assignee, storyPoints }: TicketCardProps) {
  return (
    <div className="rounded-lg border bg-card p-3 transition-shadow hover:shadow-md cursor-move hover:border-primary">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm line-clamp-2 flex-1">{title}</h4>

          {storyPoints && (
            <div className="rounded-full bg-primary/20 px-2 py-1 text-xs font-semibold text-primary whitespace-nowrap">
              {storyPoints}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${typeColors[type]}`}>{type}</span>

          {priority !== "MEDIUM" && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${priorityColors[priority]}`}>
              <AlertCircle size={12} />
              {priority}
            </span>
          )}
        </div>

        {assignee && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground border-t pt-2">
            <User size={14} />
            <span className="truncate">{assignee}</span>
          </div>
        )}
      </div>
    </div>
  )
}
