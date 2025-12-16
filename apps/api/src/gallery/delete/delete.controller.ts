import { Elysia, t } from 'elysia'
import { deleteService } from './delete.service'
import { authMiddleware } from '@middleware/auth'
import { success, error, unauthorized, forbidden } from '@lib/response'

export const deleteController = new Elysia().use(authMiddleware).delete(
  '/:id',
  async ({ params, user, set }) => {
    if (!user) {
      set.status = 401
      return unauthorized()
    }

    const result = await deleteService.delete(params.id, user.id)

    if (!result.success) {
      if (result.forbidden) {
        set.status = 403
        return forbidden(result.message)
      }
      set.status = 404
      return error(result.message)
    }

    return success(null, result.message)
  },
  {
    requireAuth: true,
    params: t.Object({
      id: t.String(),
    }),
    detail: {
      tags: ['Gallery'],
      summary: 'Delete gallery',
      description: 'Delete gallery (owner only)',
    },
  }
)
