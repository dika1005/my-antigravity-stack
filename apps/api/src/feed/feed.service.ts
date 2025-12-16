import { feedRepository } from "./feed.repository";

export const feedService = {
    getImages: async (params: {
        page?: number;
        limit?: number;
        categoryId?: string;
    }) => {
        const page = params.page || 1;
        const limit = Math.min(params.limit || 20, 50);

        const result = await feedRepository.findImages({
            page,
            limit,
            categoryId: params.categoryId,
        });

        return {
            success: true,
            images: result.images,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
                hasMore: page * limit < result.total,
            },
        };
    },
};