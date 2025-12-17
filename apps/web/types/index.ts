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

// ==========================================
// PROFILE TYPES
// ==========================================

export interface UserProfile {
  id: string
  email: string
  name: string | null
  avatar: string | null
  bio: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
  _count?: {
    followers: number
    following: number
    galleries: number
    images: number
  }
}

export interface UserStats {
  totalImages: number
  totalLikesReceived: number
  totalLikesGiven: number
  totalCommentsReceived: number
  totalViews: number
}

export interface ProfileGallery {
  id: string
  title: string
  slug: string
  coverImage: string | null
  isPublic: boolean
  _count: {
    images: number
    likes: number
  }
}

export interface FollowStatus {
  following: boolean
  followersCount: number
  followingCount: number
}

export interface FollowUser {
  id: string
  name: string | null
  email: string
  avatar: string | null
  bio: string | null
  followedAt: string
  _count: {
    followers: number
    following: number
    galleries: number
  }
}

// ==========================================
// BOOKMARK TYPES
// ==========================================

export interface BookmarkItem {
  id: string
  createdAt: string
  gallery: {
    id: string
    title: string
    slug: string
    coverImage: string | null
    user: {
      id: string
      name: string | null
      avatar: string | null
    }
    _count: {
      images: number
      likes: number
    }
  } | null
  image: {
    id: string
    title: string | null
    url: string
    thumbnailUrl: string | null
    user: {
      id: string
      name: string | null
      avatar: string | null
    }
    gallery: {
      id: string
      title: string
      slug: string
    }
    _count: {
      likes: number
    }
  } | null
}


