import { galleryRepository } from "../gallery.repository";

export const detailService = {
    getBySlug: async (slug: string) => {
        const gallery = await galleryRepository.findBySlug(slug);

        if (!gallery) {
            return { success: false, message: "Gallery tidak ditemukan" };
        }

        // Only show if public
        if (!gallery.isPublic) {
            return { success: false, message: "Gallery tidak ditemukan" };
        }

        // Increment view count
        await galleryRepository.incrementView(gallery.id);

        return { success: true, gallery };
    },
};
