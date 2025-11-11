import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { TicketsController } from "./tickets.controller"
import { TicketService } from "./services/ticket.service"
import { Ticket, TicketSchema } from "../users/schemas/ticket.schema"
import { TicketRepository } from "../users/repositories/ticket.repository"

@Module({
  imports: [MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }])],
  controllers: [TicketsController],
  providers: [TicketService, TicketRepository],
  exports: [TicketService],
})
export class TicketsModule {}
