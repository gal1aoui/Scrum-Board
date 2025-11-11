"use client"

import type React from "react"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

interface CreateProjectModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CreateProjectModal({ onClose, onSuccess }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    key: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createProjectMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create project")
      }

      return response.json()
    },
    onSuccess: () => {
      onSuccess()
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

    if (!formData.name.trim()) newErrors.name = "Project name is required"
    if (formData.name.length < 3) newErrors.name = "Project name must be at least 3 characters"

    if (!formData.key.trim()) newErrors.key = "Project key is required"
    if (!/^[A-Z0-9]+$/.test(formData.key.toUpperCase())) {
      newErrors.key = "Project key must contain only letters and numbers"
    }

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    createProjectMutation.mutate(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create New Project</h2>
          <button
            onClick={onClose}
            disabled={createProjectMutation.isPending}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Project Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="e.g., Mobile App"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background py-2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={createProjectMutation.isPending}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Project description..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border bg-background py-2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              disabled={createProjectMutation.isPending}
            />
          </div>

          {/* Project Key */}
          <div className="space-y-2">
            <label htmlFor="key" className="text-sm font-medium">
              Project Key
            </label>
            <input
              id="key"
              name="key"
              placeholder="e.g., MA"
              value={formData.key}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  key: e.target.value.toUpperCase(),
                }))
              }
              maxLength={10}
              className="w-full rounded-lg border bg-background py-2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 uppercase"
              disabled={createProjectMutation.isPending}
            />
            {errors.key && <p className="text-xs text-destructive">{errors.key}</p>}
            <p className="text-xs text-muted-foreground">Used for ticket IDs like MA-1, MA-2 etc.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={createProjectMutation.isPending}
              className="flex-1 rounded-lg border bg-background py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {createProjectMutation.isPending && <Loader2 size={16} className="animate-spin" />}
              {createProjectMutation.isPending ? "Creating..." : "Create Project"}
            </button>
          </div>

          {/* Error Display */}
          {createProjectMutation.error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {createProjectMutation.error instanceof Error
                ? createProjectMutation.error.message
                : "Failed to create project"}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
