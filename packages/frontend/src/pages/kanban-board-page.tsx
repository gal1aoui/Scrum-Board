"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { Settings } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import KanbanColumn from "../components/kanban/kanban-column"
import CreateTicketModal from "../components/tickets/create-ticket-modal"

const BOARD_COLUMNS = ["BACKLOG", "TO_DO", "IN_PROGRESS", "IN_REVIEW", "DONE"]

export default function KanbanBoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState("")

  const {
    data: ticketsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tickets", projectId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/tickets/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch tickets")
      return response.json()
    },
    enabled: !!projectId,
  })

  const tickets = ticketsData?.data || []

  const ticketsByStatus = BOARD_COLUMNS.reduce(
    (acc, status) => {
      acc[status] = tickets.filter((t: any) => t.status === status)
      return acc
    },
    {} as Record<string, any[]>,
  )

  const handleCreateClick = (status: string) => {
    setSelectedColumn(status)
    setShowCreateModal(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <p className="text-muted-foreground">Manage your project tasks</p>
        </div>

        <button className="rounded-lg border px-4 py-2 hover:bg-muted flex items-center gap-2">
          <Settings size={20} />
          <span>Board Settings</span>
        </button>
      </div>

      {/* Board */}
      {isLoading ? (
        <div className="text-center py-12">Loading board...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 overflow-x-auto md:grid-cols-2 lg:grid-cols-5 pb-4">
          {BOARD_COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              title={status.replace(/_/g, " ")}
              status={status}
              tickets={ticketsByStatus[status] || []}
              onAddClick={() => handleCreateClick(status)}
              onTicketsChange={() => refetch()}
            />
          ))}
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && projectId && (
        <CreateTicketModal
          projectId={projectId}
          initialStatus={selectedColumn}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            refetch()
          }}
        />
      )}
    </div>
  )
}
