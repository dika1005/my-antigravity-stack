'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Comment } from '@/types/comment'
import { CommentForm } from './CommentForm'

interface CommentItemProps {
    comment: Comment
    currentUserId?: string
    onDelete: (commentId: string) => Promise<boolean>
    onReply: (content: string, parentId: string) => Promise<boolean>
    isSubmitting?: boolean
    depth?: number
}

/**
 * Single comment item with replies
 */
export function CommentItem({
    comment,
    currentUserId,
    onDelete,
    onReply,
    isSubmitting = false,
    depth = 0,
}: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const isOwner = currentUserId === comment.user.id
    const maxDepth = 2 // Maximum nesting level

    const handleDelete = async () => {
        if (!confirm('Hapus komentar ini?')) return
        setIsDeleting(true)
        await onDelete(comment.id)
        setIsDeleting(false)
    }

    const handleReply = async (content: string) => {
        const success = await onReply(content, comment.id)
        if (success) {
            setShowReplyForm(false)
        }
        return success
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(hours / 24)

        if (hours < 1) return 'Baru saja'
        if (hours < 24) return `${hours} jam lalu`
        if (days < 7) return `${days} hari lalu`
        return date.toLocaleDateString('id-ID')
    }

    return (
        <div className={`${depth > 0 ? 'ml-8 border-l border-white/10 pl-4' : ''}`}>
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {comment.user.avatar ? (
                        <Image
                            src={comment.user.avatar}
                            alt={comment.user.name || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full"
                            unoptimized
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                            {(comment.user.name || 'U')[0].toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white/5 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-sm font-medium truncate">
                                {comment.user.name || 'Anonymous'}
                            </span>
                            <span className="text-gray-500 text-xs">
                                {formatDate(comment.createdAt)}
                            </span>
                        </div>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                            {comment.content}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-1 px-1">
                        {depth < maxDepth && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-gray-500 hover:text-white text-xs transition-colors"
                            >
                                Balas
                            </button>
                        )}
                        {isOwner && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-gray-500 hover:text-red-400 text-xs transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? 'Menghapus...' : 'Hapus'}
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-3">
                            <CommentForm
                                onSubmit={handleReply}
                                placeholder={`Balas ${comment.user.name || 'komentar'}...`}
                                submitLabel="Balas"
                                isSubmitting={isSubmitting}
                                autoFocus
                                showCancel
                                onCancel={() => setShowReplyForm(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            currentUserId={currentUserId}
                            onDelete={onDelete}
                            onReply={onReply}
                            isSubmitting={isSubmitting}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
