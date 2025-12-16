import { Elysia, t } from 'elysia'
import { categoryRepository } from './category.repository'
import { authMiddleware } from '@middleware/auth'
import { success, error, unauthorized, forbidden } from '@lib/response'

export const categoryRoutes = new Elysia({ prefix: '/category' })
  .get(
    '/',
    async () => {
      const categories = await categoryRepository.findAll()
      return success(categories)
    },
    { detail: { tags: ['Category'], summary: 'List categories' } }
  )
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, user, set }) => {
      if (!user) {
        set.status = 401
        return unauthorized()
      }
      if (user.role !== 'ADMIN') {
        set.status = 403
        return forbidden()
      }

      const category = await categoryRepository.create(body)
      set.status = 201
      return success(category, 'Kategori berhasil dibuat')
    },
    {
      requireAdmin: true,
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
      }),
      detail: { tags: ['Category'], summary: 'Create category (admin)' },
    }
  )
  .patch(
    '/:id',
    async ({ params, body, user, set }) => {
      if (!user) {
        set.status = 401
        return unauthorized()
      }
      if (user.role !== 'ADMIN') {
        set.status = 403
        return forbidden()
      }

      const category = await categoryRepository.update(params.id, body)
      return success(category, 'Kategori berhasil diupdate')
    },
    {
      requireAdmin: true,
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(t.String()),
        description: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
      }),
      detail: { tags: ['Category'], summary: 'Update category (admin)' },
    }
  )
  .delete(
    '/:id',
    async ({ params, user, set }) => {
      if (!user) {
        set.status = 401
        return unauthorized()
      }
      if (user.role !== 'ADMIN') {
        set.status = 403
        return forbidden()
      }

      await categoryRepository.delete(params.id)
      return success(null, 'Kategori berhasil dihapus')
    },
    {
      requireAdmin: true,
      params: t.Object({ id: t.String() }),
      detail: { tags: ['Category'], summary: 'Delete category (admin)' },
    }
  )
