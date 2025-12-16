import { prisma } from '@lib/prisma'

/**
 * Image Repository - Shared database queries for image module
 */
export const imageRepository = {
  findById: (id: string) =>
    prisma.image.findUnique({
      where: { id },
      include: { user: { select: { id: true } }, gallery: { select: { id: true, userId: true } } },
    }),

  findByIdWithDetails: (id: string) =>
    prisma.image.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        filename: true,
        url: true,
        thumbnailUrl: true,
        mimeType: true,
        size: true,
        width: true,
        height: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        gallery: {
          select: {
            id: true,
            title: true,
            slug: true,
            userId: true,
            category: { select: { id: true, name: true, slug: true } },
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    }),

  findRelated: async (params: {
    imageId: string
    categoryId?: string
    galleryId: string
    limit?: number
  }) => {
    const { imageId, categoryId, galleryId, limit = 12 } = params

    // First, get images from the same gallery (excluding current image)
    const sameGalleryImages = await prisma.image.findMany({
      where: {
        galleryId,
        id: { not: imageId },
        gallery: { isPublic: true },
      },
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
        _count: { select: { likes: true, comments: true } },
      },
      take: Math.ceil(limit / 2),
      orderBy: { createdAt: 'desc' },
    })

    // Then, get images from the same category (if available)
    const sameCategoryImages = categoryId
      ? await prisma.image.findMany({
          where: {
            gallery: {
              categoryId,
              isPublic: true,
            },
            id: { not: imageId },
            galleryId: { not: galleryId }, // Exclude same gallery
          },
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
          take: limit - sameGalleryImages.length,
          orderBy: { createdAt: 'desc' },
        })
      : []

    // Combine and return unique images
    const allImages = [...sameGalleryImages, ...sameCategoryImages]
    const uniqueImages = allImages.filter(
      (img, index, self) => index === self.findIndex((t) => t.id === img.id)
    )

    return uniqueImages.slice(0, limit)
  },

  create: (data: {
    title?: string
    description?: string
    filename: string
    url: string
    thumbnailUrl?: string
    mimeType: string
    size: number
    width?: number
    height?: number
    galleryId: string
    userId: string
  }) => prisma.image.create({ data }),

  update: (id: string, data: { title?: string; description?: string }) =>
    prisma.image.update({ where: { id }, data }),

  delete: (id: string) => prisma.image.delete({ where: { id } }),

  findByGallery: (galleryId: string) =>
    prisma.image.findMany({
      where: { galleryId },
      orderBy: { createdAt: 'desc' },
    }),

  incrementView: (id: string) =>
    prisma.image.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }),
}
