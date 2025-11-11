import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
} from "@nestjs/websockets"
import type { Server, Socket } from "socket.io"
import type { ChatService } from "./services/chat.service"

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private userSockets = new Map<string, string>() // userId -> socketId

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
    for (const [userId, socketId] of this.userSockets) {
      if (socketId === client.id) {
        this.userSockets.delete(userId)
      }
    }
  }

  @SubscribeMessage("user:login")
  handleUserLogin(client: Socket, userId: string) {
    this.userSockets.set(userId, client.id)
    console.log(`User ${userId} logged in`)
  }

  @SubscribeMessage("chat:send")
  async handleMessage(client: Socket, payload: any) {
    const { userId, content, type, targetId } = payload

    const message = await this.chatService.createMessage({
      sender: userId,
      content,
      type,
      targetId,
      mentions: [],
      readBy: [userId],
      attachments: [],
    })

    if (type === "PROJECT") {
      this.server.emit(`project:${targetId}:message`, {
        _id: message._id,
        sender: userId,
        content,
        createdAt: message.createdAt,
      })
    } else if (type === "TICKET") {
      this.server.emit(`ticket:${targetId}:message`, {
        _id: message._id,
        sender: userId,
        content,
        createdAt: message.createdAt,
      })
    } else if (type === "PRIVATE") {
      const recipientSocketId = this.userSockets.get(targetId)
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit("chat:message", {
          _id: message._id,
          sender: userId,
          content,
          createdAt: message.createdAt,
        })
      }
    }

    client.emit("chat:sent", { success: true })
  }

  @SubscribeMessage("chat:join_project")
  handleJoinProject(client: Socket, projectId: string) {
    client.join(`project:${projectId}`)
    console.log(`Client ${client.id} joined project ${projectId}`)
  }

  @SubscribeMessage("chat:leave_project")
  handleLeaveProject(client: Socket, projectId: string) {
    client.leave(`project:${projectId}`)
    console.log(`Client ${client.id} left project ${projectId}`)
  }

  @SubscribeMessage("notification:subscribe")
  handleNotificationSubscribe(client: Socket, userId: string) {
    client.join(`user:${userId}:notifications`)
  }
}
