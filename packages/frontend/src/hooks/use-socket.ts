"use client"

import { useEffect, useRef, useCallback } from "react"
import { io, type Socket } from "socket.io-client"

export const useSocket = (userId: string) => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    })

    socketRef.current.on("connect", () => {
      console.log("Socket connected")
      socketRef.current?.emit("user:login", userId)
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [userId])

  const joinProjectChat = useCallback((projectId: string) => {
    socketRef.current?.emit("chat:join_project", projectId)
  }, [])

  const leaveProjectChat = useCallback((projectId: string) => {
    socketRef.current?.emit("chat:leave_project", projectId)
  }, [])

  const sendMessage = useCallback(
    (content: string, type: "PROJECT" | "TICKET" | "PRIVATE", targetId: string) => {
      socketRef.current?.emit("chat:send", {
        userId,
        content,
        type,
        targetId,
      })
    },
    [userId],
  )

  const subscribeToProjectMessages = useCallback((projectId: string, callback: (message: any) => void) => {
    socketRef.current?.on(`project:${projectId}:message`, callback)

    return () => {
      socketRef.current?.off(`project:${projectId}:message`, callback)
    }
  }, [])

  const subscribeToPrivateMessages = useCallback((callback: (message: any) => void) => {
    socketRef.current?.on("chat:message", callback)

    return () => {
      socketRef.current?.off("chat:message", callback)
    }
  }, [])

  return {
    socket: socketRef.current,
    joinProjectChat,
    leaveProjectChat,
    sendMessage,
    subscribeToProjectMessages,
    subscribeToPrivateMessages,
  }
}
