import { galleryRepository } from '../gallery.repository'
import { generateSlug, generateUniqueSlug } from '@lib/token'

export const updateService = {
  update: async (
    galleryId: string,
    userId: string,
    data: {
      title?: string
      description?: string
      categoryId?: string
      isPublic?: boolean
      coverImage?: string
    }
  ) => {
    // Check gallery exists
    const gallery = await galleryRepository.findById(galleryId)

    if (!gallery) {
      return { success: false, message: 'Gallery tidak ditemukan' }
    }

    // Check ownership
    if (gallery.user.id !== userId) {
      return { success: false, message: 'Tidak memiliki akses', forbidden: true }
    }

    // Generate new slug if title changed
    let slug: string | undefined
    if (data.title && data.title !== gallery.title) {
      slug = generateSlug(data.title)
      if (await galleryRepository.slugExists(slug, galleryId)) {
        slug = generateUniqueSlug(data.title)
      }
    }

    const updated = await galleryRepository.update(galleryId, {
      ...data,
      ...(slug && { slug }),
    })

    return { success: true, gallery: updated, message: 'Gallery berhasil diupdate' }
  },
}
