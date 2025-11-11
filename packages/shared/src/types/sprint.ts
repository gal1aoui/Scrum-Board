export enum SprintStatus {
  PLANNING = "PLANNING",
  ACTIVE = "ACTIVE",
  REVIEW = "REVIEW",
  CLOSED = "CLOSED",
}

export interface ISprint {
  _id: string
  projectId: string
  name: string
  description?: string
  status: SprintStatus
  startDate: Date
  endDate: Date
  goal?: string
  tickets: string[] // ticketIds
  velocity?: number
  createdAt: Date
  updatedAt: Date
}

export interface ISprintCreate {
  name: string
  description?: string
  startDate: Date
  endDate: Date
  goal?: string
}
