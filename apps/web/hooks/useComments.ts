'use client'

import { useState, useCallback, useEffect } from 'react'
import { commentApi } from '@/lib/comment'
import type { Comment, CommentPagination } from '@/types/comment'

interface UseCommentsOptions {
    galleryId: string
    limit?: number
    autoFetch?: boolean
}

interface UseCommentsReturn {
    comments: Comment[]
    loading: boolean
    loadingMore: boolean
    submitting: boolean
    pagination: CommentPagination | null
    hasMore: boolean
    addComment: (content: string, parentId?: string) => Promise<boolean>
    deleteComment: (commentId: string) => Promise<boolean>
    loadMore: () => Promise<void>
    refresh: () => Promise<void>
}

/**
 * Hook untuk mengelola komentar gallery
 */
export function useComments({
    galleryId,
    limit = 10,
    autoFetch = true,
}: UseCommentsOptions): UseCommentsReturn {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [pagination, setPagination] = useState<CommentPagination | null>(null)
    const [page, setPage] = useState(1)

    const fetchComments = useCallback(async (pageNum: number, append = false) => {
        try {
            if (append) {
                setLoadingMore(true)
            } else {
                setLoading(true)
            }

            const response = await commentApi.getByGallery(galleryId, pageNum, limit)

            if (response.success) {
                if (append) {
                    setComments(prev => [...prev, ...response.data])
                } else {
                    setComments(response.data)
                }
                setPagination(response.pagination)
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [galleryId, limit])

    const addComment = useCallback(async (content: string, parentId?: string): Promise<boolean> => {
        if (!content.trim()) return false

        setSubmitting(true)
        try {
            const response = await commentApi.create(galleryId, content, parentId)

            if (response.success && response.data) {
                if (parentId) {
                    // Add reply to parent comment
                    setComments(prev => prev.map(comment => {
                        if (comment.id === parentId) {
                            return {
                                ...comment,
                                replies: [...(comment.replies || []), response.data!],
                            }
                        }
                        return comment
                    }))
                } else {
                    // Add new top-level comment
                    setComments(prev => [response.data!, ...prev])
                }
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to add comment:', error)
            return false
        } finally {
            setSubmitting(false)
        }
    }, [galleryId])

    const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
        try {
            const response = await commentApi.delete(commentId)

            if (response.success) {
                // Remove from top-level or from replies
                setComments(prev => {
                    // Try removing from top-level
                    const filtered = prev.filter(c => c.id !== commentId)
                    if (filtered.length < prev.length) return filtered

                    // Try removing from replies
                    return prev.map(comment => ({
                        ...comment,
                        replies: comment.replies?.filter(r => r.id !== commentId),
                    }))
                })
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to delete comment:', error)
            return false
        }
    }, [])

    const loadMore = useCallback(async () => {
        if (pagination?.hasMore && !loadingMore) {
            const nextPage = page + 1
            setPage(nextPage)
            await fetchComments(nextPage, true)
        }
    }, [pagination, loadingMore, page, fetchComments])

    const refresh = useCallback(async () => {
        setPage(1)
        await fetchComments(1, false)
    }, [fetchComments])

    useEffect(() => {
        if (autoFetch && galleryId) {
            fetchComments(1, false)
        }
    }, [autoFetch, galleryId, fetchComments])

    return {
        comments,
        loading,
        loadingMore,
        submitting,
        pagination,
        hasMore: pagination?.hasMore ?? false,
        addComment,
        deleteComment,
        loadMore,
        refresh,
    }
}
