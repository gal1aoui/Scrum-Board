import type { ReactNode } from "react"
import { useLayout } from "../../contexts/layout-context"
import Sidebar from "./sidebar"
import Header from "./header"

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { sidebarOpen } = useLayout()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
