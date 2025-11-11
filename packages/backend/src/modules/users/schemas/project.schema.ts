import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
import { ProjectStatus } from "@scrum-board/shared"

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true, unique: true })
  key: string

  @Prop({ enum: ProjectStatus, default: ProjectStatus.ACTIVE })
  status: ProjectStatus

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  owner: Types.ObjectId

  @Prop([
    {
      userId: { type: Types.ObjectId, ref: "User" },
      role: String,
      joinedAt: { type: Date, default: Date.now },
    },
  ])
  teamMembers: Array<{
    userId: Types.ObjectId
    role: string
    joinedAt: Date
  }>

  @Prop()
  githubRepo?: string

  @Prop()
  githubToken?: string

  @Prop({ type: Object, default: {} })
  metadata: Record<string, unknown>

  createdAt: Date
  updatedAt: Date
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
