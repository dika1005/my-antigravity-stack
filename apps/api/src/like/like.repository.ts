import { prisma } from '@lib/prisma'

export const likeRepository = {
  findByUserAndGallery: (userId: string, galleryId: string) =>
    prisma.like.findUnique({ where: { userId_galleryId: { userId, galleryId } } }),

  findByUserAndImage: (userId: string, imageId: string) =>
    prisma.like.findUnique({ where: { userId_imageId: { userId, imageId } } }),

  likeGallery: (userId: string, galleryId: string) =>
    prisma.like.create({ data: { userId, galleryId } }),

  likeImage: (userId: string, imageId: string) => prisma.like.create({ data: { userId, imageId } }),

  unlike: (id: string) => prisma.like.delete({ where: { id } }),

  countByGallery: (galleryId: string) => prisma.like.count({ where: { galleryId } }),

  countByImage: (imageId: string) => prisma.like.count({ where: { imageId } }),
}
