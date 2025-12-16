'use client'

import { useEffect, useLayoutEffect, useCallback, useState, useRef } from 'react'
import Image from 'next/image'
import { useImageDetail } from '@/hooks/useImageDetail'
import { LikeButton, CommentSection } from '@/components/common'

interface CinemaModeProps {
  imageId: string | null
  onClose: () => void
  onImageSelect: (imageId: string) => void
}

export function CinemaMode({ imageId, onClose, onImageSelect }: CinemaModeProps) {
  const { image, relatedImages, loading } = useImageDetail(imageId)
  // Initialize visibility based on imageId presence
  const [isVisible, setIsVisible] = useState(Boolean(imageId))
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle body overflow and visibility sync with imageId changes
  // This is a legitimate pattern for modal visibility - disabling the warning
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => {
    if (imageId) {
      setIsVisible(true)
      setImageLoaded(false)
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [imageId])

  // Close handler - must be defined before useEffect that uses it
  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }, [onClose])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === modalRef.current) {
        handleClose()
      }
    },
    [handleClose]
  )

  const handleRelatedClick = useCallback(
    (relatedId: string) => {
      setImageLoaded(false)
      onImageSelect(relatedId)
    },
    [onImageSelect]
  )

  if (!imageId) return null

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[100] flex flex-col transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Ambient Background - Blur from image */}
      {image && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 scale-150 blur-3xl opacity-15"
            style={{
              backgroundImage: `url(${image.thumbnailUrl || image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/95" />
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 group"
        aria-label="Close"
      >
        <svg
          className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : image ? (
          <>
            {/* Main Image Section */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 min-h-0">
              <div
                className={`relative max-w-full max-h-full transition-all duration-500 ${
                  isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
                style={{
                  aspectRatio:
                    image.width && image.height ? `${image.width}/${image.height}` : 'auto',
                  maxHeight: 'calc(100vh - 280px)',
                }}
              >
                {/* Glow effect behind image */}
                <div
                  className="absolute inset-0 blur-2xl opacity-30 rounded-3xl"
                  style={{
                    backgroundImage: `url(${image.thumbnailUrl || image.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: 'scale(1.1)',
                  }}
                />

                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={image.url}
                    alt={image.title || 'Image'}
                    width={image.width || 1920}
                    height={image.height || 1080}
                    className={`object-contain max-h-[calc(100vh-280px)] w-auto transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    priority
                  />
                  {!imageLoaded && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}
                </div>
              </div>
            </div>

            {/* Info Panel - Floating */}
            <div
              className={`absolute top-4 left-4 max-w-sm transition-all duration-500 delay-200 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-white/5">
                {image.title && (
                  <h2 className="text-white font-bold text-lg mb-2 line-clamp-2">{image.title}</h2>
                )}

                <div className="flex items-center gap-3 mb-3">
                  {image.user.avatar && (
                    <Image
                      src={image.user.avatar}
                      alt={image.user.name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full"
                      unoptimized
                    />
                  )}
                  <div>
                    <p className="text-white font-medium text-sm">
                      {image.user.name || 'Anonymous'}
                    </p>
                    <p className="text-gray-400 text-xs">{image.gallery.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <LikeButton
                    target="image"
                    targetId={image.id}
                    initialCount={image._count.likes}
                    size="sm"
                    variant="minimal"
                  />
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center gap-1 p-1.5 rounded-full transition-all duration-200 ${
                      showComments
                        ? 'text-blue-400 bg-blue-500/20'
                        : 'text-gray-300 hover:text-blue-400 hover:bg-white/10'
                    }`}
                    aria-label="Toggle comments"
                  >
                    <CommentIcon />
                    <span className={`text-sm font-medium ${showComments ? 'text-blue-400' : ''}`}>
                      {image._count.comments}
                    </span>
                  </button>
                  <span className="flex items-center gap-1">
                    <EyeIcon />
                    {image.viewCount}
                  </span>
                </div>

                {image.gallery.category && (
                  <div className="mt-3">
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      {image.gallery.category.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Comment Panel - Right Side (toggle) */}
            {showComments && (
              <div
                className={`absolute top-4 right-16 bottom-32 w-80 transition-all duration-500 ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
              >
                <div className="h-full bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-white/5 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Komentar</h3>
                    <button
                      onClick={() => setShowComments(false)}
                      className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      aria-label="Close comments"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <CommentSection
                    galleryId={image.gallery.id}
                    initialCount={image._count.comments}
                  />
                </div>
              </div>
            )}

            {/* Related Images Carousel */}
            {relatedImages.length > 0 && (
              <div
                className={`relative px-4 pb-4 transition-all duration-500 delay-300 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <p className="text-gray-400 text-sm mb-3 px-1">More like this</p>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {relatedImages.map((related) => (
                    <button
                      key={related.id}
                      onClick={() => handleRelatedClick(related.id)}
                      className="flex-shrink-0 group relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 hover:ring-2 hover:ring-white/50"
                      aria-label={related.title || 'View related image'}
                      style={{
                        width: '120px',
                        aspectRatio:
                          related.width && related.height
                            ? `${related.width}/${related.height}`
                            : '3/4',
                        maxHeight: '160px',
                      }}
                    >
                      <Image
                        src={related.thumbnailUrl || related.url}
                        alt={related.title || 'Related image'}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Image not found
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

function CommentIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  )
}
