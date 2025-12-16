import { Elysia, t } from 'elysia'
import { searchRepository } from './search.repository'
import { success, error } from '@lib/response'

export const searchRoutes = new Elysia({ prefix: '/search' }).get(
  '/',
  async ({ query, set }) => {
    const q = query.q?.trim()
    if (!q || q.length < 2) {
      set.status = 400
      return error('Query minimal 2 karakter')
    }

    const page = query.page || 1
    const limit = Math.min(query.limit || 10, 50)
    const type = query.type as 'gallery' | 'image' | 'user' | 'all' | undefined

    const results = await searchRepository.searchAll({
      query: q,
      type: type || 'all',
      page,
      limit,
    })

    return success(results, `Hasil pencarian untuk "${q}"`)
  },
  {
    query: t.Object({
      q: t.String({ minLength: 2 }),
      type: t.Optional(
        t.Union([t.Literal('gallery'), t.Literal('image'), t.Literal('user'), t.Literal('all')])
      ),
      page: t.Optional(t.Numeric({ minimum: 1 })),
      limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
    }),
    detail: {
      tags: ['Search'],
      summary: 'Global search for galleries, images, and users',
    },
  }
)
