import { prisma } from "@lib/prisma";

/**
 * Image Repository - Shared database queries for image module
 */
export const imageRepository = {
    findById: (id: string) =>
        prisma.image.findUnique({
            where: { id },
            include: { user: { select: { id: true } }, gallery: { select: { id: true, userId: true } } },
        }),

    create: (data: {
        title?: string;
        description?: string;
        filename: string;
        url: string;
        thumbnailUrl?: string;
        mimeType: string;
        size: number;
        width?: number;
        height?: number;
        galleryId: string;
        userId: string;
    }) => prisma.image.create({ data }),

    update: (
        id: string,
        data: { title?: string; description?: string }
    ) => prisma.image.update({ where: { id }, data }),

    delete: (id: string) => prisma.image.delete({ where: { id } }),

    findByGallery: (galleryId: string) =>
        prisma.image.findMany({
            where: { galleryId },
            orderBy: { createdAt: "desc" },
        }),
};
