'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'

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

interface MasonryGridProps {
    images: FeedImage[]
    loading: boolean
    loadingMore: boolean
    hasMore: boolean
    onLoadMore: () => void
    onImageClick?: (imageId: string) => void
}

function ImageCard({ image, onClick }: { image: FeedImage; onClick?: () => void }) {
    const [loaded, setLoaded] = useState(false)
    const aspectRatio = (image.height && image.width) ? image.height / image.width : 1

    return (
        <div
            onClick={onClick}
            className="group relative rounded-2xl overflow-hidden bg-gray-800 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            style={{ aspectRatio: `1 / ${aspectRatio}` }}
        >
            {/* Image */}
            <Image
                src={image.thumbnailUrl || image.url}
                alt={image.title || 'Gallery image'}
                fill
                className={`object-cover transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setLoaded(true)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Loading skeleton */}
            {!loaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    {image.title && (
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                            {image.title}
                        </h3>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {image.user.avatar && (
                                <Image
                                    src={image.user.avatar}
                                    alt={image.user.name || 'User'}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                    unoptimized
                                />
                            )}
                            <span className="text-gray-300 text-xs">
                                {image.user.name || 'Anonymous'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-300">
                            <HeartIcon />
                            <span className="text-xs">{image._count.likes}</span>
                        </div>
                    </div>
                </div>

                {/* Category badge */}
                {image.gallery.category && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            {image.gallery.category.name}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

function HeartIcon() {
    return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    )
}

export function MasonryGrid({ images, loading, loadingMore, hasMore, onLoadMore, onImageClick }: MasonryGridProps) {
    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement | null>(null)

    // Infinite scroll observer
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loadingMore) {
            onLoadMore()
        }
    }, [hasMore, loadingMore, onLoadMore])

    useEffect(() => {
        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '100px',
            threshold: 0.1,
        })

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current)
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [handleObserver])

    if (loading) {
        // Use deterministic heights to avoid hydration mismatch
        const heights = [280, 350, 240, 320, 300, 260, 380, 290, 340, 250, 360, 310]
        return (
            <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl bg-gray-800 animate-pulse"
                        style={{ height: `${heights[i]}px` }}
                    />
                ))}
            </div>
        )
    }

    if (images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg">No images found</p>
                <p className="text-sm">Try a different category or check back later</p>
            </div>
        )
    }

    return (
        <>
            <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {images.map((image) => (
                    <ImageCard
                        key={image.id}
                        image={image}
                        onClick={onImageClick ? () => onImageClick(image.id) : undefined}
                    />
                ))}
            </div>

            {/* Load more trigger */}
            <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
                {loadingMore && (
                    <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        <span>Loading more...</span>
                    </div>
                )}
            </div>
        </>
    )
}
