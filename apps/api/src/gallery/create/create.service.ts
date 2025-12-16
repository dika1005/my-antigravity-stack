import { galleryRepository } from '../gallery.repository'
import { generateSlug, generateUniqueSlug } from '@lib/token'

export const createService = {
  create: async (
    userId: string,
    data: {
      title: string
      description?: string
      categoryId?: string
      isPublic?: boolean
    }
  ) => {
    // Generate slug
    let slug = generateSlug(data.title)

    // Check if slug exists
    if (await galleryRepository.slugExists(slug)) {
      slug = generateUniqueSlug(data.title)
    }

    const gallery = await galleryRepository.create({
      title: data.title,
      slug,
      description: data.description,
      categoryId: data.categoryId,
      isPublic: data.isPublic ?? true,
      userId,
    })

    return { success: true, gallery, message: 'Gallery berhasil dibuat' }
  },
}
