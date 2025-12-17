'use client'

import Link from 'next/link'
import type { UserProfile } from '@/types'
import { useAuthContext } from '@/contexts/AuthContext'

interface ProfileHeaderProps {
  isOwnProfile?: boolean
}

/**
 * Profile page header with navigation
 */
export function ProfileHeader({ isOwnProfile = true }: ProfileHeaderProps) {
  const { logout } = useAuthContext()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <header className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-white/50 hover:text-violet-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm">Kembali ke Dashboard</span>
        </Link>

        {isOwnProfile && (
          <div className="flex items-center gap-3">
            <Link
              href="/profile/edit"
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-violet-500/30 transition-all text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profil
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

interface ProfileCardProps {
  profile: UserProfile
  isOwnProfile?: boolean
  isFollowing?: boolean
  followersCount?: number
  onFollow?: () => void
  isFollowLoading?: boolean
}

/**
 * User profile card with avatar, bio, and follow button
 */
export function ProfileCard({
  profile,
  isOwnProfile = false,
  isFollowing = false,
  followersCount = 0,
  onFollow,
  isFollowLoading = false,
}: ProfileCardProps) {
  const getInitials = (name: string | null) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {getInitials(profile.name)}
                  </span>
                )}
              </div>
              {isOwnProfile && (
                <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-green-500 border-4 border-slate-900" />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    {profile.name || 'Unnamed User'}
                  </h1>
                  <p className="text-violet-400">{profile.email}</p>
                </div>

                {!isOwnProfile && onFollow && (
                  <button
                    onClick={onFollow}
                    disabled={isFollowLoading}
                    className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                      isFollowing
                        ? 'bg-white/10 border border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400'
                        : 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
                    }`}
                  >
                    {isFollowLoading ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                    ) : isFollowing ? (
                      'Mengikuti'
                    ) : (
                      'Ikuti'
                    )}
                  </button>
                )}
              </div>

              {profile.bio && <p className="text-white/60 max-w-lg mb-4">{profile.bio}</p>}

              {/* Stats inline */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-sm">
                <span className="text-white/70">
                  <strong className="text-white">{profile._count?.galleries || 0}</strong> galeri
                </span>
                <span className="text-white/70">
                  <strong className="text-white">{followersCount || profile._count?.followers || 0}</strong> pengikut
                </span>
                <span className="text-white/70">
                  <strong className="text-white">{profile._count?.following || 0}</strong> mengikuti
                </span>
              </div>

              {/* Join date */}
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-white/40">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Bergabung {formatDate(profile.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
