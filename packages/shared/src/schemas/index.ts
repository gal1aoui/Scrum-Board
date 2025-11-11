import { z } from "zod"

// User Schemas
export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const userRegisterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
})

// Project Schemas
export const projectCreateSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  key: z
    .string()
    .min(2)
    .max(10)
    .regex(/^[A-Z0-9]+$/),
})

// Ticket Schemas
export const ticketCreateSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().max(2000),
  type: z.enum(["STORY", "TASK", "BUG", "IMPROVEMENT", "SPIKE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  assignee: z.string().optional(),
  storyPoints: z.number().min(0).max(100).optional(),
})

export const ticketUpdateSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  status: z.enum(["BACKLOG", "TO_DO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  assignee: z.string().optional(),
  storyPoints: z.number().min(0).max(100).optional(),
})
