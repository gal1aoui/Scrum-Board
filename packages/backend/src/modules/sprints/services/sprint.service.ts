import { SprintRepository } from "@/modules/users/repositories/sprint.repository"
import { TicketRepository } from "@/modules/users/repositories/ticket.repository"
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { type ISprintCreate, SprintStatus } from "@scrum-board/shared"
import { Types } from "mongoose"

@Injectable()
export class SprintService {
  constructor(
    private sprintRepository: SprintRepository,
    private ticketRepository: TicketRepository,
  ) {}

  async createSprint(projectId: string, sprintData: ISprintCreate): Promise<any> {
    if (sprintData.endDate <= sprintData.startDate) {
      throw new BadRequestException("End date must be after start date")
    }

    return this.sprintRepository.create({
      projectId: new Types.ObjectId(projectId),
      name: sprintData.name,
      description: sprintData.description,
      status: SprintStatus.PLANNING,
      startDate: sprintData.startDate,
      endDate: sprintData.endDate,
      goal: sprintData.goal,
      tickets: [],
      retrospective: {
        whatWentWell: [],
        whatWentWrong: [],
        improvements: [],
      },
    })
  }

  async getSprintById(sprintId: string): Promise<any> {
    const sprint = await this.sprintRepository.findById(sprintId)
    if (!sprint) {
      throw new NotFoundException("Sprint not found")
    }

    return sprint
  }

  async getProjectSprints(projectId: string): Promise<any[]> {
    return this.sprintRepository.findByProjectId(projectId)
  }

  async getActiveSprint(projectId: string): Promise<any | null> {
    return this.sprintRepository.findActiveSprint(projectId)
  }

  async updateSprint(sprintId: string, updateData: Partial<any>): Promise<any> {
    const sprint = await this.sprintRepository.findById(sprintId)
    if (!sprint) {
      throw new NotFoundException("Sprint not found")
    }

    return this.sprintRepository.update(sprintId, updateData)
  }

  async addTicketToSprint(sprintId: string, ticketId: string): Promise<any> {
    const sprint = await this.sprintRepository.findById(sprintId)
    if (!sprint) {
      throw new NotFoundException("Sprint not found")
    }

    return this.sprintRepository.addTicket(sprintId, ticketId)
  }

  async removeTicketFromSprint(sprintId: string, ticketId: string): Promise<any> {
    return this.sprintRepository.removeTicket(sprintId, ticketId)
  }

  async calculateVelocity(sprintId: string): Promise<number> {
    const sprint = await this.sprintRepository.findById(sprintId)
    if (!sprint) {
      throw new NotFoundException("Sprint not found")
    }

    const totalStoryPoints = sprint.tickets.reduce((sum: number, ticket: any) => {
      return sum + (ticket.storyPoints || 0)
    }, 0)

    return totalStoryPoints
  }

  async closeSprint(sprintId: string): Promise<any> {
    const sprint = await this.sprintRepository.findById(sprintId)
    if (!sprint) {
      throw new NotFoundException("Sprint not found")
    }

    const velocity = await this.calculateVelocity(sprintId)

    return this.sprintRepository.update(sprintId, {
      status: SprintStatus.CLOSED,
      velocity,
    })
  }
}
