import { prisma } from "@lib/prisma";
import { generateSlug } from "@lib/token";

export const categoryRepository = {
    findAll: () =>
        prisma.category.findMany({
            include: { _count: { select: { galleries: true } } },
            orderBy: { name: "asc" },
        }),

    findById: (id: string) => prisma.category.findUnique({ where: { id } }),

    findBySlug: (slug: string) => prisma.category.findUnique({ where: { slug } }),

    create: (data: { name: string; description?: string; coverImage?: string }) =>
        prisma.category.create({
            data: { ...data, slug: generateSlug(data.name) },
        }),

    update: (id: string, data: { name?: string; description?: string; coverImage?: string }) =>
        prisma.category.update({
            where: { id },
            data: { ...data, ...(data.name && { slug: generateSlug(data.name) }) },
        }),

    delete: (id: string) => prisma.category.delete({ where: { id } }),
};
