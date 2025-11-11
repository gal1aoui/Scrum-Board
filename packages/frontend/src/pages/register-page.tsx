"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../hooks/use-auth"
import { Mail, Lock, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  })
  const [validationError, setValidationError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
      setValidationError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters")
      return
    }

    try {
      await register({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
      })
      navigate("/")
    } catch (err) {
      setValidationError("Registration failed. Email might already be in use.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="mt-2 text-muted-foreground">Join Scrum Board</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full rounded-lg border bg-background py-2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={isLoading}
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full rounded-lg border bg-background py-2 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={isLoading}
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-muted-foreground">Must be at least 8 characters with uppercase and numbers</p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
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
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {/* Login Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link to="/login" className="text-primary hover:underline font-medium">
          Login
        </Link>
      </div>
    </div>
  )
}
