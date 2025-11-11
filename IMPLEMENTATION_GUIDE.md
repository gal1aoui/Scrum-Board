# Scrum Board (SB) - Implementation Guide

## Project Overview
Scrum Board is a comprehensive project management platform built with React, NestJS, TypeScript, MongoDB, and shadcn/ui. It follows the Scrum framework and supports multiple user roles with advanced features like real-time communication, Kanban boards, sprint management, and GitHub integration.

## Architecture

### Monorepo Structure
```
scrum-board/
├── packages/
│   ├── backend/              # NestJS API server
│   │   ├── src/
│   │   │   ├── main.ts       # Application entry point
│   │   │   ├── app.module.ts # Root module
│   │   │   ├── modules/
│   │   │   │   ├── auth/     # Authentication system
│   │   │   │   ├── users/    # User management
│   │   │   │   ├── projects/ # Project management
│   │   │   │   ├── tickets/  # Ticket system
│   │   │   │   ├── sprints/  # Sprint management
│   │   │   │   └── chat/     # Real-time communication
│   │   │   └── common/       # Shared guards, decorators, pipes
│   │   └── package.json
│   ├── frontend/             # React SPA
│   │   ├── src/
│   │   │   ├── main.tsx      # React root
│   │   │   ├── App.tsx       # Main app component
│   │   │   ├── pages/        # Page components
│   │   │   ├── components/   # Reusable components
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── contexts/     # React contexts
│   │   │   └── layouts/      # Layout wrappers
│   │   └── package.json
│   └── shared/               # Shared types & schemas
│       ├── src/
│       │   ├── types/        # TypeScript interfaces
│       │   └── schemas/      # Zod validation schemas
│       └── package.json
└── scripts/                  # Database scripts

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm 9+
- MongoDB (local or Atlas)

### Installation

1. **Clone repository and install dependencies:**
   ```bash
   git clone <repo-url>
   cd scrum-board
   pnpm install
   ```

2. **Setup environment variables:**
   
   Backend (.env.local):
   ```
   MONGODB_URI=mongodb://localhost:27017/scrum-board
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRATION=7d
   NODE_ENV=development
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

   Frontend (.env.local):
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_WS_URL=http://localhost:3000
   VITE_APP_NAME=Scrum Board
   ```

3. **Seed database with initial data:**
   ```bash
   cd packages/backend
   npx ts-node ../../scripts/seed-database.ts
   ```

4. **Start development servers:**
   ```bash
   # From root directory - starts both backend and frontend
   pnpm dev
   
   # Or start individually:
   pnpm -w -F @scrum-board/backend dev
   pnpm -w -F @scrum-board/frontend dev
   ```

5. **Access application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Demo credentials (from seeding):
     - Admin: admin@scrumboard.local / Admin@123456
     - Dev: dev@scrumboard.local / Pass@123456

## Core Modules

### 1. Authentication & Authorization (✓ Complete)
**Features:**
- JWT-based authentication with 15-min access + 7-day refresh tokens
- Password hashing with bcrypt
- Role-based access control (RBAC) with 6 roles
- Protected routes and endpoints

**Files:**
- Backend: `packages/backend/src/modules/auth/`
- Frontend: `packages/frontend/src/pages/login-page.tsx` & `register-page.tsx`

**Usage:**
```typescript
// Register
POST /api/auth/register
{ email, firstName, lastName, password }

// Login
POST /api/auth/login
{ email, password }

// Current user
GET /api/auth/me (protected)
```

### 2. Projects Management (✓ Complete)
**Features:**
- Create, read, update, archive projects
- Team member management with role assignment
- Project key generation (e.g., "MB" for Mobile)
- GitHub repository linking (stub ready)
- Pagination and filtering

**Files:**
- Backend: `packages/backend/src/modules/projects/`
- Frontend: `packages/frontend/src/pages/projects-page.tsx`

**Usage:**
```typescript
// Create project
POST /api/projects (protected)
{ name, description, key }

// Get user projects
GET /api/projects?skip=0&limit=10 (protected)

// Add team member
POST /api/projects/:id/members (protected)
{ memberId, role }
```

### 3. Ticket Management (✓ Complete)
**Features:**
- 5 ticket types: Story, Task, Bug, Improvement, Spike
- 5 statuses: Backlog, To Do, In Progress, In Review, Done
- 4 priority levels: Low, Medium, High, Critical
- Story points estimation
- Comments with @mentions
- Activity history tracking

**Files:**
- Backend: `packages/backend/src/modules/tickets/`
- Frontend: `packages/frontend/src/components/kanban/` & `packages/frontend/src/pages/kanban-board-page.tsx`

**Usage:**
```typescript
// Create ticket
POST /api/tickets/:projectId (protected)
{ title, description, type, priority, storyPoints }

// Update ticket status
PUT /api/tickets/:id (protected)
{ status: "IN_PROGRESS" }

// Add comment
POST /api/tickets/:id/comments (protected)
{ content, mentions: [] }
```

### 4. Communication System (✓ Complete)
**Features:**
- Real-time chat with Socket.io
- Project-level chat
- Ticket comments
- Private messaging
- Notifications center
- Message read receipts

**Files:**
- Backend: `packages/backend/src/modules/chat/`
- Frontend: `packages/frontend/src/components/chat/` & `packages/frontend/src/components/notifications/`

**Socket Events:**
```typescript
// User login
emit('user:login', userId)

// Send message
emit('chat:send', { userId, content, type, targetId })

// Join project chat
emit('chat:join_project', projectId)

// Subscribe to notifications
emit('notification:subscribe', userId)
```

### 5. Sprint Management (Ready for Implementation)
**Planned Features:**
- Sprint creation with date ranges
- Sprint status tracking
- Velocity calculation
- Burndown charts
- Sprint retrospectives

**Next Steps:**
- Implement SprintsController
- Create sprint services
- Add sprint UI components

### 6. Calendar System (Ready for Implementation)
**Planned Features:**
- Shared team calendar
- Sprint timeline view
- Meeting scheduling
- Deadline tracking
- Event reminders

## Development Workflow

### Code Quality

**Linting:**
```bash
pnpm lint      # Run Biome.js linter
```

**Formatting:**
```bash
pnpm format    # Format with Prettier
```

**Type Checking:**
```bash
pnpm type-check # Check TypeScript
```

### Best Practices

1. **Type Safety**: Use strict TypeScript and avoid `any`
2. **Validation**: Always validate input with Zod schemas
3. **Error Handling**: Return meaningful error messages
4. **Testing**: Test critical business logic
5. **Performance**: Use pagination, caching, and indexes
6. **Security**: Validate user permissions, sanitize inputs

### API Response Format

All API responses follow this format:
```typescript
interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  timestamp: string;
}

interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

## Database Schema

### User
- email, firstName, lastName, passwordHash
- role (enum), status (enum)
- avatar, lastLoginAt
- projectIds (array)
- preferences (theme, notifications)

### Project
- name, description, key (unique)
- owner (userId), teamMembers (array)
- status (enum), githubRepo
- metadata (flexible)

### Ticket
- title, description
- type, status, priority
- assignee, reporter
- storyPoints, sprint
- comments, activity, attachments

### Sprint
- projectId, name, description
- status, startDate, endDate, goal
- tickets (array), velocity
- retrospective (whatWentWell, whatWentWrong, improvements)

### Message
- sender, content
- type (PROJECT | TICKET | PRIVATE)
- targetId, mentions, readBy
- attachments

## Deployment

### Backend Deployment (Vercel/Railway)
```bash
# Build
pnpm -F @scrum-board/backend build

# Environment variables needed:
# - MONGODB_URI
# - JWT_SECRET
# - NODE_ENV=production
# - PORT (optional)
```

### Frontend Deployment (Vercel)
```bash
# Build
pnpm -F @scrum-board/frontend build

# Environment variables needed:
# - VITE_API_BASE_URL (production API)
# - VITE_WS_URL (production WebSocket)
```

## Future Features

1. **GitHub Integration**
   - Auto-sync branches and commits
   - Link PRs to tickets
   - Push notifications for CI/CD

2. **Advanced Analytics**
   - Velocity tracking
   - Burndown charts
   - Team capacity planning
   - Cycle time analysis

3. **Meetings & Calendar**
   - Scrum events scheduling
   - Meeting notes & summaries
   - Attendance tracking
   - Video/audio calls (WebRTC)

4. **File Management**
   - Document uploads
   - Design attachments
   - Test case management
   - Version history

5. **Notifications**
   - Email notifications
   - Browser push notifications
   - Mention alerts
   - Daily digest

6. **Integrations**
   - Slack/Teams notifications
   - Calendar sync (Google, Outlook)
   - CI/CD pipelines
   - Documentation tools

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB locally
mongod
```

### Port Already in Use
```bash
# Change port in backend .env:
PORT=3001

# Change port in frontend vite.config.ts:
server: { port: 5174 }
```

### Hot Reload Not Working
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Support & Documentation

- **Code Repository**: Use v0 or GitHub
- **API Documentation**: Available at `/api/docs` (Swagger coming)
- **Type Definitions**: Check `packages/shared/src/types/`
- **Schemas**: Check `packages/shared/src/schemas/`

## License

Proprietary - All rights reserved
```
