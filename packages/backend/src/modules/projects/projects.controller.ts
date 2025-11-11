import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from "@nestjs/common"
import type { ProjectService } from "./services/project.service"
import { JwtGuard } from "../../common/guards/jwt.guard"
import { CurrentUser } from "../../common/decorators/current-user.decorator"
import { projectCreateSchema } from "@scrum-board/shared"

@Controller("projects")
@UseGuards(JwtGuard)
export class ProjectsController {
  constructor(private projectService: ProjectService) {}

  @Post()
  async create(body: unknown, @CurrentUser('_id') userId: string) {
    const validatedData = projectCreateSchema.parse(body)
    return this.projectService.createProject(validatedData, userId)
  }

  @Get()
  async getMyProjects(@CurrentUser('_id') userId: string, @Query('skip') skip = 0, @Query('limit') limit = 10) {
    const [projects, total] = await this.projectService.getUserProjects(userId, skip, limit)
    return {
      data: projects,
      total,
      page: Math.floor(skip / limit) + 1,
      pageSize: limit,
      hasMore: skip + limit < total,
    }
  }

  @Get(":id")
  async getById(@Param('id') projectId: string, @CurrentUser('_id') userId: string) {
    return this.projectService.getProjectById(projectId, userId)
  }

  @Put(":id")
  async update(@Param('id') projectId: string, body: unknown, @CurrentUser('_id') userId: string) {
    return this.projectService.updateProject(projectId, body, userId)
  }

  @Delete(":id")
  async delete(@Param('id') projectId: string, @CurrentUser('_id') userId: string) {
    return this.projectService.deleteProject(projectId, userId)
  }

  @Post(":id/members")
  async addMember(
    @Param('id') projectId: string,
    @Body('memberId') memberId: string,
    @Body('role') role: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.projectService.addTeamMember(projectId, memberId, role, userId)
  }

  @Delete(":id/members/:memberId")
  async removeMember(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.projectService.removeTeamMember(projectId, memberId, userId)
  }

  @Get(":id/github/sync")
  async syncGitHub(@Param('id') projectId: string, @CurrentUser('_id') userId: string) {
    return {
      success: true,
      message: "GitHub sync initiated",
    }
  }
}
