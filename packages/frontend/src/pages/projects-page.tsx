"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import ProjectCard from "../components/projects/project-card"
import CreateProjectModal from "../components/projects/create-project-modal"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/projects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch projects")
      return response.json()
    },
  })

  const projects = projectsData?.data || []
  const filteredProjects = projects.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your projects and teams</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="text-center py-12">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/50 p-12 text-center">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground">
            {projects.length === 0 ? "Create your first project to get started" : "Try adjusting your search filters"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: any) => (
            <ProjectCard
              key={project._id}
              id={project._id}
              name={project.name}
              description={project.description}
              key={project.key}
              memberCount={project.teamMembers.length}
              status={project.status}
              githubRepo={project.githubRepo}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            // Refetch projects
          }}
        />
      )}
    </div>
  )
}
