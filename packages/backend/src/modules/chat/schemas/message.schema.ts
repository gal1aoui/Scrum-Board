import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  sender: Types.ObjectId

  @Prop({ required: true })
  content: string

  @Prop({ type: String, enum: ["PROJECT", "TICKET", "PRIVATE"], required: true })
  type: "PROJECT" | "TICKET" | "PRIVATE"

  @Prop({ type: Types.ObjectId })
  targetId?: Types.ObjectId // projectId or ticketId or userId for private

  @Prop([{ type: Types.ObjectId, ref: "User" }])
  mentions: Types.ObjectId[]

  @Prop([{ type: Types.ObjectId, ref: "User" }])
  readBy: Types.ObjectId[]

  @Prop([String])
  attachments: string[]

  createdAt: Date
  updatedAt: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message)
