'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { authApi } from '@/lib/auth'

interface User {
    id: string
    email: string
    name: string | null
    avatar: string | null
    role: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check auth status on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            setIsLoading(true)
            const response = await authApi.refresh()
            if (response.success && response.data?.user) {
                setUser(response.data.user as User)
            } else {
                setUser(null)
            }
        } catch {
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password })
            if (response.success && response.data?.user) {
                setUser(response.data.user as User)
                return { success: true }
            }
            return { success: false, message: response.message || 'Login failed' }
        } catch (err) {
            return { success: false, message: err instanceof Error ? err.message : 'Login failed' }
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            await authApi.logout()
        } finally {
            setUser(null)
        }
    }, [])

    const refreshUser = useCallback(async () => {
        await checkAuth()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}
