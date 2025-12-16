import { prisma } from '@lib/prisma'

/**
 * Search Repository - Database queries for global search
 */
export const searchRepository = {
  searchAll: async (params: {
    query: string
    type?: 'gallery' | 'image' | 'user' | 'all'
    page: number
    limit: number
  }) => {
    const { query, type = 'all', page, limit } = params
    const skip = (page - 1) * limit
    const searchTerm = `%${query}%`

    const results: {
      galleries: any[]
      images: any[]
      users: any[]
      total: { galleries: number; images: number; users: number }
    } = {
      galleries: [],
      images: [],
      users: [],
      total: { galleries: 0, images: 0, users: 0 },
    }

    // Search Galleries
    if (type === 'all' || type === 'gallery') {
      const [galleries, galleryCount] = await Promise.all([
        prisma.gallery.findMany({
          where: {
            isPublic: true,
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
          },
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            category: { select: { id: true, name: true, slug: true } },
            _count: { select: { images: true, likes: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: type === 'gallery' ? skip : 0,
          take: type === 'gallery' ? limit : 5,
        }),
        prisma.gallery.count({
          where: {
            isPublic: true,
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
          },
        }),
      ])
      results.galleries = galleries
      results.total.galleries = galleryCount
    }

    // Search Images
    if (type === 'all' || type === 'image') {
      const [images, imageCount] = await Promise.all([
        prisma.image.findMany({
          where: {
            gallery: { isPublic: true },
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
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
          orderBy: { createdAt: 'desc' },
          skip: type === 'image' ? skip : 0,
          take: type === 'image' ? limit : 5,
        }),
        prisma.image.count({
          where: {
            gallery: { isPublic: true },
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
          },
        }),
      ])
      results.images = images
      results.total.images = imageCount
    }

    // Search Users
    if (type === 'all' || type === 'user') {
      const [users, userCount] = await Promise.all([
        prisma.user.findMany({
          where: {
            isActive: true,
            name: { contains: query },
          },
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            _count: { select: { galleries: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: type === 'user' ? skip : 0,
          take: type === 'user' ? limit : 5,
        }),
        prisma.user.count({
          where: {
            isActive: true,
            name: { contains: query },
          },
        }),
      ])
      results.users = users
      results.total.users = userCount
    }

    return results
  },
}
