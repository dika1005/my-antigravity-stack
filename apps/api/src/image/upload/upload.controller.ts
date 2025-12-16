import { Elysia, t } from 'elysia'
import { uploadService } from './upload.service'
import { authMiddleware } from '@middleware/auth'
import { success, error, unauthorized, forbidden } from '@lib/response'

export const uploadController = new Elysia().use(authMiddleware).post(
  '/',
  async ({ body, user, set }) => {
    if (!user) {
      set.status = 401
      return unauthorized()
    }

    const result = await uploadService.upload(user.id, body.galleryId, {
      title: body.title,
      description: body.description,
      filename: body.filename,
      url: body.url,
      thumbnailUrl: body.thumbnailUrl,
      mimeType: body.mimeType,
      size: body.size,
      width: body.width,
      height: body.height,
    })

    if (!result.success) {
      if (result.forbidden) {
        set.status = 403
        return forbidden(result.message)
      }
      set.status = 404
      return error(result.message)
    }

    set.status = 201
    return success(result.image, result.message)
  },
  {
    requireAuth: true,
    body: t.Object({
      galleryId: t.String(),
      filename: t.String(),
      url: t.String(),
      mimeType: t.String(),
      size: t.Number(),
      title: t.Optional(t.String()),
      description: t.Optional(t.String()),
      thumbnailUrl: t.Optional(t.String()),
      width: t.Optional(t.Number()),
      height: t.Optional(t.Number()),
    }),
    detail: {
      tags: ['Image'],
      summary: 'Upload image',
      description: 'Add image to gallery (gallery owner only)',
    },
  }
)
