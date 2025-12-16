'use client'

import { GalleryImage } from '@/types/gallery'

interface LightboxModalProps {
    image: GalleryImage | null
    onClose: () => void
    onDelete: (id: number) => void
}

export function LightboxModal({ image, onClose, onDelete }: LightboxModalProps) {
    if (!image) return null

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
            onDelete(image.id)
        }
    }

    // Check if user can delete this image (only user uploads can be deleted)
    const canDelete = image.isUserUpload === true

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                aria-label="Tutup lightbox"
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"
                onClick={onClose}
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Delete Button - Only show for user uploads */}
            {canDelete && (
                <button
                    aria-label="Hapus gambar"
                    className="absolute top-6 right-24 w-12 h-12 rounded-full bg-red-500/20 backdrop-blur-md flex items-center justify-center text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-colors border border-red-500/30"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDelete()
                    }}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}

            {/* Image Container - Auto adjust based on image orientation */}
            <div
                className="relative flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={image.src}
                    alt={image.title}
                    className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-2xl shadow-violet-500/20 border border-white/10"
                />

                {/* Image Info - Positioned at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/90 to-transparent rounded-b-2xl">
                    <h3 className="text-2xl font-bold text-white mb-2">{image.title}</h3>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm capitalize border border-violet-500/30">
                            {image.category}
                        </span>
                        {image.featured && (
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm">
                                ⭐ Featured
                            </span>
                        )}
                        {image.isUserUpload && (
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm border border-green-500/30">
                                📤 Upload Anda
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm">
                Klik di luar untuk menutup
            </div>
        </div>
    )
}
