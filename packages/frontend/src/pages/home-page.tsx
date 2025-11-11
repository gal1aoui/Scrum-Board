import DashboardCards from "../components/dashboard/dashboard-cards"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Here's your project overview</p>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 lg:col-span-2">
          <h2 className="font-semibold">Recent Activity</h2>
          <p className="mt-4 text-muted-foreground">No recent activity</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold">Quick Stats</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sprint Progress</span>
              <span className="font-medium">0%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-full w-0 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
