import { prisma } from '@lib/prisma'

/**
 * Follow Repository - Database queries for follow operations
 */
export const followRepository = {
  // Check if user is following another user
  findByFollowerAndFollowing: (followerId: string, followingId: string) =>
    prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    }),

  // Follow a user
  follow: (followerId: string, followingId: string) =>
    prisma.follow.create({
      data: { followerId, followingId },
    }),

  // Unfollow a user
  unfollow: (id: string) => prisma.follow.delete({ where: { id } }),

  // Get followers of a user (people who follow this user)
  getFollowers: async (userId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit

    const [followers, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: userId },
        select: {
          id: true,
          createdAt: true,
          follower: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              bio: true,
              _count: {
                select: {
                  followers: true,
                  following: true,
                  galleries: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.follow.count({ where: { followingId: userId } }),
    ])

    return { followers, total }
  },

  // Get users that a user is following (people this user follows)
  getFollowing: async (userId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit

    const [following, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: userId },
        select: {
          id: true,
          createdAt: true,
          following: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              bio: true,
              _count: {
                select: {
                  followers: true,
                  following: true,
                  galleries: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.follow.count({ where: { followerId: userId } }),
    ])

    return { following, total }
  },

  // Count followers
  countFollowers: (userId: string) =>
    prisma.follow.count({ where: { followingId: userId } }),

  // Count following
  countFollowing: (userId: string) =>
    prisma.follow.count({ where: { followerId: userId } }),
}
