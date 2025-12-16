import { Elysia, t } from 'elysia'
import { createService } from './create.service'
import { authMiddleware } from '@middleware/auth'
import { success, error, unauthorized } from '@lib/response'

export const createController = new Elysia().use(authMiddleware).post(
  '/',
  async ({ body, user, set }) => {
    if (!user) {
      set.status = 401
      return unauthorized()
    }

    const result = await createService.create(user.id, {
      title: body.title,
      description: body.description,
      categoryId: body.categoryId,
      isPublic: body.isPublic,
    })

    set.status = 201
    return success(result.gallery, result.message)
  },
  {
    requireAuth: true,
    body: t.Object({
      title: t.String({ minLength: 1, maxLength: 255 }),
      description: t.Optional(t.String()),
      categoryId: t.Optional(t.String()),
      isPublic: t.Optional(t.Boolean()),
    }),
    detail: {
      tags: ['Gallery'],
      summary: 'Create gallery',
      description: 'Create new gallery (requires authentication)',
    },
  }
)
