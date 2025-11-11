"use client"

import { useState, useCallback, useEffect } from "react"

interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()

      localStorage.setItem("token", data.accessToken)
      localStorage.setItem("user", JSON.stringify(data.user))
      setToken(data.accessToken)
      setUser(data.user)

      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setToken(null)
  }, [])

  const register = useCallback(async (userData: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.json()

      localStorage.setItem("token", data.accessToken)
      localStorage.setItem("user", JSON.stringify(data.user))
      setToken(data.accessToken)
      setUser(data.user)

      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user && !!token,
  }
}
