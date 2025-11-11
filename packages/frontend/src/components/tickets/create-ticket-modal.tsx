"use client"

import type React from "react"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import type { TicketType, TicketPriority } from "@scrum-board/shared"

interface CreateTicketModalProps {
  projectId: string
  initialStatus?: string
  onClose: () => void
  onSuccess: () => void
}

const TICKET_TYPES: TicketType[] = ["STORY", "TASK", "BUG", "IMPROVEMENT", "SPIKE"]
const PRIORITIES: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

export default function CreateTicketModal({ projectId, initialStatus, onClose, onSuccess }: CreateTicketModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "TASK" as TicketType,
    priority: "MEDIUM" as TicketPriority,
    storyPoints: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createTicketMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`http://localhost:3000/api/tickets/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create ticket")
      }

      return response.json()
    },
    onSuccess: () => {
      onSuccess()
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "storyPoints" ? Number.parseInt(value) : value,
    }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (formData.title.length < 5) newErrors.title = "Title must be at least 5 characters"

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    createTicketMutation.mutate(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create Ticket</h2>
          <button
            onClick={onClose}
            disabled={createTicketMutation.isPending}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                name="title"
                placeholder="Ticket title..."
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-lg border bg-background py-2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={createTicketMutation.isPending}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border bg-background py-2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={createTicketMutation.isPending}
              >
                {TICKET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-lg border bg-background py-2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={createTicketMutation.isPending}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Story Points */}
            <div className="space-y-2">
              <label htmlFor="storyPoints" className="text-sm font-medium">
                Story Points
              </label>
              <input
                id="storyPoints"
                name="storyPoints"
                type="number"
                min="0"
                max="100"
                value={formData.storyPoints}
                onChange={handleChange}
                className="w-full rounded-lg border bg-background py-2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={createTicketMutation.isPending}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Detailed description..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border bg-background py-2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                disabled={createTicketMutation.isPending}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={createTicketMutation.isPending}
              className="flex-1 rounded-lg border bg-background py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTicketMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {createTicketMutation.isPending && <Loader2 size={16} className="animate-spin" />}
              {createTicketMutation.isPending ? "Creating..." : "Create Ticket"}
            </button>
          </div>

          {/* Error Display */}
          {createTicketMutation.error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {createTicketMutation.error instanceof Error
                ? createTicketMutation.error.message
                : "Failed to create ticket"}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
