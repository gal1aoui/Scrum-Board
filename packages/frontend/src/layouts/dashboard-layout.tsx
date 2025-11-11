import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-4">
          <h1 className="text-xl font-bold">Scrum Board</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="/" className="block px-3 py-2 rounded hover:bg-accent">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/projects" className="block px-3 py-2 rounded hover:bg-accent">
                Projects
              </a>
            </li>
            <li>
              <a href="/sprints" className="block px-3 py-2 rounded hover:bg-accent">
                Sprints
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold">Welcome back</h2>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
