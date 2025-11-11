# MongoDB Setup Guide

## Choose Your MongoDB Option

### Option 1: Local MongoDB (Recommended for Development)

#### macOS

```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
mongosh  # Opens MongoDB shell

# Test connection string
mongodb://localhost:27017/scrum-board
```

#### Windows

```powershell
# Download from: https://www.mongodb.com/try/download/community

# Install MongoDB Community Edition
# Choose "Run service as Network Service"

# Verify in Services
Get-Service | findstr MongoDB

# Connect with MongoDB Shell (mongosh)
mongosh "mongodb://localhost:27017"
