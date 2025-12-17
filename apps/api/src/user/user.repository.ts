import { prisma } from '@lib/prisma'

export const userRepository = {
  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    }),

  update: (id: string, data: { name?: string; avatar?: string; bio?: string }) =>
    prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    }),

  getGalleries: (userId: string, page: number, limit: number, viewerId?: string) => {
    const isOwner = viewerId === userId
    return prisma.gallery.findMany({
      where: { userId, ...(isOwner ? {} : { isPublic: true }) },
      include: { _count: { select: { images: true, likes: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })
  },

  countGalleries: (userId: string, viewerId?: string) => {
    const isOwner = viewerId === userId
    return prisma.gallery.count({
      where: { userId, ...(isOwner ? {} : { isPublic: true }) },
    })
  },

  findByIdPublic: async (id: string) => {
    const user = await prisma.user.findUnique({
      where: { id, isActive: true },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            galleries: { where: { isPublic: true } },
          },
        },
      },
    })

    if (!user) return null

    // Get total likes received on user's galleries
    const totalLikes = await prisma.like.count({
      where: {
        gallery: {
          userId: id,
          isPublic: true,
        },
      },
    })

    return {
      ...user,
      stats: {
        galleries: user._count.galleries,
        totalLikes,
      },
    }
  },

  /**
   * Get user statistics: total likes received, comments, views
   */
  getUserStats: async (userId: string) => {
    const [
      totalImages,
      totalLikesReceived,
      totalLikesGiven,
      totalCommentsReceived,
      totalViews,
    ] = await Promise.all([
      // Total images uploaded
      prisma.image.count({ where: { userId } }),
      // Total likes received on user's images and galleries
      prisma.like.count({
        where: {
          OR: [
            { image: { userId } },
            { gallery: { userId } },
          ],
        },
      }),
      // Total likes given by user
      prisma.like.count({ where: { userId } }),
      // Total comments received on user's images and galleries
      prisma.comment.count({
        where: {
          OR: [
            { image: { userId } },
            { gallery: { userId } },
          ],
        },
      }),
      // Total views (sum of view counts)
      prisma.image.aggregate({
        where: { userId },
        _sum: { viewCount: true },
      }),
    ])

    return {
      totalImages,
      totalLikesReceived,
      totalLikesGiven,
      totalCommentsReceived,
      totalViews: totalViews._sum.viewCount || 0,
    }
  },
}
