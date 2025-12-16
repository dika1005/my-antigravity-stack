import { imageRepository } from "../image.repository";

export const detailService = {
    getImageDetail: async (id: string) => {
        const image = await imageRepository.findByIdWithDetails(id);

        if (!image) {
            return { success: false, error: "Image not found" };
        }

        // Check if gallery is public
        if (!image.gallery) {
            return { success: false, error: "Image not found" };
        }

        // Increment view count (fire and forget)
        imageRepository.incrementView(id).catch(() => { });

        return {
            success: true,
            image,
        };
    },

    getRelatedImages: async (id: string, limit?: number) => {
        const image = await imageRepository.findByIdWithDetails(id);

        if (!image || !image.gallery) {
            return { success: false, error: "Image not found", images: [] };
        }

        const relatedImages = await imageRepository.findRelated({
            imageId: id,
            categoryId: image.gallery.category?.id,
            galleryId: image.gallery.id,
            limit: limit || 12,
        });

        return {
            success: true,
            images: relatedImages,
        };
    },
};
