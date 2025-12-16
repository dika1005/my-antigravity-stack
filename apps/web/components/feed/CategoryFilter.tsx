'use client'

interface CategoryFilterProps {
    categories: Array<{
        id: string
        name: string
        slug: string
    }>
    selectedId: string | null
    onSelect: (id: string | null) => void
    loading?: boolean
}

export function CategoryFilter({ categories, selectedId, onSelect, loading }: CategoryFilterProps) {
    if (loading) {
        return (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-10 rounded-xl bg-white/5 animate-pulse flex-shrink-0"
                        style={{ width: `${60 + Math.random() * 40}px` }}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {/* All Button */}
            <button
                onClick={() => onSelect(null)}
                className={`
                    relative px-5 py-2.5 rounded-xl text-sm font-medium 
                    transition-all duration-300 flex-shrink-0
                    ${selectedId === null
                        ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-violet-500/25'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/10'
                    }
                `}
            >
                <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    All
                </span>
            </button>

            {/* Separator */}
            <div className="w-px h-6 bg-white/10 flex-shrink-0" />

            {/* Category Buttons */}
            {categories.map((category, index) => (
                <button
                    key={category.id}
                    onClick={() => onSelect(category.id)}
                    className={`
                        relative px-4 py-2.5 rounded-xl text-sm font-medium 
                        transition-all duration-300 flex-shrink-0
                        hover:scale-[1.02] active:scale-[0.98]
                        ${selectedId === category.id
                            ? 'bg-white text-black shadow-lg'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/10'
                        }
                    `}
                    style={{
                        animationDelay: `${index * 50}ms`
                    }}
                >
                    {category.name}
                </button>
            ))}
        </div>
    )
}
