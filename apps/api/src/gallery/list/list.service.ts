import { galleryRepository } from "../gallery.repository";

export const listService = {
    list: async (params: {
        page?: number;
        limit?: number;
        categoryId?: string;
        search?: string;
    }) => {
        const page = params.page || 1;
        const limit = Math.min(params.limit || 10, 50); // Max 50

        const result = await galleryRepository.findAll({
            page,
            limit,
            categoryId: params.categoryId,
            search: params.search,
            isPublic: true, // Only public galleries
        });

        return {
            success: true,
            galleries: result.galleries,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    },
};
