import { Plus } from "lucide-react"

export default function SprintsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sprints</h1>
          <p className="text-muted-foreground">Plan and manage your sprints</p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          <Plus size={20} />
          <span>New Sprint</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {["To Do", "In Progress", "Done"].map((status) => (
          <div key={status} className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">{status}</h3>
            <div className="mt-4 space-y-2">
              <div className="rounded bg-muted p-3 text-sm text-muted-foreground">No sprints</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
