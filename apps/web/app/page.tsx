'use client'

import { useState, useCallback } from 'react'
import { useFeed } from '@/hooks/useFeed'
import { useCategories } from '@/hooks/useCategories'
import { MasonryGrid, CategoryFilter, CinemaMode } from '@/components/feed'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const { categories, loading: categoriesLoading } = useCategories()
  const { images, loading, loadingMore, hasMore, loadMore } = useFeed({
    categoryId: selectedCategory || undefined,
    limit: 20,
  })

  const handleImageClick = useCallback((imageId: string) => {
    setSelectedImageId(imageId)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedImageId(null)
  }, [])

  const handleImageSelect = useCallback((imageId: string) => {
    setSelectedImageId(imageId)
  }, [])

  return (
    <main className="min-h-screen bg-black">
      {/* Spacer for navbar */}
      <div className="h-4" />

      {/* Category Filter Section */}
      <div className="sticky top-16 z-40">
        {/* Gradient fade effect at top */}
        <div className="absolute inset-x-0 -top-4 h-8 bg-gradient-to-b from-black to-transparent pointer-events-none" />

        <div className="relative bg-black/60 backdrop-blur-2xl border-b border-white/5">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <CategoryFilter
              categories={categories}
              selectedId={selectedCategory}
              onSelect={setSelectedCategory}
              loading={categoriesLoading}
            />
          </div>
        </div>

        {/* Gradient fade effect at bottom */}
        <div className="absolute inset-x-0 -bottom-6 h-6 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Feed Content */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MasonryGrid
          images={images}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onImageClick={handleImageClick}
        />
      </div>

      {/* Cinema Mode Modal */}
      <CinemaMode
        imageId={selectedImageId}
        onClose={handleCloseModal}
        onImageSelect={handleImageSelect}
      />
    </main>
  )
}
