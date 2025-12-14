import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "../src/auth";
import { galleryRoutes } from "../src/gallery";
import { imageRoutes } from "../src/image";
import { categoryRoutes } from "../src/category";
import { userRoutes } from "../src/user";
import { likeRoutes } from "../src/like";
import { commentRoutes } from "../src/comment";
import { tagRoutes } from "../src/tag";
import { prisma } from "../src/lib/prisma";

/**
 * Create test app instance
 */
export function createTestApp() {
    return new Elysia({ prefix: "/api" })
        .use(cors({ origin: "*", credentials: true }))
        .use(authRoutes)
        .use(galleryRoutes)
        .use(imageRoutes)
        .use(categoryRoutes)
        .use(userRoutes)
        .use(likeRoutes)
        .use(commentRoutes)
        .use(tagRoutes);
}

/**
 * Test user credentials
 */
export const testUser = {
    email: "test@example.com",
    password: "Test123456",
    name: "Test User",
};

export const testUser2 = {
    email: "test2@example.com",
    password: "Test123456",
    name: "Test User 2",
};

/**
 * Clean up test data
 */
export async function cleanupTestData() {
    await prisma.comment.deleteMany({});
    await prisma.like.deleteMany({});
    await prisma.tagsOnImages.deleteMany({});
    await prisma.tagsOnGalleries.deleteMany({});
    await prisma.image.deleteMany({});
    await prisma.gallery.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.verificationToken.deleteMany({});
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.pendingUser.deleteMany({});
}

/**
 * Parse set-cookie header to get cookie value
 */
export function getCookieValue(setCookieHeader: string | string[] | null, name: string): string | null {
    if (!setCookieHeader) return null;

    const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    for (const cookie of cookies) {
        if (cookie.startsWith(`${name}=`)) {
            const value = cookie.split(";")[0]?.split("=")[1];
            return value || null;
        }
    }
    return null;
}
