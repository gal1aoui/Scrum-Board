import { Injectable } from "@nestjs/common"
import { type Model, Types } from "mongoose"
import type { Sprint } from "../schemas/sprint.schema"

@Injectable()
export class SprintRepository {
  constructor(private sprintModel: Model<Sprint>) {}

  async create(sprintData: Partial<Sprint>): Promise<Sprint> {
    const sprint = new this.sprintModel(sprintData)
    return sprint.save()
  }

  async findById(id: string): Promise<Sprint | null> {
    return this.sprintModel
      .findById(new Types.ObjectId(id))
      .populate("projectId", "name key")
      .populate("tickets")
      .lean()
      .exec()
  }

  async findByProjectId(projectId: string): Promise<Sprint[]> {
    return this.sprintModel
      .find({ projectId: new Types.ObjectId(projectId) })
      .sort({ startDate: -1 })
      .lean()
      .exec()
  }

  async findActiveSprint(projectId: string): Promise<Sprint | null> {
    return this.sprintModel
      .findOne({
        projectId: new Types.ObjectId(projectId),
        status: { $in: ["ACTIVE", "REVIEW"] },
      })
      .lean()
      .exec()
  }

  async update(id: string, sprintData: Partial<Sprint>): Promise<Sprint | null> {
    return this.sprintModel.findByIdAndUpdate(new Types.ObjectId(id), sprintData, { new: true }).lean().exec()
  }

  async addTicket(sprintId: string, ticketId: string): Promise<Sprint | null> {
    return this.sprintModel
      .findByIdAndUpdate(
        new Types.ObjectId(sprintId),
        { $addToSet: { tickets: new Types.ObjectId(ticketId) } },
        { new: true },
      )
      .lean()
      .exec()
  }

  async removeTicket(sprintId: string, ticketId: string): Promise<Sprint | null> {
    return this.sprintModel
      .findByIdAndUpdate(
        new Types.ObjectId(sprintId),
        { $pull: { tickets: new Types.ObjectId(ticketId) } },
        { new: true },
      )
      .lean()
      .exec()
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.sprintModel.deleteOne({ _id: new Types.ObjectId(id) }).exec()
    return result.deletedCount > 0
  }
}
