import type React from "react"
import { Users, FileText, Zap, Target } from "lucide-react"

interface DashboardCard {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: string
}

const dashboardCards: DashboardCard[] = [
  {
    title: "Total Projects",
    value: 0,
    icon: <Target className="h-5 w-5" />,
    trend: "+0% this month",
  },
  {
    title: "Active Sprints",
    value: 0,
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Total Tickets",
    value: 0,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Team Members",
    value: 0,
    icon: <Users className="h-5 w-5" />,
  },
]

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {dashboardCards.map((card) => (
        <div key={card.title} className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <p className="mt-2 text-3xl font-bold">{card.value}</p>
              {card.trend && <p className="mt-2 text-xs text-muted-foreground">{card.trend}</p>}
            </div>
            <div className="rounded-lg bg-muted p-2 text-primary">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
