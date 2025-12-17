import { Elysia, t } from 'elysia'
import { followRepository } from './follow.repository'
import { authMiddleware } from '@middleware/auth'
import { success, error, unauthorized, paginate } from '@lib/response'

export const followRoutes = new Elysia({ prefix: '/user' })
  .use(authMiddleware)
  // Follow a user
  .post(
    '/:id/follow',
    async ({ params, user, set }) => {
      if (!user) {
        set.status = 401
        return unauthorized()
      }

      // Cannot follow yourself
      if (params.id === user.id) {
        set.status = 400
        return error('Tidak dapat follow diri sendiri')
      }

      const existing = await followRepository.findByFollowerAndFollowing(user.id, params.id)
      if (existing) {
        return error('Sudah di-follow')
      }

      await followRepository.follow(user.id, params.id)
      const count = await followRepository.countFollowers(params.id)
      return success({ following: true, count }, 'Berhasil follow')
    },
    {
      requireAuth: true,
      params: t.Object({ id: t.String() }),
      detail: { tags: ['User'], summary: 'Follow a user' },
    }
  )
  // Unfollow a user
  .delete(
    '/:id/follow',
    async ({ params, user, set }) => {
      if (!user) {
        set.status = 401
        return unauthorized()
      }

      const existing = await followRepository.findByFollowerAndFollowing(user.id, params.id)
      if (!existing) {
        return error('Belum di-follow')
      }

      await followRepository.unfollow(existing.id)
      const count = await followRepository.countFollowers(params.id)
      return success({ following: false, count }, 'Berhasil unfollow')
    },
    {
      requireAuth: true,
      params: t.Object({ id: t.String() }),
      detail: { tags: ['User'], summary: 'Unfollow a user' },
    }
  )
  // Check follow status
  .get(
    '/:id/follow/status',
    async ({ params, user, set }) => {
      if (!user) {
        set.status = 401
        return unauthorized()
      }

      const existing = await followRepository.findByFollowerAndFollowing(user.id, params.id)
      const [followersCount, followingCount] = await Promise.all([
        followRepository.countFollowers(params.id),
        followRepository.countFollowing(params.id),
      ])

      return success({
        following: !!existing,
        followersCount,
        followingCount,
      })
    },
    {
      requireAuth: true,
      params: t.Object({ id: t.String() }),
      detail: { tags: ['User'], summary: 'Check follow status' },
    }
  )
  // Get followers of a user
  .get(
    '/:id/followers',
    async ({ params, query }) => {
      const page = query.page || 1
      const limit = Math.min(query.limit || 20, 50)

      const result = await followRepository.getFollowers(params.id, page, limit)
      const followers = result.followers.map((f) => ({
        ...f.follower,
        followedAt: f.createdAt,
      }))

      return paginate(followers, page, limit, result.total)
    },
    {
      params: t.Object({ id: t.String() }),
      query: t.Object({
        page: t.Optional(t.Numeric({ minimum: 1 })),
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
      }),
      detail: { tags: ['User'], summary: 'Get user followers' },
    }
  )
  // Get users that a user is following
  .get(
    '/:id/following',
    async ({ params, query }) => {
      const page = query.page || 1
      const limit = Math.min(query.limit || 20, 50)

      const result = await followRepository.getFollowing(params.id, page, limit)
      const following = result.following.map((f) => ({
        ...f.following,
        followedAt: f.createdAt,
      }))

      return paginate(following, page, limit, result.total)
    },
    {
      params: t.Object({ id: t.String() }),
      query: t.Object({
        page: t.Optional(t.Numeric({ minimum: 1 })),
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
      }),
      detail: { tags: ['User'], summary: 'Get users being followed' },
    }
  )
