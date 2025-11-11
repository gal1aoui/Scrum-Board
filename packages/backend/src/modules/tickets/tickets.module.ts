import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TicketsController } from "./tickets.controller"
import { TicketService } from "./services/ticket.service"
import { TicketRepository } from "./repositories/ticket.repository"
import { Ticket, TicketSchema } from "../users/schemas/ticket.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }])],
  controllers: [TicketsController],
  providers: [TicketService, TicketRepository],
  exports: [TicketService],
})
export class TicketsModule {}
