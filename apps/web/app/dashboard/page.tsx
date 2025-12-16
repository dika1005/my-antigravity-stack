'use client'

import { useState } from 'react'
import { GalleryImage } from '@/types/gallery'
import { initialGalleryImages, categories } from '@/types/galleryData'
import {
    UploadModal,
    GalleryGrid,
    GalleryHeader,
    LightboxModal
} from '@/components/gallery'

export default function DashboardPage() {
    // State
    const [images, setImages] = useState<GalleryImage[]>(initialGalleryImages)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null)
    const [showUploadModal, setShowUploadModal] = useState(false)

    // Filter images based on category and search
    const filteredImages = images.filter(image => {
        const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory
        const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Handle new image upload
    const handleImageUpload = (newImage: GalleryImage) => {
        setImages([newImage, ...images])
    }

    // Handle image deletion
    const handleDeleteImage = (id: number) => {
        setImages(images.filter(img => img.id !== id))
        setLightboxImage(null)
    }

    return (
        <main className="min-h-screen bg-slate-900 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" />
                <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header with Search, Upload, Categories, Stats */}
                <GalleryHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={categories}
                    onUploadClick={() => setShowUploadModal(true)}
                    totalImages={images.length}
                    featuredCount={images.filter(img => img.featured).length}
                />

                {/* Gallery Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <GalleryGrid
                        images={filteredImages}
                        onImageClick={setLightboxImage}
                    />
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-6">
                            {/* Social Media Icons */}
                            <div className="flex items-center gap-4">
                                {/* Instagram */}
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-pink-400 hover:border-pink-400/50 hover:bg-pink-400/10 transition-all duration-300"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>

                                {/* Twitter/X */}
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-400/10 transition-all duration-300"
                                    aria-label="Twitter"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>

                                {/* Facebook */}
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-300"
                                    aria-label="Facebook"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                            </div>

                            {/* Copyright */}
                            <p className="text-white/30 text-sm">
                                © 2024 Purple Gallery. Semua foto dari Unsplash.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Upload Modal */}
            <UploadModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUpload={handleImageUpload}
                categories={categories}
            />

            {/* Lightbox Modal */}
            <LightboxModal
                image={lightboxImage}
                onClose={() => setLightboxImage(null)}
                onDelete={handleDeleteImage}
            />
        </main>
    )
}
