import { Injectable } from "@nestjs/common"
import { type Model, Types } from "mongoose"
import type { Project } from "../schemas/project.schema"

@Injectable()
export class ProjectRepository {
  private projectModel: Model<Project>

  constructor(projectModel: Model<Project>) {
    this.projectModel = projectModel
  }

  async create(projectData: Partial<Project>): Promise<Project> {
    const project = new this.projectModel(projectData)
    return project.save()
  }

  async findById(id: string): Promise<Project | null> {
    return this.projectModel
      .findById(new Types.ObjectId(id))
      .populate("owner", "email firstName lastName")
      .populate("teamMembers.userId", "email firstName lastName")
      
      .exec()
  }

  async findByKey(key: string): Promise<Project | null> {
    return this.projectModel.findOne({ key }).exec()
  }

  async findByUserId(userId: string, skip = 0, limit = 10): Promise<[Project[], number]> {
    const query = {
      $or: [{ owner: new Types.ObjectId(userId) }, { "teamMembers.userId": new Types.ObjectId(userId) }],
    }

    const [projects, total] = await Promise.all([
      this.projectModel.find(query).skip(skip).limit(limit).populate("owner", "email firstName lastName").exec(),
      this.projectModel.countDocuments(query),
    ])

    return [projects, total]
  }

  async update(id: string, projectData: Partial<Project>): Promise<Project | null> {
    return this.projectModel.findByIdAndUpdate(new Types.ObjectId(id), projectData, { new: true }).exec()
  }

  async addTeamMember(projectId: string, memberId: string, role: string): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(
        new Types.ObjectId(projectId),
        {
          $addToSet: {
            teamMembers: {
              userId: new Types.ObjectId(memberId),
              role,
              joinedAt: new Date(),
            },
          },
        },
        { new: true },
      )
      
      .exec()
  }

  async removeTeamMember(projectId: string, memberId: string): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(
        new Types.ObjectId(projectId),
        { $pull: { "teamMembers.userId": new Types.ObjectId(memberId) } },
        { new: true },
      )
      
      .exec()
  }
}
