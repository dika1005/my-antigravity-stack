'use client'

import { useState } from 'react'

interface CommentFormProps {
    onSubmit: (content: string) => Promise<boolean>
    placeholder?: string
    submitLabel?: string
    isSubmitting?: boolean
    autoFocus?: boolean
    onCancel?: () => void
    showCancel?: boolean
}

/**
 * Form untuk menambah komentar
 */
export function CommentForm({
    onSubmit,
    placeholder = 'Tulis komentar...',
    submitLabel = 'Kirim',
    isSubmitting = false,
    autoFocus = false,
    onCancel,
    showCancel = false,
}: CommentFormProps) {
    const [content, setContent] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || isSubmitting) return

        const success = await onSubmit(content)
        if (success) {
            setContent('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                autoFocus={autoFocus}
                disabled={isSubmitting}
                className="
                    w-full px-3 py-2 
                    bg-white/5 border border-white/10 
                    rounded-xl resize-none
                    text-white text-sm placeholder:text-gray-500
                    focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20
                    transition-all duration-200
                    disabled:opacity-50
                "
                rows={2}
            />
            <div className="flex items-center justify-end gap-2">
                {showCancel && onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Batal
                    </button>
                )}
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="
                        px-4 py-1.5 
                        bg-gradient-to-r from-purple-500 to-pink-500 
                        hover:from-purple-600 hover:to-pink-600
                        text-white text-sm font-medium rounded-lg
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200
                        flex items-center gap-2
                    "
                >
                    {isSubmitting && (
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {submitLabel}
                </button>
            </div>
        </form>
    )
}
