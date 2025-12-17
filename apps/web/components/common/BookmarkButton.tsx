'use client'

import { useBookmark } from '@/hooks/useBookmark'

interface BookmarkButtonProps {
  target: 'gallery' | 'image'
  targetId: string
  initialBookmarked?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'solid'
  showLabel?: boolean
  className?: string
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

const buttonSizeStyles = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
}

/**
 * Bookmark/Save button component
 */
export function BookmarkButton({
  target,
  targetId,
  initialBookmarked = false,
  size = 'md',
  variant = 'default',
  showLabel = false,
  className = '',
}: BookmarkButtonProps) {
  const { isBookmarked, isLoading, toggleBookmark } = useBookmark({
    target,
    targetId,
    initialBookmarked,
  })

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    await toggleBookmark()
  }

  const baseClasses = `
    inline-flex items-center gap-1.5 rounded-full transition-all duration-200
    ${buttonSizeStyles[size]}
  `

  const variantClasses = {
    default: `
      ${
        isBookmarked
          ? 'text-violet-400 bg-violet-500/20 hover:bg-violet-500/30'
          : 'text-gray-400 hover:text-violet-400 hover:bg-white/10'
      }
    `,
    minimal: `
      ${
        isBookmarked
          ? 'text-violet-400'
          : 'text-gray-400 hover:text-violet-400'
      }
    `,
    solid: `
      ${
        isBookmarked
          ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
          : 'bg-white/10 text-white hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/25'
      }
    `,
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label={isBookmarked ? 'Hapus dari tersimpan' : 'Simpan'}
      title={isBookmarked ? 'Hapus dari tersimpan' : 'Simpan'}
    >
      {isLoading ? (
        <svg
          className={`${sizeStyles[size]} animate-spin`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <svg
          className={`${sizeStyles[size]} transition-transform duration-200 ${
            isBookmarked ? 'scale-110' : ''
          }`}
          fill={isBookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isBookmarked ? 'Tersimpan' : 'Simpan'}
        </span>
      )}
    </button>
  )
}
