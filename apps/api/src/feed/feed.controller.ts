import { Elysia, t } from 'elysia'
import { feedService } from './feed.service'

export const feedController = new Elysia().get(
  '/feed',
  async ({ query }) => {
    return feedService.getImages({
      page: query.page,
      limit: query.limit,
      categoryId: query.categoryId,
    })
  },
  {
    query: t.Object({
      page: t.Optional(t.Numeric()),
      limit: t.Optional(t.Numeric()),
      categoryId: t.Optional(t.String()),
    }),
  }
)
