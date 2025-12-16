import { prisma } from '@lib/prisma'

export const feedRepository = {
  findImages: async (params: { page: number; limit: number; categoryId?: string }) => {
    const { page, limit, categoryId } = params
    const skip = (page - 1) * limit

    const where = {
      gallery: {
        isPublic: true,
        ...(categoryId && { categoryId }),
      },
    }

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          gallery: {
            select: {
              id: true,
              title: true,
              slug: true,
              category: { select: { id: true, name: true, slug: true } },
            },
          },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.image.count({ where }),
    ])

    return { images, total }
  },
}
