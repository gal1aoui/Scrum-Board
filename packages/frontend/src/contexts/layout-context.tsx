"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface LayoutContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, theme, setTheme }}>{children}</LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within LayoutProvider")
  }
  return context
}
