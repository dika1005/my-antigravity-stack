import { prisma } from '@lib/prisma'

/**
 * Bookmark Repository - Database queries for bookmark operations
 */
export const bookmarkRepository = {
  // Gallery bookmarks
  findByUserAndGallery: (userId: string, galleryId: string) =>
    prisma.bookmark.findUnique({
      where: { userId_galleryId: { userId, galleryId } },
    }),

  bookmarkGallery: (userId: string, galleryId: string) =>
    prisma.bookmark.create({
      data: { userId, galleryId },
    }),

  // Image bookmarks
  findByUserAndImage: (userId: string, imageId: string) =>
    prisma.bookmark.findUnique({
      where: { userId_imageId: { userId, imageId } },
    }),

  bookmarkImage: (userId: string, imageId: string) =>
    prisma.bookmark.create({
      data: { userId, imageId },
    }),

  // Remove bookmark
  remove: (id: string) => prisma.bookmark.delete({ where: { id } }),

  // List user's bookmarks
  findByUser: async (userId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        include: {
          gallery: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverImage: true,
              user: { select: { id: true, name: true, avatar: true } },
              _count: { select: { images: true, likes: true } },
            },
          },
          image: {
            select: {
              id: true,
              title: true,
              url: true,
              thumbnailUrl: true,
              user: { select: { id: true, name: true, avatar: true } },
              gallery: { select: { id: true, title: true, slug: true } },
              _count: { select: { likes: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bookmark.count({ where: { userId } }),
    ])

    return { bookmarks, total }
  },
}
