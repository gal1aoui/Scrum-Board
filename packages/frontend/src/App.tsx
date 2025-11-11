"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { LayoutProvider } from "./contexts/layout-context"
import MainLayout from "./components/layout/main-layout"
import AuthLayout from "./layouts/auth-layout"
import HomePage from "./pages/home-page"
import LoginPage from "./pages/login-page"
import RegisterPage from "./pages/register-page"
import ProjectsPage from "./pages/projects-page"
import SprintsPage from "./pages/sprints-page"
import { useAuth } from "./hooks/use-auth"
import React from "react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            {!isAuthenticated && (
              <>
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            )}

            {/* Protected Routes */}
            {isAuthenticated && (
              <>
                <Route
                  element={
                    <MainLayout>
                      <React.Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/projects" element={<ProjectsPage />} />
                          <Route path="/sprints" element={<SprintsPage />} />
                        </Routes>
                      </React.Suspense>
                    </MainLayout>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </LayoutProvider>
    </QueryClientProvider>
  )
}
