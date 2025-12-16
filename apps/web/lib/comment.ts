// apps/web/lib/comment.ts
import type { CommentListResponse, CommentActionResponse } from '@/types/comment'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * Comment API Functions
 */
export const commentApi = {
  /**
   * Get comments for a gallery
   */
  async getByGallery(
    galleryId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<CommentListResponse> {
    const response = await fetch(
      `${API_URL}/api/comment/gallery/${galleryId}?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
    return response.json()
  },

  /**
   * Create a comment on a gallery
   */
  async create(
    galleryId: string,
    content: string,
    parentId?: string
  ): Promise<CommentActionResponse> {
    const response = await fetch(`${API_URL}/api/comment/gallery/${galleryId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content, parentId }),
    })
    return response.json()
  },

  /**
   * Delete a comment
   */
  async delete(commentId: string): Promise<CommentActionResponse> {
    const response = await fetch(`${API_URL}/api/comment/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return response.json()
  },
}
