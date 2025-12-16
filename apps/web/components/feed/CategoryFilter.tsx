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
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-9 w-24 rounded-full bg-gray-800 animate-pulse flex-shrink-0"
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
                onClick={() => onSelect(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${selectedId === null
                        ? 'bg-white text-black'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
            >
                All
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelect(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${selectedId === category.id
                            ? 'bg-white text-black'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    )
}
