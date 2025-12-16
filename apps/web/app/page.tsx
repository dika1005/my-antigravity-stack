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
      {/* Category Filter */}
      <div className="sticky top-[65px] z-40 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-[1800px] mx-auto px-4 py-3">
          <CategoryFilter
            categories={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
            loading={categoriesLoading}
          />
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-[1800px] mx-auto px-4 py-6">
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