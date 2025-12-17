'use client'

import { useState, useCallback, useEffect } from 'react'
import { profileApi } from '@/lib/profile'
import type { UserProfile, ProfileGallery, FollowStatus, UserStats } from '@/types'

interface ProfileState {
  profile: UserProfile | null
  galleries: ProfileGallery[]
  stats: UserStats | null
  followStatus: FollowStatus | null
  isLoading: boolean
  error: string | null
}

/**
 * Hook for fetching and managing user profile
 */
export function useProfile(userId?: string) {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    galleries: [],
    stats: null,
    followStatus: null,
    isLoading: true,
    error: null,
  })

  const fetchProfile = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = userId ? await profileApi.getUser(userId) : await profileApi.getMe()

      if (!response.success || !response.data) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Failed to fetch profile',
        }))
        return
      }

      setState((prev) => ({
        ...prev,
        profile: response.data,
        isLoading: false,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch profile',
      }))
    }
  }, [userId])

  const fetchStats = useCallback(async () => {
    try {
      const response = userId
        ? await profileApi.getUserStats(userId)
        : await profileApi.getMyStats()

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          stats: response.data,
        }))
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }, [userId])

  const fetchGalleries = useCallback(
    async (page = 1, limit = 10) => {
      if (!userId && !state.profile?.id) return

      try {
        const targetId = userId || state.profile?.id
        if (!targetId) return

        const response = await profileApi.getUserGalleries(targetId, page, limit)

        if (response.success && response.data) {
          setState((prev) => ({
            ...prev,
            galleries: response.data || [],
          }))
        }
      } catch (err) {
        console.error('Failed to fetch galleries:', err)
      }
    },
    [userId, state.profile?.id]
  )

  const fetchFollowStatus = useCallback(async () => {
    if (!userId) return

    try {
      const response = await profileApi.getFollowStatus(userId)

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          followStatus: response.data,
        }))
      }
    } catch (err) {
      console.error('Failed to fetch follow status:', err)
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (state.profile?.id) {
      fetchGalleries()
      fetchStats()
      if (userId) {
        fetchFollowStatus()
      }
    }
  }, [state.profile?.id, fetchGalleries, fetchStats, fetchFollowStatus, userId])

  return {
    ...state,
    refetch: fetchProfile,
    refetchGalleries: fetchGalleries,
    refetchStats: fetchStats,
    refetchFollowStatus: fetchFollowStatus,
  }
}

/**
 * Hook for follow/unfollow functionality
 */
export function useFollow(userId: string) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const follow = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await profileApi.follow(userId)
      if (response.success && response.data) {
        setIsFollowing(response.data.following)
        setFollowersCount(response.data.count)
      }
    } catch (err) {
      console.error('Failed to follow:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const unfollow = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await profileApi.unfollow(userId)
      if (response.success && response.data) {
        setIsFollowing(response.data.following)
        setFollowersCount(response.data.count)
      }
    } catch (err) {
      console.error('Failed to unfollow:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const toggleFollow = useCallback(async () => {
    if (isFollowing) {
      await unfollow()
    } else {
      await follow()
    }
  }, [isFollowing, follow, unfollow])

  const initializeStatus = useCallback((status: FollowStatus) => {
    setIsFollowing(status.following)
    setFollowersCount(status.followersCount)
  }, [])

  return {
    isFollowing,
    followersCount,
    isLoading,
    follow,
    unfollow,
    toggleFollow,
    initializeStatus,
  }
}
