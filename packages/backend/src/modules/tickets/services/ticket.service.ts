import { ProjectRepository } from "@/modules/users/repositories/project.repository"
import { TicketRepository } from "@/modules/users/repositories/ticket.repository"
import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { type ITicketCreate, TicketStatus } from "@scrum-board/shared"
import { Types } from "mongoose"

@Injectable()
export class TicketService {
  constructor(
    private ticketRepository: TicketRepository,
    private projectRepository: ProjectRepository,
  ) {}

  async createTicket(projectId: string, ticketData: ITicketCreate, userId: string): Promise<any> {
    const project = await this.projectRepository.findById(projectId)
    if (!project) {
      throw new NotFoundException("Project not found")
    }

    return this.ticketRepository.create({
      projectId: new Types.ObjectId(projectId),
      title: ticketData.title,
      description: ticketData.description,
      type: ticketData.type,
      priority: ticketData.priority,
      assignee: ticketData.assignee ? new Types.ObjectId(ticketData.assignee) : undefined,
      reporter: new Types.ObjectId(userId),
      storyPoints: ticketData.storyPoints,
      status: TicketStatus.BACKLOG,
      attachments: [],
      comments: [],
      activity: [],
      labels: {},
    })
  }

  async getTicketById(ticketId: string): Promise<any> {
    const ticket = await this.ticketRepository.findById(ticketId)
    if (!ticket) {
      throw new NotFoundException("Ticket not found")
    }

    return ticket
  }

  async getProjectTickets(projectId: string, skip = 0, limit = 20): Promise<[any[], number]> {
    return this.ticketRepository.findByProjectId(projectId, skip, limit)
  }

  async getTicketsByStatus(projectId: string, status: TicketStatus): Promise<any[]> {
    return this.ticketRepository.findByStatus(projectId, status)
  }

  async updateTicket(ticketId: string, updateData: Partial<any>, userId: string): Promise<any> {
    const ticket = await this.ticketRepository.findById(ticketId)
    if (!ticket) {
      throw new NotFoundException("Ticket not found")
    }

    if (updateData.status || updateData.assignee) {
      const changes: Record<string, { from: any; to: any }> = {}

      if (updateData.status) {
        changes.status = { from: ticket.status, to: updateData.status }
      }

      if (updateData.assignee) {
        changes.assignee = { from: ticket.assignee, to: updateData.assignee }
      }

      await this.ticketRepository.addActivity(ticketId, {
        author: new Types.ObjectId(userId),
        action: "UPDATED",
        changes,
        timestamp: new Date(),
      })
    }

    return this.ticketRepository.update(ticketId, updateData)
  }

  async addComment(ticketId: string, content: string, userId: string, mentions: string[] = []): Promise<any> {
    const ticket = await this.ticketRepository.findById(ticketId)
    if (!ticket) {
      throw new NotFoundException("Ticket not found")
    }

    const comment = {
      author: new Types.ObjectId(userId),
      content,
      mentions: mentions.map((m) => new Types.ObjectId(m)),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this.ticketRepository.addComment(ticketId, comment)
  }

  async deleteTicket(ticketId: string, userId: string): Promise<{ success: boolean }> {
    const ticket = await this.ticketRepository.findById(ticketId)
    if (!ticket) {
      throw new NotFoundException("Ticket not found")
    }

    if (ticket.reporter.toString() !== userId) {
      throw new ForbiddenException("Only ticket reporter can delete")
    }

    await this.ticketRepository.delete(ticketId)
    return { success: true }
  }
}
