'use client'

import { useState, useCallback } from 'react'
import { authApi } from '@/lib/auth'
import { User, LoginRequest, RegisterRequest } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

/**
 * Hook for managing auth state and operations
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
  })

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading, error: null }))
  }

  const setError = (error: string) => {
    setState((prev) => ({ ...prev, error, isLoading: false }))
  }

  const setUser = (user: User | null) => {
    setState((prev) => ({
      ...prev,
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }))
  }

  return {
    ...state,
    setLoading,
    setError,
    setUser,
  }
}

/**
 * Hook for login functionality
 */
export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.login(data)

      if (!response.success) {
        setError(response.message)
        setIsLoading(false)
        return { success: false, message: response.message }
      }

      setIsLoading(false)
      return { success: true, user: response.data?.user }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      setIsLoading(false)
      return { success: false, message }
    }
  }, [])

  return { login, isLoading, error }
}

/**
 * Hook for register functionality
 */
export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.register(data)

      if (!response.success) {
        setError(response.message)
        setIsLoading(false)
        return { success: false, message: response.message }
      }

      setIsLoading(false)
      return { success: true, message: response.message }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      setIsLoading(false)
      return { success: false, message }
    }
  }, [])

  return { register, isLoading, error }
}

/**
 * Hook for logout functionality
 */
export function useLogout() {
  const [isLoading, setIsLoading] = useState(false)

  const logout = useCallback(async () => {
    setIsLoading(true)

    try {
      await authApi.logout()
      setIsLoading(false)
      return { success: true }
    } catch (err) {
      setIsLoading(false)
      return { success: false }
    }
  }, [])

  return { logout, isLoading }
}
