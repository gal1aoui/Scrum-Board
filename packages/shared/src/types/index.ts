export * from "./user"
export * from "./project"
export * from "./ticket"
export * from "./sprint"

export interface IApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
  }
  timestamp: string
}

export interface IPaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
