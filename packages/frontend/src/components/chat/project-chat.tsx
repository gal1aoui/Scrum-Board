"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, Paperclip } from "lucide-react"
import { useAuth } from "../../hooks/use-auth"
import { useSocket } from "../../hooks/use-socket"

interface ProjectChatProps {
  projectId: string
}

interface Message {
  _id: string
  sender: string
  content: string
  createdAt: Date
}

export default function ProjectChat({ projectId }: ProjectChatProps) {
  const { user } = useAuth()
  const { joinProjectChat, leaveProjectChat, sendMessage, subscribeToProjectMessages } = useSocket(user?._id || "")

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/chat/project/${projectId}/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
    joinProjectChat(projectId)

    const unsubscribe = subscribeToProjectMessages(projectId, (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      leaveProjectChat(projectId)
      unsubscribe()
    }
  }, [projectId])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim() || !user) return

    sendMessage(inputValue, "PROJECT", projectId)
    setInputValue("")
  }

  return (
    <div className="flex flex-col h-[500px] rounded-lg border bg-card">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-muted-foreground">No messages yet</p>
        ) : (
          messages.map((message) => (
            <div key={message._id} className={`flex ${message.sender === user?._id ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  message.sender === user?._id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">{new Date(message.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <button type="button" className="rounded-lg hover:bg-muted p-2" title="Attach file">
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type message..."
            className="flex-1 rounded-lg border bg-background py-2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}
