'use client'

import { useComments } from '@/hooks/useComments'
import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'

interface CommentSectionProps {
    galleryId: string
    currentUserId?: string
    initialCount?: number
}

/**
 * Complete comment section with form and list
 */
export function CommentSection({
    galleryId,
    currentUserId,
    initialCount = 0,
}: CommentSectionProps) {
    const {
        comments,
        loading,
        loadingMore,
        submitting,
        hasMore,
        addComment,
        deleteComment,
        loadMore,
    } = useComments({ galleryId })

    const handleAddComment = async (content: string) => {
        return await addComment(content)
    }

    const handleReply = async (content: string, parentId: string) => {
        return await addComment(content, parentId)
    }

    // Calculate total comments including replies
    const totalComments = comments.reduce((acc, comment) => {
        return acc + 1 + (comment.replies?.length || 0)
    }, 0)

    // Use fetched count if available, otherwise fallback to initialCount
    const displayCount = loading ? initialCount : totalComments

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">
                    Komentar {displayCount > 0 && `(${displayCount})`}
                </h3>
            </div>

            {/* Comment Form */}
            <div className="mb-4">
                <CommentForm
                    onSubmit={handleAddComment}
                    isSubmitting={submitting}
                />
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
                {loading ? (
                    // Loading skeleton
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-gray-700" />
                                <div className="flex-1">
                                    <div className="h-16 bg-gray-700 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    // Empty state
                    <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">Belum ada komentar</p>
                        <p className="text-gray-600 text-xs mt-1">Jadilah yang pertama berkomentar</p>
                    </div>
                ) : (
                    // Comments
                    <>
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                currentUserId={currentUserId}
                                onDelete={deleteComment}
                                onReply={handleReply}
                                isSubmitting={submitting}
                            />
                        ))}

                        {/* Load More */}
                        {hasMore && (
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="w-full py-2 text-gray-400 hover:text-white text-sm transition-colors disabled:opacity-50"
                            >
                                {loadingMore ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                        Memuat...
                                    </span>
                                ) : (
                                    'Muat lebih banyak'
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
