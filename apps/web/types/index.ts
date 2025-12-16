// apps/web/types/index.ts

// Import tetap ada supaya siap dipakai nanti
import type { App } from '../../api/src/index'

// ==========================================
// USER TYPES
// ==========================================

export interface User {
  id: string
  email: string
  name?: string | null
  avatar?: string | null
  role: 'USER' | 'ADMIN'
}

// ==========================================
// AUTH TYPES
// ==========================================

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
  } | null
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
}

export interface ApiError {
  success: false
  message: string
  data: null
}
