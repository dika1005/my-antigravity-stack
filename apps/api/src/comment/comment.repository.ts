import { prisma } from "@lib/prisma";

export const commentRepository = {
    findByGallery: (galleryId: string, page: number, limit: number) =>
        prisma.comment.findMany({
            where: { galleryId, parentId: null },
            include: {
                user: { select: { id: true, name: true, avatar: true } },
                replies: {
                    include: { user: { select: { id: true, name: true, avatar: true } } },
                    orderBy: { createdAt: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),

    countByGallery: (galleryId: string) =>
        prisma.comment.count({ where: { galleryId } }),

    findById: (id: string) =>
        prisma.comment.findUnique({ where: { id }, include: { user: { select: { id: true } } } }),

    create: (data: { content: string; userId: string; galleryId?: string; imageId?: string; parentId?: string }) =>
        prisma.comment.create({
            data,
            include: { user: { select: { id: true, name: true, avatar: true } } },
        }),

    delete: (id: string) => prisma.comment.delete({ where: { id } }),
};
