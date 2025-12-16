'use client'

import { useLike } from '@/hooks/useLike'
import type { LikeTarget } from '@/types/like'

interface LikeButtonProps {
    target: LikeTarget
    targetId: string
    initialLiked?: boolean
    initialCount?: number
    size?: 'sm' | 'md' | 'lg'
    showCount?: boolean
    variant?: 'default' | 'overlay' | 'minimal'
    className?: string
    onLikeChange?: (liked: boolean, count: number) => void
}

/**
 * Reusable Like Button Component
 * 
 * @example
 * ```tsx
 * <LikeButton 
 *     target="image" 
 *     targetId="123" 
 *     initialLiked={false}
 *     initialCount={42}
 *     size="md"
 *     showCount
 * />
 * ```
 */
export function LikeButton({
    target,
    targetId,
    initialLiked = false,
    initialCount = 0,
    size = 'md',
    showCount = true,
    variant = 'default',
    className = '',
    onLikeChange,
}: LikeButtonProps) {
    const { isLiked, likeCount, isLoading, toggleLike } = useLike({
        target,
        targetId,
        initialLiked,
        initialCount,
        onSuccess: onLikeChange,
    })

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent parent click handlers
        await toggleLike()
    }

    // Size variants
    const sizeClasses = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-3',
    }

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    }

    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }

    // Variant styles
    const variantClasses = {
        default: `
            bg-gray-800/80 hover:bg-gray-700/90 
            backdrop-blur-sm rounded-full
            border border-white/10 hover:border-white/20
            shadow-lg hover:shadow-xl
            transition-all duration-300
        `,
        overlay: `
            bg-black/40 hover:bg-black/60 
            backdrop-blur-sm rounded-full
            transition-all duration-300
        `,
        minimal: `
            hover:bg-gray-800/50 rounded-full
            transition-all duration-200
        `,
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`
                group flex items-center gap-1.5
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${isLoading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
                ${className}
            `}
            aria-label={isLiked ? 'Unlike' : 'Like'}
        >
            {/* Heart Icon with Animation */}
            <span
                className={`
                    relative flex items-center justify-center
                    transform transition-all duration-300
                    ${isLiked ? 'scale-110' : 'scale-100 group-hover:scale-110'}
                `}
            >
                {/* Filled Heart */}
                <svg
                    className={`
                        ${iconSizes[size]}
                        transition-all duration-300 ease-out
                        ${isLiked
                            ? 'text-red-500 opacity-100 scale-100'
                            : 'text-red-500 opacity-0 scale-50'
                        }
                    `}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>

                {/* Outline Heart */}
                <svg
                    className={`
                        ${iconSizes[size]}
                        absolute inset-0
                        transition-all duration-300 ease-out
                        ${isLiked
                            ? 'text-transparent opacity-0 scale-150'
                            : 'text-gray-300 group-hover:text-red-400 opacity-100 scale-100'
                        }
                    `}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>

                {/* Burst animation on like */}
                {isLiked && (
                    <span className="absolute inset-0 animate-ping">
                        <svg
                            className={`${iconSizes[size]} text-red-400 opacity-50`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </span>
                )}
            </span>

            {/* Like Count */}
            {showCount && (
                <span
                    className={`
                        ${textSizes[size]}
                        font-medium
                        transition-all duration-300
                        ${isLiked ? 'text-red-400' : 'text-gray-300 group-hover:text-white'}
                    `}
                >
                    {formatCount(likeCount)}
                </span>
            )}

            {/* Loading Spinner */}
            {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-full">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </span>
            )}
        </button>
    )
}

/**
 * Format count for display (e.g., 1000 -> 1K)
 */
function formatCount(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
}
