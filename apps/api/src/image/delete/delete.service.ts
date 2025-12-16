import { imageRepository } from '../image.repository'

export const deleteService = {
  delete: async (imageId: string, userId: string) => {
    const image = await imageRepository.findById(imageId)
    if (!image) {
      return { success: false, message: 'Image tidak ditemukan' }
    }
    if (image.userId !== userId) {
      return { success: false, message: 'Tidak memiliki akses', forbidden: true }
    }

    await imageRepository.delete(imageId)
    return { success: true, message: 'Image berhasil dihapus' }
  },
}
