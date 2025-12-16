'use client'

import Link from 'next/link'
import { Category } from '@/types/gallery'

interface GalleryHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories: Category[]
  onUploadClick: () => void
  totalImages: number
  featuredCount: number
}

export function GalleryHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onUploadClick,
  totalImages,
  featuredCount,
}: GalleryHeaderProps) {
  return (
    <>
      {/* Header */}
      <header className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Bar */}
        <div className="max-w-7xl mx-auto flex justify-end mb-8">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-violet-500/30 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">My Profile</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          {/* Title with Gradient */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Galeri Foto
            </span>
          </h1>
          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Jelajahi koleksi foto menakjubkan dari berbagai kategori. Temukan keindahan dalam setiap
            momen yang terabadikan.
          </p>

          {/* Search and Upload Row */}
          <div className="max-w-2xl mx-auto mb-10 flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-white/40"
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
              </div>
              <input
                type="text"
                placeholder="Cari foto..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={onUploadClick}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Upload Foto
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25'
                    : 'backdrop-blur-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-violet-500/30'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Gallery Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-wrap justify-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              {totalImages}
            </div>
            <div className="text-white/50 text-sm">Total Foto</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {categories.length - 1}
            </div>
            <div className="text-white/50 text-sm">Kategori</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              {featuredCount}
            </div>
            <div className="text-white/50 text-sm">Featured</div>
          </div>
        </div>
      </div>
    </>
  )
}
