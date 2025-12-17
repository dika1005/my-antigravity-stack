'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { searchApi, type SearchType } from '@/lib/search'
import type { SearchResults } from '@/types'

interface SearchState {
  results: SearchResults | null
  isLoading: boolean
  error: string | null
}

const emptyResults: SearchResults = {
  galleries: [],
  images: [],
  users: [],
  total: { galleries: 0, images: 0, users: 0 },
}

/**
 * Hook for search functionality with debounce
 */
export function useSearch(debounceMs = 300) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<SearchType>('all')
  const [state, setState] = useState<SearchState>({
    results: null,
    isLoading: false,
    error: null,
  })
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const search = useCallback(async (searchQuery: string, searchType: SearchType) => {
    if (searchQuery.trim().length < 2) {
      setState({ results: null, isLoading: false, error: null })
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await searchApi.search({
        query: searchQuery,
        type: searchType,
        limit: searchType === 'all' ? 5 : 20,
      })

      if (response.success && response.data) {
        setState({
          results: response.data,
          isLoading: false,
          error: null,
        })
      } else {
        setState({
          results: emptyResults,
          isLoading: false,
          error: response.message || 'Search failed',
        })
      }
    } catch (err) {
      setState({
        results: emptyResults,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Search failed',
      })
    }
  }, [])

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        search(query, type)
      }, debounceMs)
    } else {
      setState({ results: null, isLoading: false, error: null })
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, type, search, debounceMs])

  const clearSearch = useCallback(() => {
    setQuery('')
    setState({ results: null, isLoading: false, error: null })
  }, [])

  const totalResults = state.results
    ? state.results.total.galleries + state.results.total.images + state.results.total.users
    : 0

  return {
    query,
    setQuery,
    type,
    setType,
    results: state.results,
    isLoading: state.isLoading,
    error: state.error,
    clearSearch,
    totalResults,
  }
}
