'use client'

import { useState, useCallback } from 'react'
import { likeApi } from '@/lib/like'
import type { LikeTarget, LikeState } from '@/types/like'

interface UseLikeOptions {
    target: LikeTarget
    targetId: string
    initialLiked?: boolean
    initialCount?: number
    onSuccess?: (liked: boolean, count: number) => void
    onError?: (error: string) => void
}

interface UseLikeReturn extends LikeState {
    toggleLike: () => Promise<void>
}

/**
 * Custom hook untuk mengelola state like
 * 
 * @example
 * ```tsx
 * const { isLiked, likeCount, isLoading, toggleLike } = useLike({
 *     target: 'image',
 *     targetId: 'image-id',
 *     initialLiked: false,
 *     initialCount: 10,
 * })
 * ```
 */
export function useLike({
    target,
    targetId,
    initialLiked = false,
    initialCount = 0,
    onSuccess,
    onError,
}: UseLikeOptions): UseLikeReturn {
    const [isLiked, setIsLiked] = useState(initialLiked)
    const [likeCount, setLikeCount] = useState(initialCount)
    const [isLoading, setIsLoading] = useState(false)

    const toggleLike = useCallback(async () => {
        if (isLoading) return

        setIsLoading(true)

        // Optimistic update
        const previousLiked = isLiked
        const previousCount = likeCount
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)

        try {
            const response = await likeApi.toggleLike(target, targetId, previousLiked)

            if (response.success && response.data) {
                // Update dengan data dari server
                setIsLiked(response.data.liked)
                setLikeCount(response.data.count)
                onSuccess?.(response.data.liked, response.data.count)
            } else {
                // Handle kasus state tidak sinkron dengan server
                const message = response.message || ''

                // Jika server bilang "Sudah di-like" padahal kita coba like,
                // berarti state kita salah - seharusnya isLiked = true
                // Coba unlike sebagai gantinya
                if (message.includes('Sudah di-like') || message.includes('Already liked')) {
                    // State tidak sinkron - user sebenarnya sudah like, jadi unlike
                    const retryResponse = await likeApi.toggleLike(target, targetId, true)
                    if (retryResponse.success && retryResponse.data) {
                        setIsLiked(retryResponse.data.liked)
                        setLikeCount(retryResponse.data.count)
                        onSuccess?.(retryResponse.data.liked, retryResponse.data.count)
                        return
                    }
                }

                // Jika server bilang "Belum di-like" padahal kita coba unlike,
                // berarti state kita salah - seharusnya isLiked = false
                // Coba like sebagai gantinya
                if (message.includes('Belum di-like') || message.includes('Not liked')) {
                    // State tidak sinkron - user sebenarnya belum like, jadi like
                    const retryResponse = await likeApi.toggleLike(target, targetId, false)
                    if (retryResponse.success && retryResponse.data) {
                        setIsLiked(retryResponse.data.liked)
                        setLikeCount(retryResponse.data.count)
                        onSuccess?.(retryResponse.data.liked, retryResponse.data.count)
                        return
                    }
                }

                // Rollback jika gagal dan bukan kasus state sync
                setIsLiked(previousLiked)
                setLikeCount(previousCount)
                onError?.(response.message || 'Failed to update like')
            }
        } catch (error) {
            // Rollback jika error
            setIsLiked(previousLiked)
            setLikeCount(previousCount)
            onError?.(error instanceof Error ? error.message : 'Failed to update like')
        } finally {
            setIsLoading(false)
        }
    }, [target, targetId, isLiked, likeCount, isLoading, onSuccess, onError])

    return {
        isLiked,
        likeCount,
        isLoading,
        toggleLike,
    }
}
