'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

interface ImageDetail {
  id: string
  title: string | null
  description: string | null
  url: string
  thumbnailUrl: string | null
  width: number | null
  height: number | null
  viewCount: number
  createdAt: string
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
    comments: number
  }
}

interface RelatedImage {
  id: string
  title: string | null
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

export function useImageDetail(imageId: string | null) {
  const [image, setImage] = useState<ImageDetail | null>(null)
  const [relatedImages, setRelatedImages] = useState<RelatedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchImageDetail = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch both in parallel
      const [detailRes, relatedRes] = await Promise.all([
        api.api.image({ id }).get(),
        api.api.image({ id }).related.get({ query: { limit: 12 } }),
      ])

      if (detailRes.data?.success && detailRes.data.image) {
        setImage(detailRes.data.image as ImageDetail)
      } else {
        setError('Image not found')
      }

      if (relatedRes.data?.success && relatedRes.data.images) {
        setRelatedImages(relatedRes.data.images as RelatedImage[])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (imageId) {
      fetchImageDetail(imageId)
    } else {
      setImage(null)
      setRelatedImages([])
    }
  }, [imageId, fetchImageDetail])

  return {
    image,
    relatedImages,
    loading,
    error,
  }
}
