import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
import { TicketType, TicketStatus, TicketPriority } from "@scrum-board/shared"

@Schema({ _id: false })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: "User" })
  author: Types.ObjectId

  @Prop({ required: true })
  content: string

  @Prop([{ type: Types.ObjectId, ref: "User" }])
  mentions: Types.ObjectId[]

  @Prop({ type: Date, default: Date.now })
  createdAt: Date

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date
}

@Schema({ _id: false })
export class Activity {
  @Prop({ type: Types.ObjectId, ref: "User" })
  author: Types.ObjectId

  @Prop({ required: true })
  action: string

  @Prop({ type: Object })
  changes: Record<string, { from: unknown; to: unknown }>

  @Prop({ type: Date, default: Date.now })
  timestamp: Date
}

@Schema({ timestamps: true })
export class Ticket extends Document {
  @Prop({ type: Types.ObjectId, ref: "Project", required: true })
  projectId: Types.ObjectId

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ enum: TicketType, required: true })
  type: TicketType

  @Prop({ enum: TicketStatus, default: TicketStatus.BACKLOG })
  status: TicketStatus

  @Prop({ enum: TicketPriority, default: TicketPriority.MEDIUM })
  priority: TicketPriority

  @Prop({ type: Types.ObjectId, ref: "User" })
  assignee?: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  reporter: Types.ObjectId

  @Prop()
  storyPoints?: number

  @Prop({ type: Types.ObjectId, ref: "Sprint" })
  sprint?: Types.ObjectId

  @Prop([String])
  attachments: string[]

  @Prop([Comment])
  comments: Comment[]

  @Prop([Activity])
  activity: Activity[]

  @Prop({ type: Object, default: {} })
  labels: Record<string, string>

  createdAt: Date
  updatedAt: Date
}

export const TicketSchema = SchemaFactory.createForClass(Ticket)
