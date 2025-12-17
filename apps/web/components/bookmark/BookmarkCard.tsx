'use client'

import Image from 'next/image'
import type { BookmarkItem } from '@/types'
import { bookmarkApi } from '@/lib/bookmark'
import { useState } from 'react'

interface BookmarkCardProps {
  bookmark: BookmarkItem
  onRemove: (id: string) => void
  onImageClick?: (imageId: string) => void
}

/**
 * Card component for displaying a bookmark item
 */
export function BookmarkCard({ bookmark, onRemove, onImageClick }: BookmarkCardProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    setIsRemoving(true)

    try {
      const targetId = bookmark.image?.id || bookmark.gallery?.id
      const targetType = bookmark.image ? 'image' : 'gallery'

      if (targetId) {
        const response = await bookmarkApi.toggleBookmark(targetType, targetId, true)
        if (response.success) {
          onRemove(bookmark.id)
        }
      }
    } catch (err) {
      console.error('Failed to remove bookmark:', err)
    } finally {
      setIsRemoving(false)
    }
  }

  const handleClick = () => {
    if (bookmark.image && onImageClick) {
      onImageClick(bookmark.image.id)
    }
  }

  // Determine the display data based on bookmark type
  const isImageBookmark = !!bookmark.image
  const title = isImageBookmark ? bookmark.image?.title : bookmark.gallery?.title
  const imageUrl = isImageBookmark
    ? bookmark.image?.thumbnailUrl || bookmark.image?.url
    : bookmark.gallery?.coverImage
  const user = isImageBookmark ? bookmark.image?.user : bookmark.gallery?.user
  const likesCount = isImageBookmark
    ? bookmark.image?._count.likes
    : bookmark.gallery?._count.likes

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 transition-all duration-300 hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/10 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title || 'Bookmark'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
            {isImageBookmark ? '📷 Foto' : '📁 Galeri'}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/80"
          title="Hapus dari tersimpan"
        >
          {isRemoving ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-medium truncate mb-2">{title || 'Tanpa judul'}</h3>

        <div className="flex items-center justify-between">
          {/* User */}
          <div className="flex items-center gap-2">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name || 'User'}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                {user?.name?.[0] || '?'}
              </div>
            )}
            <span className="text-white/60 text-sm truncate">{user?.name || 'Anonymous'}</span>
          </div>

          {/* Likes */}
          <div className="flex items-center gap-1 text-white/50 text-sm">
            <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likesCount || 0}
          </div>
        </div>
      </div>
    </div>
  )
}
