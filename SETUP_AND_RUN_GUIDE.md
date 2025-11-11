# Scrum Board (SB) - Setup and Running Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Configuration](#configuration)
4. [Running the Project](#running-the-project)
5. [Testing & Validation](#testing--validation)
6. [Common Issues](#common-issues)

---

## Prerequisites

Before you start, ensure you have the following installed:

### Required
- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
  ```bash
  node --version  # Should be v18.0.0 or higher
  ```

- **pnpm** 9.x or higher ([Download](https://pnpm.io/))
  ```bash
  npm install -g pnpm
  pnpm --version  # Should be 9.0.0 or higher
  ```

- **MongoDB** (Local or Cloud)
  - **Local**: [Install MongoDB Community](https://www.mongodb.com/docs/manual/installation/)
  - **Cloud**: [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas/register)

### Recommended
- **Git** for version control
- **VSCode** with ESLint and Prettier extensions
- **MongoDB Compass** for database visualization

---

## Initial Setup

### Step 1: Clone and Install

```bash
# Clone the repository (or download ZIP)
git clone <your-repository-url>
cd scrum-board

# Install dependencies using pnpm
pnpm install

# This installs dependencies for all packages:
# - packages/backend
# - packages/frontend
# - packages/shared
```

### Step 2: Verify Installation

```bash
# Check pnpm workspace setup
pnpm list

# Should show:
# scrum-board
# ├── @scrum-board/backend
# ├── @scrum-board/frontend
# └── @scrum-board/shared
```

---

## Configuration

### Backend Configuration

#### 1. Create `.env.local` in `packages/backend/`

```bash
cd packages/backend
cp .env.example .env.local
```

#### 2. Edit `packages/backend/.env.local`

**Option A: Local MongoDB (Recommended for Development)**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/scrum-board
MONGODB_DEBUG=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d

# Server Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Optional: GitHub Integration (add later)
# GITHUB_CLIENT_ID=xxx
# GITHUB_CLIENT_SECRET=xxx
```

**Option B: MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/scrum-board?retryWrites=true&w=majority
MONGODB_DEBUG=false

# ... rest same as above
```

#### 3. Get MongoDB Connection String

**For Local MongoDB:**
```bash
# Start MongoDB (default port 27017)
mongod

# Connection string: mongodb://localhost:27017/scrum-board
```

**For MongoDB Atlas (Cloud):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" → "Drivers" → Select "Node.js"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Change database name from "myFirstDatabase" to "scrum-board"

Example Atlas string:
```
mongodb+srv://user:password@cluster-name.mongodb.net/scrum-board?retryWrites=true&w=majority
```

---

### Frontend Configuration

#### 1. Create `.env.local` in `packages/frontend/`

```bash
cd packages/frontend
cp .env.example .env.local
```

#### 2. Edit `packages/frontend/.env.local`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=Scrum Board
VITE_APP_DESCRIPTION=Project Management with Scrum Framework
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_CHAT=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_GITHUB=true

# Optional: For production deployment
# VITE_API_BASE_URL=https://api.yourdomain.com
# VITE_WS_URL=https://yourdomain.com
```

---

## Running the Project

### Option 1: Run Everything at Once (Recommended)

```bash
# From root directory
pnpm dev

# This command:
# - Starts Backend (NestJS) on http://localhost:3000
# - Starts Frontend (Vite) on http://localhost:5173
# - Enables hot reload for both
# - Shows logs from both services
```

### Option 2: Run Services Separately

```bash
# Terminal 1 - Backend
cd packages/backend
pnpm dev
# Runs on http://localhost:3000

# Terminal 2 - Frontend
cd packages/frontend
pnpm dev
# Runs on http://localhost:5173
```

### Option 3: Run Specific Commands

```bash
# From root directory

# Backend only
pnpm -F @scrum-board/backend dev

# Frontend only
pnpm -F @scrum-board/frontend dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Formatting
pnpm format
```

---

## Seeding Database with Demo Data

After the first startup, seed your database with demo users and projects:

### Automatic Seeding

```bash
# From root directory - runs seed script
pnpm seed

# Creates:
# - 6 users with different roles
# - 3 sample projects
# - 15 sample tickets
# - Sprint and team assignments
```

### Manual Seeding

```bash
# From backend directory
cd packages/backend
npx ts-node ../../scripts/seed-database.ts
```

### Demo Credentials

After seeding, use these accounts to login:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | `admin@scrumboard.local` | `Admin@123456` | Full system access |
| Supervisor | `supervisor@scrumboard.local` | `Pass@123456` | Create/manage projects |
| Scrum Master | `master@scrumboard.local` | `Pass@123456` | Manage sprints |
| Developer | `dev@scrumboard.local` | `Pass@123456` | Work on tickets |
| Tester | `tester@scrumboard.local` | `Pass@123456` | Create bug reports |
| Designer | `designer@scrumboard.local` | `Pass@123456` | Upload designs |

---

## Testing & Validation

### 1. Backend API Health Check

```bash
# Check if backend is running
curl http://localhost:3000

# Should return:
# {"message":"Scrum Board API v1.0.0"}
```

### 2. Authentication Test

```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "Test@123456"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456"
  }'

# Should return access_token and refresh_token
```

### 3. Frontend Access

```
Open browser: http://localhost:5173

Login with demo credentials:
- Email: dev@scrumboard.local
- Password: Pass@123456
```

### 4. Database Connection Verification

```bash
# Using MongoDB CLI
mongosh "mongodb://localhost:27017/scrum-board"

# Show collections
show collections

# Should display:
# users
# projects
# tickets
# sprints
# messages
# etc.
```

---

## Accessing the Application

### Ports Overview

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | `http://localhost:5173` | React SPA |
| Backend API | `http://localhost:3000/api` | REST API |
| Socket.io (Real-time) | `http://localhost:3000` | WebSocket |
| MongoDB | `mongodb://localhost:27017` | Database |

### First Login Steps

1. Navigate to `http://localhost:5173`
2. Click "Login"
3. Enter demo credentials:
   - Email: `dev@scrumboard.local`
   - Password: `Pass@123456`
4. Click "Sign In"
5. You'll be redirected to the dashboard

---

## Common Issues & Troubleshooting

### Issue 1: MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check if MongoDB is running
# macOS
brew services list

# Windows
Get-Service | findstr MongoDB

# Start MongoDB
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Or run mongod directly
mongod
```

### Issue 2: Port 3000 Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution A: Kill process on port**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution B: Change port**
```bash
# Edit packages/backend/.env.local
PORT=3001

# Edit packages/frontend/vite.config.ts
server: { port: 5174 }
```

### Issue 3: Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Or use this for complete clean
pnpm store prune
pnpm install
```

### Issue 4: Hot Reload Not Working

```bash
# Restart the dev server
# Press Ctrl+C in terminal
pnpm dev
```

### Issue 5: Type Errors on Startup

```bash
# Rebuild TypeScript cache
pnpm type-check

# Clean and reinstall
pnpm clean
pnpm install
```

### Issue 6: CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Check `.env.local` files

Backend `.env.local`:
```env
FRONTEND_URL=http://localhost:5173
```

Frontend `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
```

---

## Development Commands Reference

### Code Quality

```bash
# Lint code with Biome.js
pnpm lint

# Format code with Prettier
pnpm format

# Type checking
pnpm type-check

# All together
pnpm validate
```

### Build & Production

```bash
# Build backend
pnpm -F @scrum-board/backend build

# Build frontend
pnpm -F @scrum-board/frontend build

# Build all packages
pnpm build
```

### Development

```bash
# Start dev servers
pnpm dev

# Run specific package
pnpm -F @scrum-board/backend dev
pnpm -F @scrum-board/frontend dev

# Seed database
pnpm seed
```

---

## Environment Variables Summary

### Backend Required Variables

```env
MONGODB_URI              # MongoDB connection string
JWT_SECRET              # Secret key for JWT signing
NODE_ENV                # development | production
PORT                    # Server port (default: 3000)
FRONTEND_URL            # Frontend URL for CORS
```

### Backend Optional Variables

```env
MONGODB_DEBUG           # Enable MongoDB debug logging
JWT_EXPIRATION          # Access token expiration (default: 7d)
JWT_REFRESH_EXPIRATION  # Refresh token expiration (default: 30d)
LOG_LEVEL               # debug | info | warn | error
GITHUB_CLIENT_ID        # For GitHub integration
GITHUB_CLIENT_SECRET    # For GitHub integration
```

### Frontend Required Variables

```env
VITE_API_BASE_URL       # Backend API URL
VITE_WS_URL             # WebSocket server URL
VITE_APP_NAME           # App display name
```

### Frontend Optional Variables

```env
VITE_APP_VERSION        # App version
VITE_APP_DESCRIPTION    # App description
VITE_ENABLE_CHAT        # Enable chat features
VITE_ENABLE_NOTIFICATIONS  # Enable notifications
VITE_ENABLE_GITHUB      # Enable GitHub integration
```

---

## Next Steps After Setup

1. **Explore the Dashboard**
   - Create a new project
   - Add team members
   - Create tickets

2. **Test Kanban Board**
   - Drag tickets between columns
   - Add comments to tickets
   - Update ticket details

3. **Try Real-time Features**
   - Open chat in multiple browsers
   - Send messages in real-time
   - See notifications update

4. **Review Code Quality**
   - Run `pnpm lint` to check code
   - Run `pnpm format` to auto-fix
   - Check types with `pnpm type-check`

5. **Read Documentation**
   - Check `IMPLEMENTATION_GUIDE.md` for architecture
   - Review `packages/shared/src/types/` for data models
   - Explore `packages/backend/src/modules/` for API logic

---

## Getting Help

### Logs and Debugging

```bash
# View backend logs
# Automatically shown when running pnpm dev

# View browser console
# Press F12 in browser and check Console tab

# Check database with MongoDB Compass
# Connect to mongodb://localhost:27017
# Browse collections and data
```

### Common Questions

**Q: How do I change the JWT secret?**
A: Edit `JWT_SECRET` in `.env.local` (generate a strong secret)

**Q: How do I add a new user role?**
A: 
1. Add role to `packages/shared/src/types/user.ts`
2. Update permissions in `packages/backend/src/common/guards/rbac.guard.ts`

**Q: How do I customize the database?**
A: Edit schemas in `packages/backend/src/modules/*/schemas/`

**Q: How do I add new environment variables?**
A:
1. Add to `.env.example`
2. Update `.env.local`
3. Import in code: `process.env.VARIABLE_NAME`

---

## Production Deployment Checklist

- [ ] Change `NODE_ENV=production`
- [ ] Generate strong `JWT_SECRET`
- [ ] Use MongoDB Atlas or managed database
- [ ] Set `FRONTEND_URL` to production domain
- [ ] Set `VITE_API_BASE_URL` to production API
- [ ] Enable HTTPS
- [ ] Set up error logging/monitoring
- [ ] Configure backups
- [ ] Run security audit
- [ ] Load test the application

---

**You're all set! Happy coding! 🚀**
