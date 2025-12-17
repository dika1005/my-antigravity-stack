'use client'

interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
  gradientFrom: string
  gradientTo: string
  hoverBorder: string
}

function StatCard({ icon, value, label, gradientFrom, gradientTo, hoverBorder }: StatCardProps) {
  return (
    <div
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:${hoverBorder} transition-all`}
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center mx-auto mb-3`}
      >
        {icon}
      </div>
      <div
        className={`text-3xl font-bold bg-gradient-to-r ${gradientFrom.replace('/20', '-400')} ${gradientTo.replace('/20', '-400')} bg-clip-text text-transparent mb-1`}
      >
        {value.toLocaleString()}
      </div>
      <div className="text-white/50 text-sm">{label}</div>
    </div>
  )
}

interface ProfileStatsProps {
  totalUploads: number
  totalLikes: number
  totalComments: number
  totalViews: number
}

/**
 * Stats cards grid showing user statistics
 */
export function ProfileStats({
  totalUploads,
  totalLikes,
  totalComments,
  totalViews,
}: ProfileStatsProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Uploads */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-violet-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-1">
              {totalUploads}
            </div>
            <div className="text-white/50 text-sm">Foto Upload</div>
          </div>

          {/* Likes */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-pink-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-1">
              {totalLikes}
            </div>
            <div className="text-white/50 text-sm">Total Likes</div>
          </div>

          {/* Comments */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-sky-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent mb-1">
              {totalComments}
            </div>
            <div className="text-white/50 text-sm">Komentar</div>
          </div>

          {/* Views */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-1">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-white/50 text-sm">Total Views</div>
          </div>
        </div>
      </div>
    </section>
  )
}
