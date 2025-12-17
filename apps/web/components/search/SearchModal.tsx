'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearch } from '@/hooks/useSearch'
import type { SearchType } from '@/lib/search'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onImageClick?: (imageId: string) => void
}

/**
 * Search modal with results display
 */
export function SearchModal({ isOpen, onClose, onImageClick }: SearchModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    query,
    setQuery,
    type,
    setType,
    results,
    isLoading,
    totalResults,
    clearSearch,
  } = useSearch()

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === modalRef.current) {
        onClose()
      }
    },
    [onClose]
  )

  const handleImageClick = useCallback(
    (imageId: string) => {
      onClose()
      if (onImageClick) {
        setTimeout(() => onImageClick(imageId), 100)
      }
    },
    [onClose, onImageClick]
  )

  const handleClose = useCallback(() => {
    clearSearch()
    onClose()
  }, [clearSearch, onClose])

  if (!isOpen) return null

  const typeButtons: { id: SearchType; label: string }[] = [
    { id: 'all', label: 'Semua' },
    { id: 'image', label: 'Foto' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'user', label: 'Pengguna' },
  ]

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[200] flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl mx-4 bg-slate-900/95 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari foto, galeri, atau pengguna..."
              className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 mt-3">
            {typeButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setType(btn.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  type === btn.id
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : query.length < 2 ? (
            <div className="text-center py-12 text-white/40">
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p>Ketik minimal 2 karakter untuk mencari</p>
            </div>
          ) : results && totalResults > 0 ? (
            <div className="p-4 space-y-6">
              {/* Images */}
              {results.images.length > 0 && (
                <div>
                  <h3 className="text-white/60 text-sm font-medium mb-3 flex items-center justify-between">
                    <span>📷 Foto ({results.total.images})</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {results.images.slice(0, 6).map((image) => (
                      <button
                        key={image.id}
                        onClick={() => handleImageClick(image.id)}
                        className="group relative aspect-square rounded-lg overflow-hidden bg-white/5"
                      >
                        <Image
                          src={image.thumbnailUrl || image.url}
                          alt={image.title || 'Image'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="150px"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Galleries */}
              {results.galleries.length > 0 && (
                <div>
                  <h3 className="text-white/60 text-sm font-medium mb-3">
                    📁 Galeri ({results.total.galleries})
                  </h3>
                  <div className="space-y-2">
                    {results.galleries.slice(0, 5).map((gallery) => (
                      <Link
                        key={gallery.id}
                        href={`/gallery/${gallery.slug}`}
                        onClick={handleClose}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                          {gallery.coverImage ? (
                            <Image
                              src={gallery.coverImage}
                              alt={gallery.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/30">
                              📁
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{gallery.title}</p>
                          <p className="text-white/50 text-sm">
                            {gallery._count.images} foto • {gallery.user.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {results.users.length > 0 && (
                <div>
                  <h3 className="text-white/60 text-sm font-medium mb-3">
                    👤 Pengguna ({results.total.users})
                  </h3>
                  <div className="space-y-2">
                    {results.users.slice(0, 5).map((user) => (
                      <Link
                        key={user.id}
                        href={`/user/${user.id}`}
                        onClick={handleClose}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600 flex-shrink-0">
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.name || 'User'}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-medium">
                              {user.name?.[0] || '?'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {user.name || 'Anonymous'}
                          </p>
                          <p className="text-white/50 text-sm">{user._count.galleries} galeri</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : query.length >= 2 ? (
            <div className="text-center py-12 text-white/40">
              <p>Tidak ada hasil untuk "{query}"</p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-white/40 text-sm">
            {totalResults > 0 && `${totalResults} hasil ditemukan`}
          </span>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
