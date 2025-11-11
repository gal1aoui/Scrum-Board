import { Injectable } from "@nestjs/common"
import { type Model, Types } from "mongoose"
import type { Message } from "../schemas/message.schema"

@Injectable()
export class ChatService {
  private messageModel: Model<Message>

  constructor(messageModel: Model<Message>) {
    this.messageModel = messageModel
  }

  async createMessage(messageData: any): Promise<Message> {
    const message = new this.messageModel(messageData)
    return message.save()
  }

  async getProjectMessages(projectId: string, skip = 0, limit = 50): Promise<Message[]> {
    return this.messageModel
      .find({ type: "PROJECT", targetId: new Types.ObjectId(projectId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "firstName lastName avatar")
      .lean()
      .exec()
  }

  async getTicketMessages(ticketId: string, skip = 0, limit = 50): Promise<Message[]> {
    return this.messageModel
      .find({ type: "TICKET", targetId: new Types.ObjectId(ticketId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "firstName lastName avatar")
      .lean()
      .exec()
  }

  async getPrivateMessages(userId: string, otherUserId: string): Promise<Message[]> {
    return this.messageModel
      .find({
        type: "PRIVATE",
        $or: [
          { sender: new Types.ObjectId(userId), targetId: new Types.ObjectId(otherUserId) },
          { sender: new Types.ObjectId(otherUserId), targetId: new Types.ObjectId(userId) },
        ],
      })
      .sort({ createdAt: 1 })
      .populate("sender", "firstName lastName avatar")
      .lean()
      .exec()
  }

  async markAsRead(messageIds: string[], userId: string): Promise<any> {
    return this.messageModel.updateMany(
      { _id: { $in: messageIds } },
      { $addToSet: { readBy: new Types.ObjectId(userId) } },
    )
  }
}
