import { prisma } from "@lib/prisma";
import { generateSlug } from "@lib/token";

export const tagRepository = {
    findAll: () =>
        prisma.tag.findMany({
            include: { _count: { select: { galleries: true, images: true } } },
            orderBy: { name: "asc" },
        }),

    findBySlug: (slug: string) => prisma.tag.findUnique({ where: { slug } }),

    create: (name: string) =>
        prisma.tag.create({ data: { name, slug: generateSlug(name) } }),

    findOrCreate: async (name: string) => {
        const slug = generateSlug(name);
        let tag = await prisma.tag.findUnique({ where: { slug } });
        if (!tag) {
            tag = await prisma.tag.create({ data: { name, slug } });
        }
        return tag;
    },
};
