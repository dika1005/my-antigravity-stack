'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useProfile, useFollow } from '@/hooks/useProfile'
import { ProfileHeader, ProfileCard, ProfileStats, ProfileTabs, GalleryGrid, EmptyState } from '@/components/profile'
import { Spinner } from '@/components/common'

type TabType = 'uploads' | 'liked' | 'saved'

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuthContext()
  const { profile, galleries, stats, isLoading, error } = useProfile()
  const [activeTab, setActiveTab] = useState<TabType>('uploads')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login'
    }
  }, [authLoading, user])

  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size="lg" />
      </main>
    )
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-full bg-violet-500 text-white"
          >
            Coba Lagi
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"
          style={{ animationDuration: '5s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <ProfileHeader isOwnProfile={true} />

        <ProfileCard
          profile={profile}
          isOwnProfile={true}
          followersCount={profile._count?.followers || 0}
        />

        <ProfileStats
          totalUploads={stats?.totalImages || profile._count?.galleries || 0}
          totalLikes={stats?.totalLikesReceived || 0}
          totalComments={stats?.totalCommentsReceived || 0}
          totalViews={stats?.totalViews || 0}
        />

        {/* Tabs & Content */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-5xl mx-auto">
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'uploads' && <GalleryGrid galleries={galleries} />}
            {activeTab === 'liked' && <EmptyState type="liked" />}
            {activeTab === 'saved' && <EmptyState type="saved" />}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white/30 text-sm">© 2024 Purple Gallery</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
