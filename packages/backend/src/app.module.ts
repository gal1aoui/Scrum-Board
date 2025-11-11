import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { User, UserSchema } from "./modules/users/schemas/user.schema"
import { Project, ProjectSchema } from "./modules/users/schemas/project.schema"
import { Ticket, TicketSchema } from "./modules/users/schemas/ticket.schema"
import { Sprint, SprintSchema } from "./modules/users/schemas/sprint.schema"
import { UserRepository } from "./modules/users/repositories/user.repository"
import { ProjectRepository } from "./modules/users/repositories/project.repository"
import { TicketRepository } from "./modules/users/repositories/ticket.repository"
import { SprintRepository } from "./modules/users/repositories/sprint.repository"
import { UserService } from "./modules/users/services/user.service"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://localhost:27017/scrum-board", {
      maxPoolSize: 10,
      minPoolSize: 5,
      retryAttempts: 3,
      retryDelay: 1000,
    }),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Ticket.name, schema: TicketSchema },
      { name: Sprint.name, schema: SprintSchema },
    ]),
  ],

  controllers: [AppController],
  providers: [AppService, UserRepository, ProjectRepository, TicketRepository, SprintRepository, UserService],
})
export class AppModule {}
