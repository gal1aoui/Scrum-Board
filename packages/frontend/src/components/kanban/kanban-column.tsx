"use client"

import { Plus } from "lucide-react"
import TicketCard from "../tickets/ticket-card"

interface KanbanColumnProps {
  title: string
  status: string
  tickets: any[]
  onAddClick: () => void
  onTicketsChange: () => void
}

export default function KanbanColumn({ title, status, tickets, onAddClick }: KanbanColumnProps) {
  return (
    <div className="flex min-h-[600px] flex-col gap-3 rounded-lg border bg-muted/50 p-4">
      {/* Column Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{tickets.length} items</p>
        </div>

        <button onClick={onAddClick} className="rounded p-1 hover:bg-muted" title="Add ticket">
          <Plus size={18} />
        </button>
      </div>

      {/* Tickets Container */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed text-center">
            <p className="text-xs text-muted-foreground">No tickets</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              id={ticket._id}
              title={ticket.title}
              type={ticket.type}
              priority={ticket.priority}
              status={ticket.status}
              assignee={ticket.assignee?.firstName}
              storyPoints={ticket.storyPoints}
            />
          ))
        )}
      </div>
    </div>
  )
}
