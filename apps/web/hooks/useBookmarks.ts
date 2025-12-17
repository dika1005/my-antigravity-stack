'use client'

import { useState, useCallback, useEffect } from 'react'
import { bookmarkApi } from '@/lib/bookmark'
import type { BookmarkItem } from '@/types'

interface BookmarksState {
  bookmarks: BookmarkItem[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  total: number
}

/**
 * Hook for fetching user's bookmarks list
 */
export function useBookmarks() {
  const [state, setState] = useState<BookmarksState>({
    bookmarks: [],
    isLoading: true,
    error: null,
    hasMore: false,
    total: 0,
  })
  const [page, setPage] = useState(1)
  const limit = 20

  const fetchBookmarks = useCallback(async (pageNum: number, append = false) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await bookmarkApi.getMyBookmarks(pageNum, limit)

      if (!response.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Failed to fetch bookmarks',
        }))
        return
      }

      const newBookmarks = (response.data || []) as BookmarkItem[]
      const total = response.meta?.total || 0

      setState((prev) => ({
        ...prev,
        bookmarks: append ? [...prev.bookmarks, ...newBookmarks] : newBookmarks,
        isLoading: false,
        hasMore: pageNum * limit < total,
        total,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch bookmarks',
      }))
    }
  }, [])

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.isLoading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchBookmarks(nextPage, true)
    }
  }, [state.hasMore, state.isLoading, page, fetchBookmarks])

  const removeBookmark = useCallback((bookmarkId: string) => {
    setState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.id !== bookmarkId),
      total: prev.total - 1,
    }))
  }, [])

  const refresh = useCallback(() => {
    setPage(1)
    fetchBookmarks(1)
  }, [fetchBookmarks])

  useEffect(() => {
    fetchBookmarks(1)
  }, [fetchBookmarks])

  return {
    ...state,
    loadMore,
    removeBookmark,
    refresh,
  }
}
