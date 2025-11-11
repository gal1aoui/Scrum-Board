import { Controller, Get, Post, Put, Delete, UseGuards } from "@nestjs/common"
import type { TicketService } from "./services/ticket.service"
import { JwtGuard } from "../../common/guards/jwt.guard"
import { ITicketCreate, ticketCreateSchema, TicketStatus, TicketType, ticketUpdateSchema } from "@scrum-board/shared"

@Controller("tickets")
@UseGuards(JwtGuard)
export class TicketsController {
  constructor(private ticketService: TicketService) {}

  @Post(":projectId")
  async create(projectId: string, body: unknown, userId: string) {
    const validatedData = ticketCreateSchema.parse(body) as Omit<ITicketCreate, 'type'> & { type: TicketType }
    return this.ticketService.createTicket(projectId, validatedData, userId)
  }

  @Get("project/:projectId")
  async getProjectTickets(projectId: string, skip = 0, limit = 20, status?: TicketStatus) {
    if (status) {
      const tickets = await this.ticketService.getTicketsByStatus(projectId, status)
      return {
        data: tickets,
        total: tickets.length,
        hasMore: false,
      }
    }

    const [tickets, total] = await this.ticketService.getProjectTickets(projectId, skip, limit)

    return {
      data: tickets,
      total,
      page: Math.floor(skip / limit) + 1,
      pageSize: limit,
      hasMore: skip + limit < total,
    }
  }

  @Get(":id")
  async getById(ticketId: string) {
    return this.ticketService.getTicketById(ticketId)
  }

  @Put(":id")
  async update(ticketId: string, body: unknown, userId: string) {
    const validatedData = ticketUpdateSchema.parse(body)
    return this.ticketService.updateTicket(ticketId, validatedData, userId)
  }

  @Delete(":id")
  async delete(ticketId: string, userId: string) {
    return this.ticketService.deleteTicket(ticketId, userId)
  }

  @Post(":id/comments")
  async addComment(ticketId: string, content: string, mentions: string[] = [], userId: string) {
    return this.ticketService.addComment(ticketId, content, userId, mentions)
  }

  @Get("sprint/:sprintId")
  async getSprintTickets(sprintId: string) {
    return { data: [] }
  }
}
