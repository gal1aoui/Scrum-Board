export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
  ON_HOLD = "ON_HOLD",
}

export interface IProject {
  _id: string
  name: string
  description: string
  status: ProjectStatus
  key: string // e.g., "SB", "PROJ"
  owner: string // userId
  teamMembers: IProjectMember[]
  githubRepo?: string
  createdAt: Date
  updatedAt: Date
}

export interface IProjectMember {
  userId: string
  role: "SUPERVISOR" | "SCRUM_MASTER" | "DEVELOPER" | "TESTER" | "DESIGNER"
  joinedAt: Date
}

export interface IProjectCreate {
  name: string
  description: string
  key: string
  teamMembers?: IProjectMember[]
}
