import { imageRepository } from "../image.repository";

export const updateService = {
    update: async (imageId: string, userId: string, data: { title?: string; description?: string }) => {
        const image = await imageRepository.findById(imageId);
        if (!image) {
            return { success: false, message: "Image tidak ditemukan" };
        }
        if (image.userId !== userId) {
            return { success: false, message: "Tidak memiliki akses", forbidden: true };
        }

        const updated = await imageRepository.update(imageId, data);
        return { success: true, image: updated, message: "Image berhasil diupdate" };
    },
};
