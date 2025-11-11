import { Injectable } from "@nestjs/common"
import { type Model, Types } from "mongoose"
import type { Ticket } from "../schemas/ticket.schema"
import type { TicketStatus } from "@scrum-board/shared"

@Injectable()
export class TicketRepository {
  private ticketModel: Model<Ticket>

  constructor(ticketModel: Model<Ticket>) {
    this.ticketModel = ticketModel
  }

  async create(ticketData: Partial<Ticket>): Promise<Ticket> {
    const ticket = new this.ticketModel(ticketData)
    return ticket.save()
  }

  async findById(id: string): Promise<Ticket | null> {
    return this.ticketModel
      .findById(new Types.ObjectId(id))
      .populate("projectId", "name key")
      .populate("assignee", "email firstName lastName")
      .populate("reporter", "email firstName lastName")
      .populate("sprint", "name")
      .exec()
  }

  async findByProjectId(projectId: string, skip = 0, limit = 20): Promise<[Ticket[], number]> {
    const [tickets, total] = await Promise.all([
      this.ticketModel
        .find({ projectId: new Types.ObjectId(projectId) })
        .skip(skip)
        .limit(limit)
        .populate("assignee", "email firstName lastName")
        .exec(),
      this.ticketModel.countDocuments({ projectId: new Types.ObjectId(projectId) }),
    ])

    return [tickets, total]
  }

  async findBySprintId(sprintId: string): Promise<Ticket[]> {
    return this.ticketModel
      .find({ sprint: new Types.ObjectId(sprintId) })
      .populate("assignee", "email firstName lastName")
      .exec()
  }

  async findByStatus(projectId: string, status: TicketStatus): Promise<Ticket[]> {
    return this.ticketModel
      .find({
        projectId: new Types.ObjectId(projectId),
        status,
      })
      .populate("assignee", "email firstName lastName")
      .exec()
  }

  async update(id: string, ticketData: Partial<Ticket>): Promise<Ticket | null> {
    return this.ticketModel.findByIdAndUpdate(new Types.ObjectId(id), ticketData, { new: true }).exec()
  }

  async addComment(ticketId: string, comment: any): Promise<Ticket | null> {
    return this.ticketModel
      .findByIdAndUpdate(new Types.ObjectId(ticketId), { $push: { comments: comment } }, { new: true })
      .exec()
  }

  async addActivity(ticketId: string, activity: any): Promise<Ticket | null> {
    return this.ticketModel
      .findByIdAndUpdate(new Types.ObjectId(ticketId), { $push: { activity: activity } }, { new: true })
      .exec()
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.ticketModel.deleteOne({ _id: new Types.ObjectId(id) }).exec()
    return result.deletedCount > 0
  }
}
