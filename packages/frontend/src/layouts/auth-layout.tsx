import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg">
        <Outlet />
      </div>
    </div>
  )
}
