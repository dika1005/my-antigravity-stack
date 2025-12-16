import { galleryRepository } from '../gallery.repository'

export const deleteService = {
  delete: async (galleryId: string, userId: string) => {
    // Check gallery exists
    const gallery = await galleryRepository.findById(galleryId)

    if (!gallery) {
      return { success: false, message: 'Gallery tidak ditemukan' }
    }

    // Check ownership
    if (gallery.user.id !== userId) {
      return { success: false, message: 'Tidak memiliki akses', forbidden: true }
    }

    await galleryRepository.delete(galleryId)

    return { success: true, message: 'Gallery berhasil dihapus' }
  },
}
