'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { GalleryImage, Category } from '@/types/gallery'

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
    onUpload: (image: GalleryImage) => void
    categories: Category[]
}

interface UploadForm {
    title: string
    category: string
    featured: boolean
}

export function UploadModal({ isOpen, onClose, onUpload, categories }: UploadModalProps) {
    const [uploadPreview, setUploadPreview] = useState<string | null>(null)
    const [uploadForm, setUploadForm] = useState<UploadForm>({
        title: '',
        category: 'nature',
        featured: false
    })
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Handle file selection
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            processFile(file)
        }
    }

    // Process the selected file
    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Silakan pilih file gambar!')
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            setUploadPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    // Handle drag events
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            processFile(file)
        }
    }

    // Handle upload submission
    const handleUpload = () => {
        if (!uploadPreview || !uploadForm.title) {
            alert('Silakan lengkapi semua field!')
            return
        }

        const newImage: GalleryImage = {
            id: Date.now(),
            src: uploadPreview,
            title: uploadForm.title,
            category: uploadForm.category,
            featured: uploadForm.featured,
            isUserUpload: true
        }

        onUpload(newImage)
        resetForm()
        onClose()
    }

    // Reset upload form
    const resetForm = () => {
        setUploadPreview(null)
        setUploadForm({
            title: '',
            category: 'nature',
            featured: false
        })
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl overflow-y-auto">
            <div className="relative w-full max-w-lg my-8 backdrop-blur-xl bg-slate-800/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                {/* Close Button */}
                <button
                    aria-label="Tutup modal upload"
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                    onClick={handleClose}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Modal Header */}
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-3 shadow-lg shadow-violet-500/25">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">Upload Foto Baru</h2>
                    <p className="text-white/50 text-sm">Tambahkan foto ke galeri Anda</p>
                </div>

                {/* Drop Zone / Preview */}
                <div
                    className={`relative mb-4 rounded-xl border-2 border-dashed transition-all duration-300 ${isDragging
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-white/20 hover:border-violet-500/50 bg-white/5'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {uploadPreview ? (
                        <div className="relative p-2">
                            <img
                                src={uploadPreview}
                                alt="Preview"
                                className="w-full max-h-52 object-contain rounded-lg mx-auto"
                            />
                            <button
                                aria-label="Hapus preview"
                                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                                onClick={() => setUploadPreview(null)}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div
                            className="p-6 text-center cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-3">
                                <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="text-white font-medium text-sm mb-1">Seret & lepas gambar di sini</p>
                            <p className="text-white/50 text-xs">atau klik untuk memilih file</p>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                        aria-label="Pilih file gambar"
                    />
                </div>

                {/* Form Fields */}
                <div className="space-y-3 mb-4">
                    {/* Title Input */}
                    <div>
                        <label className="block text-white/70 text-xs font-medium mb-1">
                            Judul Foto
                        </label>
                        <input
                            type="text"
                            placeholder="Masukkan judul foto..."
                            value={uploadForm.title}
                            onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                        />
                    </div>

                    {/* Category Select */}
                    <div>
                        <label htmlFor="category-select" className="block text-white/70 text-xs font-medium mb-1">
                            Kategori
                        </label>
                        <select
                            id="category-select"
                            value={uploadForm.category}
                            onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all appearance-none cursor-pointer"
                        >
                            {categories.filter(c => c.id !== 'all').map((cat) => (
                                <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center gap-3 pt-1">
                        <button
                            type="button"
                            aria-label="Toggle featured status"
                            onClick={() => setUploadForm({ ...uploadForm, featured: !uploadForm.featured })}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${uploadForm.featured ? 'bg-violet-500' : 'bg-white/20'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${uploadForm.featured ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                        <label className="text-white/70 text-xs">Tandai sebagai Featured</label>
                    </div>
                </div>

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={!uploadPreview || !uploadForm.title}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-violet-500/25 flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload ke Galeri
                </button>
            </div>
        </div>
    )
}
