export enum TicketType {
  STORY = "STORY",
  TASK = "TASK",
  BUG = "BUG",
  IMPROVEMENT = "IMPROVEMENT",
  SPIKE = "SPIKE",
}

export enum TicketStatus {
  BACKLOG = "BACKLOG",
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface ITicket {
  _id: string
  projectId: string
  title: string
  description: string
  type: TicketType
  status: TicketStatus
  priority: TicketPriority
  assignee?: string // userId
  reporter: string // userId
  storyPoints?: number
  sprint?: string // sprintId
  attachments: string[]
  comments: IComment[]
  activity: IActivity[]
  createdAt: Date
  updatedAt: Date
}

export interface IComment {
  _id: string
  author: string // userId
  content: string
  mentions: string[] // userIds
  createdAt: Date
  updatedAt: Date
}

export interface IActivity {
  _id: string
  author: string // userId
  action: string
  changes: Record<string, { from: unknown; to: unknown }>
  timestamp: Date
}

export interface ITicketCreate {
  title: string
  description: string
  type: TicketType
  priority: TicketPriority
  assignee?: string
  storyPoints?: number
}
