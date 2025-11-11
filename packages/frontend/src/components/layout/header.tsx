import { Bell, Search, User } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-8">
        <div className="flex-1">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects, tickets..."
              className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-4">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 hover:bg-muted">
            <Bell size={20} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted">
            <User size={20} />
            <span className="hidden sm:inline text-sm">Profile</span>
          </button>
        </div>
      </div>
    </header>
  )
}
