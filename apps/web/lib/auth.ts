// apps/web/lib/auth.ts
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * Auth API Functions
 */
export const authApi = {
    /**
     * Login user with email and password
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for cookies
            body: JSON.stringify(data),
        })
        return response.json()
    },

    /**
     * Register new user
     */
    async register(data: RegisterRequest): Promise<ApiResponse<null>> {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return response.json()
    },

    /**
     * Verify email with token
     */
    async verifyEmail(token: string): Promise<ApiResponse<null>> {
        const response = await fetch(`${API_URL}/api/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        })
        return response.json()
    },

    /**
     * Logout current user
     */
    async logout(): Promise<ApiResponse<null>> {
        const response = await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        })
        return response.json()
    },

    /**
     * Refresh access token
     */
    async refresh(): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        })
        return response.json()
    },

    /**
     * Get Google OAuth URL
     */
    getGoogleAuthUrl(): string {
        return `${API_URL}/api/auth/google`
    },
}
