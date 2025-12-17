// apps/web/lib/bookmark.ts
import type { ApiResponse } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface BookmarkResponse {
  success: boolean
  message: string
  data: {
    bookmarked: boolean
  } | null
}

interface BookmarkStatusResponse {
  success: boolean
  message: string
  data: {
    bookmarked: boolean
  } | null
}

/**
 * Bookmark API Functions
 */
export const bookmarkApi = {
  /**
   * Bookmark a gallery
   */
  async bookmarkGallery(galleryId: string): Promise<BookmarkResponse> {
    const response = await fetch(`${API_URL}/api/bookmark/gallery/${galleryId}`, {
      method: 'POST',
      credentials: 'include',
    })
    return response.json()
  },

  /**
   * Remove gallery bookmark
   */
  async unbookmarkGallery(galleryId: string): Promise<BookmarkResponse> {
    const response = await fetch(`${API_URL}/api/bookmark/gallery/${galleryId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return response.json()
  },

  /**
   * Bookmark an image
   */
  async bookmarkImage(imageId: string): Promise<BookmarkResponse> {
    const response = await fetch(`${API_URL}/api/bookmark/image/${imageId}`, {
      method: 'POST',
      credentials: 'include',
    })
    return response.json()
  },

  /**
   * Remove image bookmark
   */
  async unbookmarkImage(imageId: string): Promise<BookmarkResponse> {
    const response = await fetch(`${API_URL}/api/bookmark/image/${imageId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return response.json()
  },

  /**
   * Check gallery bookmark status
   */
  async getGalleryStatus(galleryId: string): Promise<BookmarkStatusResponse> {
    const response = await fetch(`${API_URL}/api/bookmark/gallery/${galleryId}/status`, {
      credentials: 'include',
    })
    return response.json()
  },

  /**
   * Check image bookmark status
   */
  async getImageStatus(imageId: string): Promise<BookmarkStatusResponse> {
    const response = await fetch(`${API_URL}/api/bookmark/image/${imageId}/status`, {
      credentials: 'include',
    })
    return response.json()
  },

  /**
   * Toggle bookmark based on current state
   */
  async toggleBookmark(
    target: 'gallery' | 'image',
    targetId: string,
    isCurrentlyBookmarked: boolean
  ): Promise<BookmarkResponse> {
    if (target === 'gallery') {
      return isCurrentlyBookmarked
        ? this.unbookmarkGallery(targetId)
        : this.bookmarkGallery(targetId)
    } else {
      return isCurrentlyBookmarked
        ? this.unbookmarkImage(targetId)
        : this.bookmarkImage(targetId)
    }
  },

  /**
   * Get user's bookmarks list
   */
  async getMyBookmarks(
    page = 1,
    limit = 20
  ): Promise<ApiResponse<any[]> & { meta?: { total: number; page: number; limit: number } }> {
    const response = await fetch(`${API_URL}/api/bookmark?page=${page}&limit=${limit}`, {
      credentials: 'include',
    })
    return response.json()
  },
}
