// apps/web/lib/search.ts
import type { ApiResponse, SearchResults } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export type SearchType = 'all' | 'gallery' | 'image' | 'user'

interface SearchParams {
  query: string
  type?: SearchType
  page?: number
  limit?: number
}

/**
 * Search API Functions
 */
export const searchApi = {
  /**
   * Search across galleries, images, and users
   */
  async search(params: SearchParams): Promise<ApiResponse<SearchResults>> {
    const { query, type = 'all', page = 1, limit = 10 } = params

    const searchParams = new URLSearchParams({
      q: query,
      type,
      page: String(page),
      limit: String(limit),
    })

    const response = await fetch(`${API_URL}/api/search?${searchParams}`, {
      credentials: 'include',
    })
    return response.json()
  },
}
