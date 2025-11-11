# Scrum Board - Quick Start (5 Minutes)

## TL;DR Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env.local files
cd packages/backend && cp .env.example .env.local
cd ../frontend && cp .env.example .env.local

# 3. Edit backend/.env.local - change MongoDB connection
MONGODB_URI=mongodb://localhost:27017/scrum-board
JWT_SECRET=your-secret-key

# 4. Start MongoDB (if local)
mongod

# 5. Run everything
cd ../.. && pnpm dev

# 6. Open browser
# Frontend: http://localhost:5173
# Login: dev@scrumboard.local / Pass@123456
```

## Commands Cheat Sheet

```bash
# Development
pnpm dev              # Start all services
pnpm seed             # Populate demo data

# Quality
pnpm lint             # Check code
pnpm format           # Auto-fix code
pnpm type-check       # Check TypeScript

# Individual services
pnpm -F @scrum-board/backend dev
pnpm -F @scrum-board/frontend dev
```

## Configuration Files

| File | Purpose |
|------|---------|
| `packages/backend/.env.local` | Backend config (MongoDB, JWT) |
| `packages/frontend/.env.local` | Frontend config (API URLs) |
| `biome.json` | Linting rules |
| `.prettierrc` | Formatting rules |
| `pnpm-workspace.yaml` | Monorepo config |

## Demo Accounts

All come with password `Pass@123456`:

- `admin@scrumboard.local` - Full access
- `dev@scrumboard.local` - Developer
- `master@scrumboard.local` - Scrum Master
- `tester@scrumboard.local` - QA Tester
- `designer@scrumboard.local` - Designer

## Ports

- Frontend: `5173`
- Backend API: `3000`
- MongoDB: `27017`

## Troubleshooting

| Error | Fix |
|-------|-----|
| MongoDB not connecting | Run `mongod` first |
| Port already in use | Change port in `.env.local` |
| Dependencies fail | Run `pnpm install` again |
| Hot reload not working | Restart dev server |

## Next Steps

1. ✅ Run `pnpm dev`
2. ✅ Login with demo account
3. ✅ Create a project
4. ✅ Add team members
5. ✅ Create tickets
6. ✅ Try Kanban board

Read `SETUP_AND_RUN_GUIDE.md` for detailed instructions!
