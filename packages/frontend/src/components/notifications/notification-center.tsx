"use client"

import { useEffect, useState } from "react"
import { Bell, X } from "lucide-react"
import { useAuth } from "../../hooks/use-auth"
import { useSocket } from "../../hooks/use-socket"

interface Notification {
  _id: string
  type: string
  message: string
  read: boolean
  createdAt: Date
}

export default function NotificationCenter() {
  const { user } = useAuth()
  const { socket } = useSocket(user?._id || "")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    if (!socket || !user) return

    socket.on(`user:${user._id}:notifications`, (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
    })

    return () => {
      socket.off(`user:${user._id}:notifications`)
    }
  }, [socket, user])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button onClick={() => setShowPanel(!showPanel)} className="relative rounded-lg p-2 hover:bg-muted">
        <Bell size={20} />
        {unreadCount > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />}
      </button>

      {showPanel && (
        <div className="absolute right-0 top-12 w-96 max-w-sm rounded-lg border bg-card shadow-lg z-50">
          <div className="border-b p-4 flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <button onClick={() => setShowPanel(false)} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-muted-foreground">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif._id} className={`border-b p-4 ${notif.read ? "" : "bg-muted/50"}`}>
                  <p className="text-sm font-medium">{notif.type}</p>
                  <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
