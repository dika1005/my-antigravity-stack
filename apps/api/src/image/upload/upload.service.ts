import { imageRepository } from "../image.repository";
import { galleryRepository } from "../../gallery/gallery.repository";

export const uploadService = {
    upload: async (
        userId: string,
        galleryId: string,
        data: {
            title?: string;
            description?: string;
            filename: string;
            url: string;
            thumbnailUrl?: string;
            mimeType: string;
            size: number;
            width?: number;
            height?: number;
        }
    ) => {
        // Check gallery exists and user owns it
        const gallery = await galleryRepository.findById(galleryId);
        if (!gallery) {
            return { success: false, message: "Gallery tidak ditemukan" };
        }
        if (gallery.user.id !== userId) {
            return { success: false, message: "Tidak memiliki akses", forbidden: true };
        }

        const image = await imageRepository.create({
            ...data,
            galleryId,
            userId,
        });

        return { success: true, image, message: "Image berhasil diupload" };
    },
};
