import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ProjectsController } from "./projects.controller"
import { ProjectService } from "./services/project.service"
import { Project, ProjectSchema } from "../users/schemas/project.schema"
import { ProjectRepository } from "../users/repositories/project.repository"

@Module({
  imports: [MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }])],
  controllers: [ProjectsController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectsModule {}
