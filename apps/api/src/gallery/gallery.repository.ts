import { prisma } from '@lib/prisma'

/**
 * Gallery Repository - Shared database queries for gallery module
 */
export const galleryRepository = {
  // ==================== LIST ====================
  findAll: async (params: {
    page: number
    limit: number
    categoryId?: string
    search?: string
    userId?: string
    isPublic?: boolean
  }) => {
    const { page, limit, categoryId, search, userId, isPublic } = params
    const skip = (page - 1) * limit

    const where = {
      ...(isPublic !== undefined && { isPublic }),
      ...(categoryId && { categoryId }),
      ...(userId && { userId }),
      ...(search && {
        OR: [{ title: { contains: search } }, { description: { contains: search } }],
      }),
    }

    const [galleries, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { images: true, likes: true, comments: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.gallery.count({ where }),
    ])

    return { galleries, total }
  },

  // ==================== DETAIL ====================
  findBySlug: (slug: string) =>
    prisma.gallery
      .findUnique({
        where: { slug },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { createdAt: 'desc' } },
          tags: { include: { tag: true } },
          _count: { select: { likes: true, comments: true } },
        },
      })
      .then((gallery) => {
        // viewCount sudah otomatis included karena pakai include (bukan select)
        return gallery
      }),

  findById: (id: string) =>
    prisma.gallery.findUnique({
      where: { id },
      include: { user: { select: { id: true } } },
    }),

  // ==================== CREATE ====================
  create: (data: {
    title: string
    slug: string
    description?: string
    categoryId?: string
    isPublic?: boolean
    userId: string
  }) => prisma.gallery.create({ data }),

  // ==================== UPDATE ====================
  update: (
    id: string,
    data: {
      title?: string
      slug?: string
      description?: string
      categoryId?: string
      isPublic?: boolean
      coverImage?: string
    }
  ) => prisma.gallery.update({ where: { id }, data }),

  // ==================== DELETE ====================
  delete: (id: string) => prisma.gallery.delete({ where: { id } }),

  // ==================== CHECK SLUG EXISTS ====================
  slugExists: async (slug: string, excludeId?: string) => {
    const gallery = await prisma.gallery.findUnique({ where: { slug } })
    if (!gallery) return false
    if (excludeId && gallery.id === excludeId) return false
    return true
  },

  // ==================== INCREMENT VIEW ====================
  incrementView: (id: string) =>
    prisma.gallery.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }),
}
