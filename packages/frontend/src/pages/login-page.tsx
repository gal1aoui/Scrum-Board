"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"
import { Mail, Lock, Loader2 } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationError, setValidationError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    if (!email || !password) {
      setValidationError("Please fill in all fields")
      return
    }

    try {
      await login(email, password)
      navigate("/")
    } catch (err) {
      setValidationError("Invalid email or password")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Scrum Board</h1>
        <p className="mt-2 text-muted-foreground">Project Management Platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Error Messages */}
        {(error || validationError) && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error || validationError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 size={18} className="animate-spin" />}
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Demo Credentials */}
      <div className="rounded-lg border border-muted bg-muted/50 p-4 text-sm">
        <p className="font-medium">Demo Credentials:</p>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          <li>Admin: admin@scrumboard.local / Admin@123456</li>
          <li>Dev: dev@scrumboard.local / Pass@123456</li>
        </ul>
      </div>

      {/* Register Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link to="/register" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </div>
    </div>
  )
}
