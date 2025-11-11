import { ProjectRepository } from "@/modules/users/repositories/project.repository"
import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { ProjectStatus, type IProjectCreate } from "@scrum-board/shared"
import { Types } from "mongoose"

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  async createProject(projectData: IProjectCreate, userId: string): Promise<any> {
    const projectKey = projectData.key.toUpperCase()

    return this.projectRepository.create({
      name: projectData.name,
      description: projectData.description,
      key: projectKey,
      owner: new Types.ObjectId(userId),
      teamMembers: [
        {
          userId: new Types.ObjectId(userId),
          role: "SUPERVISOR",
          joinedAt: new Date(),
        },
      ],
      metadata: {},
    })
  }

  async getProjectById(projectId: string, userId: string): Promise<any> {
    const project = await this.projectRepository.findById(projectId)
    if (!project) {
      throw new NotFoundException("Project not found")
    }

    const hasAccess =
      project.owner.toString() === userId || project.teamMembers.some((m) => m.userId.toString() === userId)

    if (!hasAccess) {
      throw new ForbiddenException("Access denied")
    }

    return project
  }

  async getUserProjects(userId: string, skip = 0, limit = 10): Promise<[any[], number]> {
    return this.projectRepository.findByUserId(userId, skip, limit)
  }

  async updateProject(projectId: string, updateData: Partial<any>, userId: string): Promise<any> {
    const project = await this.projectRepository.findById(projectId)
    if (!project) {
      throw new NotFoundException("Project not found")
    }

    if (project.owner.toString() !== userId) {
      throw new ForbiddenException("Only project owner can update")
    }

    return this.projectRepository.update(projectId, updateData)
  }

  async deleteProject(projectId: string, userId: string): Promise<{ success: boolean }> {
    const project = await this.projectRepository.findById(projectId)
    if (!project) {
      throw new NotFoundException("Project not found")
    }

    if (project.owner.toString() !== userId) {
      throw new ForbiddenException("Only project owner can delete")
    }

    await this.projectRepository.update(projectId, {
      status: ProjectStatus.ARCHIVED,
    })

    return { success: true }
  }

  async addTeamMember(projectId: string, memberId: string, role: string, userId: string): Promise<any> {
    const project = await this.projectRepository.findById(projectId)
    if (!project) {
      throw new NotFoundException("Project not found")
    }

    if (project.owner.toString() !== userId) {
      throw new ForbiddenException("Only project owner can add members")
    }

    return this.projectRepository.addTeamMember(projectId, memberId, role)
  }

  async removeTeamMember(projectId: string, memberId: string, userId: string): Promise<any> {
    const project = await this.projectRepository.findById(projectId)
    if (!project) {
      throw new NotFoundException("Project not found")
    }

    if (project.owner.toString() !== userId) {
      throw new ForbiddenException("Only project owner can remove members")
    }

    return this.projectRepository.removeTeamMember(projectId, memberId)
  }
}
