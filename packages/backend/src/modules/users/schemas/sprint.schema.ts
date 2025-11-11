import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
import { SprintStatus } from "@scrum-board/shared"

@Schema({ timestamps: true })
export class Sprint extends Document {
  @Prop({ type: Types.ObjectId, ref: "Project", required: true })
  projectId: Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop()
  description?: string

  @Prop({ enum: SprintStatus, default: SprintStatus.PLANNING })
  status: SprintStatus

  @Prop({ required: true, type: Date })
  startDate: Date

  @Prop({ required: true, type: Date })
  endDate: Date

  @Prop()
  goal?: string

  @Prop([{ type: Types.ObjectId, ref: "Ticket" }])
  tickets: Types.ObjectId[]

  @Prop()
  velocity?: number

  @Prop({ type: Object, default: {} })
  retrospective: {
    whatWentWell?: string[]
    whatWentWrong?: string[]
    improvements?: string[]
  }

  createdAt: Date
  updatedAt: Date
}

export const SprintSchema = SchemaFactory.createForClass(Sprint)
