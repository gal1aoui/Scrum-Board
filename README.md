# Scrum Board (SB)

A comprehensive project management platform tailored for software development teams following the Scrum framework.

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + shadcn/ui + Tailwind CSS
- **Backend**: NestJS + TypeScript + MongoDB + Socket.io
- **Monorepo**: pnpm workspaces with plugin support
- **Code Quality**: Biome.js + Prettier
- **Package Manager**: pnpm

## 📁 Project Structure

```
scrum-board/
├── packages/
│   ├── backend/           # NestJS API server
│   ├── frontend/          # React SPA
│   ├── shared/            # Shared types & utilities
│   └── plugins/           # Plugin system (future)
├── scripts/               # Database scripts & utilities
├── docs/                  # Documentation
├── pnpm-workspace.yaml
├── biome.json
└── .prettierrc
```

## 🎯 Core Modules

1. **Projects Management** - Create, manage, and track projects
2. **Ticket Management** - Kanban/Scrum board with story points
3. **Communication System** - Real-time chat and voice calls
4. **Meetings System** - Scrum events (Planning, Standup, Review, Retro)
5. **Calendar System** - Shared calendar with sprints and meetings
6. **Notification System** - Multi-channel notifications
7. **GitHub Integration** - Auto-sync branches, commits, PRs

## 👥 User Roles

- **Admin**: Platform management and settings
- **Supervisor**: Project creation and team management
- **Scrum Master**: Sprint management and Scrum events
- **Developer**: Task execution and updates
- **Tester**: QA workflow and bug reporting
- **Designer**: Design collaboration and UI specifications

## ⚙️ Getting Started

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Linting
pnpm lint

# Formatting
pnpm format

# Building
pnpm build

# Type checking
pnpm type-check
```

## 📚 Best Practices

- ✅ Type-safe TypeScript throughout
- ✅ Role-Based Access Control (RBAC)
- ✅ Modular architecture with plugins
- ✅ Real-time updates with Socket.io
- ✅ Comprehensive error handling
- ✅ SEO-friendly and accessible UI

## 📝 License

Proprietary - All rights reserved
