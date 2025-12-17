import { api } from './api'
import type { ApiResponse, UserProfile, FollowStatus, FollowUser, ProfileGallery, UserStats } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * Profile API functions
 */
export const profileApi = {
  /**
   * Get current user's profile
   */
  getMe: async (): Promise<ApiResponse<UserProfile>> => {
    const res = await fetch(`${API_URL}/api/user/me`, {
      credentials: 'include',
    })
    return res.json()
  },

  /**
   * Get public user profile by ID
   */
  getUser: async (userId: string): Promise<ApiResponse<UserProfile>> => {
    const res = await fetch(`${API_URL}/api/user/${userId}`, {
      credentials: 'include',
    })
    return res.json()
  },

  /**
   * Update current user's profile
   */
  updateProfile: async (data: {
    name?: string
    avatar?: string
    bio?: string
  }): Promise<ApiResponse<UserProfile>> => {
    const res = await fetch(`${API_URL}/api/user/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    return res.json()
  },

  /**
   * Get user galleries
   */
  getUserGalleries: async (
    userId: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<ProfileGallery[]> & { meta?: { total: number; page: number; limit: number } }> => {
    const res = await fetch(`${API_URL}/api/user/${userId}/galleries?page=${page}&limit=${limit}`, {
      credentials: 'include',
    })
    return res.json()
  },

  /**
   * Follow a user
   */
  follow: async (userId: string): Promise<ApiResponse<{ following: boolean; count: number }>> => {
    const res = await fetch(`${API_URL}/api/user/${userId}/follow`, {
      method: 'POST',
      credentials: 'include',
    })
    return res.json()
  },

  /**
   * Unfollow a user
   */
  unfollow: async (userId: string): Promise<ApiResponse<{ following: boolean; count: number }>> => {
    const res = await fetch(`${API_URL}/api/user/${userId}/follow`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return res.json()
  },

  /**
   * Check follow status
   */
  getFollowStatus: async (userId: string): Promise<ApiResponse<FollowStatus>> => {
    const res = await fetch(`${API_URL}/api/user/${userId}/follow/status`, {
      credentials: 'include',
    })
    return res.json()
  },

  /**
   * Get user followers
   */
  getFollowers: async (
    userId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<FollowUser[]> & { meta?: { total: number; page: number; limit: number } }> => {
    const res = await fetch(`${API_URL}/api/user/${userId}/followers?page=${page}&limit=${limit}`, {
      credentials: 'include',
    })
    return res.json()
  },

  /**
   * Get users being followed
   */
  getFollowing: async (
    userId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<FollowUser[]> & { meta?: { total: number; page: number; limit: number } }> => {
    const res = await fetch(`${API_URL}/api/user/${userId}/following?page=${page}&limit=${limit}`, {
      credentials: 'include',
    })
    return res.json()
  },

  /**
   * Get my stats
   */
  getMyStats: async (): Promise<ApiResponse<UserStats>> => {
    const res = await fetch(`${API_URL}/api/user/me/stats`, {
      credentials: 'include',
    })
    return res.json()
  },

  /**
   * Get user stats by ID
   */
  getUserStats: async (userId: string): Promise<ApiResponse<UserStats>> => {
    const res = await fetch(`${API_URL}/api/user/${userId}/stats`, {
      credentials: 'include',
    })
    return res.json()
  },
}
