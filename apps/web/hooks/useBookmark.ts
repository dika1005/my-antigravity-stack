'use client'

import { useState, useCallback, useEffect } from 'react'
import { bookmarkApi } from '@/lib/bookmark'
import { useAuthContext } from '@/contexts/AuthContext'

interface UseBookmarkOptions {
  target: 'gallery' | 'image'
  targetId: string
  initialBookmarked?: boolean
}

/**
 * Hook for bookmark functionality
 */
export function useBookmark({ target, targetId, initialBookmarked = false }: UseBookmarkOptions) {
  const { isAuthenticated } = useAuthContext()
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch initial status if authenticated
  useEffect(() => {
    const fetchStatus = async () => {
      if (!isAuthenticated || !targetId) return

      try {
        const response =
          target === 'gallery'
            ? await bookmarkApi.getGalleryStatus(targetId)
            : await bookmarkApi.getImageStatus(targetId)

        if (response.success && response.data) {
          setIsBookmarked(response.data.bookmarked)
        }
      } catch (err) {
        console.error('Failed to fetch bookmark status:', err)
      }
    }

    fetchStatus()
  }, [target, targetId, isAuthenticated])

  const toggleBookmark = useCallback(async () => {
    if (!isAuthenticated) {
      // Could redirect to login or show a toast
      console.warn('User must be authenticated to bookmark')
      return { success: false }
    }

    setIsLoading(true)

    try {
      const response = await bookmarkApi.toggleBookmark(target, targetId, isBookmarked)

      if (response.success && response.data) {
        setIsBookmarked(response.data.bookmarked)
        return { success: true, bookmarked: response.data.bookmarked }
      }

      return { success: false }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err)
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }, [target, targetId, isBookmarked, isAuthenticated])

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
  }
}
