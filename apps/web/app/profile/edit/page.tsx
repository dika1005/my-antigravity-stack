'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mock user data - in real app this would come from auth/API
const initialUserData = {
    name: 'Bayu Imantoro',
    username: 'bayuimantoro',
    email: 'bayuimantoro@gmail.com',
    bio: 'Fotografer amatir yang gemar mengabadikan momen-momen indah. Pecinta alam dan arsitektur modern.',
    location: 'Jakarta, Indonesia',
}

export default function EditProfilePage() {
    const router = useRouter()
    const [formData, setFormData] = useState(initialUserData)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        setIsSaving(false)
        setShowSuccess(true)

        // Hide success message and redirect after delay
        setTimeout(() => {
            setShowSuccess(false)
            router.push('/profile')
        }, 1500)
    }

    return (
        <main className="min-h-screen bg-slate-900 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto flex items-center justify-between">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 text-white/50 hover:text-violet-400 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm">Kembali ke Profil</span>
                        </Link>
                    </div>
                </header>

                {/* Edit Form Card */}
                <section className="px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="max-w-2xl mx-auto">
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-4 shadow-lg shadow-violet-500/25">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">Edit Profil</h1>
                                <p className="text-white/50">Perbarui informasi profil Anda</p>
                            </div>

                            {/* Success Message */}
                            {showSuccess && (
                                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-green-400 text-sm">Profil berhasil diperbarui!</span>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center mb-8">
                                    <div className="relative mb-4">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl">
                                            <span className="text-3xl font-bold text-white">
                                                {formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            aria-label="Ubah foto profil"
                                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white hover:bg-violet-600 transition-colors border-2 border-slate-900"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-white/40 text-sm">Klik ikon kamera untuk mengubah foto</p>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">@</span>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full pl-8 pr-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                            placeholder="username"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                        placeholder="email@example.com"
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">
                                        Lokasi
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                                        placeholder="Kota, Negara"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-white/70 text-sm font-medium mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none"
                                        placeholder="Ceritakan tentang diri Anda..."
                                    />
                                    <p className="mt-1 text-white/40 text-xs">{formData.bio.length}/200 karakter</p>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <Link
                                        href="/profile"
                                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/10 hover:text-white transition-all text-center"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Simpan Perubahan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 py-8">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-white/30 text-sm">
                            © 2024 Purple Gallery
                        </p>
                    </div>
                </footer>
            </div>
        </main>
    )
}
