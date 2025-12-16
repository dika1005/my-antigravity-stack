'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

interface FeedImage {
    id: string
    title: string | null
    description: string | null
    url: string
    thumbnailUrl: string | null
    width: number | null
    height: number | null
    gallery: {
        id: string
        title: string
        slug: string
        category: {
            id: string
            name: string
            slug: string
        } | null
    }
    user: {
        id: string
        name: string | null
        avatar: string | null
    }
    _count: {
        likes: number
    }
}

interface PaginationInfo {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
}

interface UseFeedOptions {
    limit?: number
    categoryId?: string
}

export function useFeed(options: UseFeedOptions = {}) {
    const [images, setImages] = useState<FeedImage[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState<PaginationInfo | null>(null)
    const [page, setPage] = useState(1)

    const fetchFeed = useCallback(async (pageNum: number, append = false) => {
        try {
            if (append) {
                setLoadingMore(true)
            } else {
                setLoading(true)
            }
            setError(null)

            const response = await api.api.feed.get({
                query: {
                    page: pageNum,
                    limit: options.limit || 20,
                    categoryId: options.categoryId,
                },
            })

            if (response.data?.success) {
                const newImages = response.data.images as FeedImage[]
                if (append) {
                    setImages(prev => [...prev, ...newImages])
                } else {
                    setImages(newImages)
                }
                setPagination(response.data.pagination)
            } else {
                setError('Failed to fetch feed')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch feed')
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [options.limit, options.categoryId])

    const loadMore = useCallback(() => {
        if (pagination?.hasMore && !loadingMore) {
            const nextPage = page + 1
            setPage(nextPage)
            fetchFeed(nextPage, true)
        }
    }, [pagination, loadingMore, page, fetchFeed])

    const refresh = useCallback(() => {
        setPage(1)
        fetchFeed(1, false)
    }, [fetchFeed])

    useEffect(() => {
        setPage(1)
        fetchFeed(1, false)
    }, [fetchFeed])

    return {
        images,
        loading,
        loadingMore,
        error,
        pagination,
        loadMore,
        refresh,
        hasMore: pagination?.hasMore ?? false,
    }
}
