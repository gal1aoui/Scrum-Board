"use client"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, LayoutDashboard, FolderOpen, Calendar, Settings } from "lucide-react"
import { useLayout } from "../../contexts/layout-context"

const navigationItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderOpen },
  { label: "Sprints", href: "/sprints", icon: Calendar },
  { label: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useLayout()
  const location = useLocation()

  return (
    <>
      {/* Mobile menu button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed left-4 top-4 z-40 rounded-md p-2 md:hidden">
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 transform border-r bg-card transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6 p-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">SB</span>
            </div>
            <span className="hidden text-lg font-bold sm:inline">Scrum Board</span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-colors ${
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary" />
              <div className="hidden flex-1 sm:block">
                <p className="text-sm font-medium">User Name</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  )
}
