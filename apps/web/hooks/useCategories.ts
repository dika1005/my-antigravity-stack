'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    coverImage: string | null
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCategories() {
            try {
                setLoading(true)
                const response = await api.api.category.get()

                if (response.data?.success) {
                    setCategories(response.data.data as Category[])
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch categories')
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return { categories, loading, error }
}
