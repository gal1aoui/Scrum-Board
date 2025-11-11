import { useQuery, useMutation } from "@tanstack/react-query"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  headers?: Record<string, string>
  body?: unknown
}

const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "API request failed")
  }

  return response.json()
}

export const useApi = (endpoint: string, options: FetchOptions = {}) => {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => apiFetch(endpoint, options),
  })
}

export const useApiMutation = (endpoint: string, method: "POST" | "PUT" | "DELETE" | "PATCH" = "POST") => {
  return useMutation({
    mutationFn: (body: unknown) => apiFetch(endpoint, { method, body }),
  })
}

export const useApiAction = apiFetch
