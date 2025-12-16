// apps/web/lib/like.ts
import type { LikeApiResponse } from '@/types/like'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * Like API Functions
 */
export const likeApi = {
    /**
     * Like a gallery
     */
    async likeGallery(galleryId: string): Promise<LikeApiResponse> {
        const response = await fetch(`${API_URL}/api/like/gallery/${galleryId}`, {
            method: 'POST',
            credentials: 'include',
        })
        return response.json()
    },

    /**
     * Unlike a gallery
     */
    async unlikeGallery(galleryId: string): Promise<LikeApiResponse> {
        const response = await fetch(`${API_URL}/api/like/gallery/${galleryId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        return response.json()
    },

    /**
     * Like an image
     */
    async likeImage(imageId: string): Promise<LikeApiResponse> {
        const response = await fetch(`${API_URL}/api/like/image/${imageId}`, {
            method: 'POST',
            credentials: 'include',
        })
        return response.json()
    },

    /**
     * Unlike an image
     */
    async unlikeImage(imageId: string): Promise<LikeApiResponse> {
        const response = await fetch(`${API_URL}/api/like/image/${imageId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        return response.json()
    },

    /**
     * Toggle like based on current state
     */
    async toggleLike(
        target: 'gallery' | 'image',
        targetId: string,
        isCurrentlyLiked: boolean
    ): Promise<LikeApiResponse> {
        if (target === 'gallery') {
            return isCurrentlyLiked
                ? this.unlikeGallery(targetId)
                : this.likeGallery(targetId)
        } else {
            return isCurrentlyLiked
                ? this.unlikeImage(targetId)
                : this.likeImage(targetId)
        }
    },
}
