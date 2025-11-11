import mongoose from "mongoose"
import * as bcrypt from "bcrypt"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/scrum-board"

interface IUser {
  email: string
  firstName: string
  lastName: string
  passwordHash: string
  role: string
  status: string
  projectIds: string[]
  preferences: any
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "DEVELOPER" },
  status: { type: String, default: "ACTIVE" },
  projectIds: { type: [String], default: [] },
  preferences: { type: Object, default: {} },
})

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    const User = mongoose.model("User", userSchema)

    // Clear existing users
    await User.deleteMany({})
    console.log("Cleared existing users")

    // Seed admin user
    const adminPasswordHash = await bcrypt.hash("Admin@123456", 10)
    const adminUser = new User({
      email: "admin@scrumboard.local",
      firstName: "Admin",
      lastName: "User",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      status: "ACTIVE",
      projectIds: [],
      preferences: {
        theme: "dark",
        notifications: true,
        emailNotifications: true,
      },
    })

    await adminUser.save()
    console.log("✓ Seeded admin user: admin@scrumboard.local / Admin@123456")

    // Seed sample users
    const sampleUsers = [
      { email: "supervisor@scrumboard.local", role: "SUPERVISOR", name: ["Supervisor", "Lead"] },
      { email: "scrum@scrumboard.local", role: "SCRUM_MASTER", name: ["Scrum", "Master"] },
      { email: "dev@scrumboard.local", role: "DEVELOPER", name: ["Dev", "User"] },
      { email: "tester@scrumboard.local", role: "TESTER", name: ["Tester", "User"] },
      { email: "designer@scrumboard.local", role: "DESIGNER", name: ["Designer", "User"] },
    ]

    for (const userData of sampleUsers) {
      const passwordHash = await bcrypt.hash("Pass@123456", 10)
      const user = new User({
        email: userData.email,
        firstName: userData.name[0],
        lastName: userData.name[1],
        passwordHash,
        role: userData.role,
        status: "ACTIVE",
        projectIds: [],
        preferences: {
          theme: "dark",
          notifications: true,
          emailNotifications: true,
        },
      })

      await user.save()
      console.log(`✓ Seeded ${userData.role.toLowerCase()}: ${userData.email} / Pass@123456`)
    }

    console.log("\n✅ Database seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

seedDatabase()
