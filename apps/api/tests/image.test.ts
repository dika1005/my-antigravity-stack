import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { createTestApp, testUser, testUser2, cleanupTestData, getCookieValue } from "./helper";
import { prisma } from "../src/lib/prisma";

describe("Image Flow - Comprehensive", () => {
    const app = createTestApp();
    let user1AccessToken: string = "";
    let user2AccessToken: string = "";
    let user1GalleryId: string = "";
    let user2GalleryId: string = "";
    let imageId: string = "";

    beforeAll(async () => {
        await cleanupTestData();

        const { hashPassword } = await import("../src/lib/password");

        // Create users
        const user1 = await prisma.user.create({
            data: { email: testUser.email, password: await hashPassword(testUser.password), name: testUser.name },
        });
        const user2 = await prisma.user.create({
            data: { email: testUser2.email, password: await hashPassword(testUser2.password), name: testUser2.name },
        });

        // Create galleries
        const gallery1 = await prisma.gallery.create({
            data: { title: "User 1 Gallery", slug: "user1-gallery", userId: user1.id },
        });
        user1GalleryId = gallery1.id;

        const gallery2 = await prisma.gallery.create({
            data: { title: "User 2 Gallery", slug: "user2-gallery", userId: user2.id },
        });
        user2GalleryId = gallery2.id;

        // Login users
        const res1 = await app.handle(
            new Request("http://localhost/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: testUser.email, password: testUser.password }),
            })
        );
        user1AccessToken = getCookieValue(res1.headers.get("set-cookie"), "accessToken") || "";

        const res2 = await app.handle(
            new Request("http://localhost/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: testUser2.email, password: testUser2.password }),
            })
        );
        user2AccessToken = getCookieValue(res2.headers.get("set-cookie"), "accessToken") || "";
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    // ==================== UPLOAD IMAGE ====================
    describe("1. Upload Image", () => {
        describe("Authorization", () => {
            it("should reject without authentication", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/image", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ galleryId: user1GalleryId, filename: "test.jpg", url: "http://test.com/img.jpg", mimeType: "image/jpeg", size: 1024 }),
                    })
                );
                expect(res.status).toBe(401);
            });

            it("should reject upload to another user's gallery", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/image", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `accessToken=${user2AccessToken}`,
                        },
                        body: JSON.stringify({ galleryId: user1GalleryId, filename: "hack.jpg", url: "http://hack.com/img.jpg", mimeType: "image/jpeg", size: 1024 }),
                    })
                );
                expect([403, 404]).toContain(res.status);
            });
        });

        describe("Validation", () => {
            it("should reject missing galleryId", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/image", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `accessToken=${user1AccessToken}`,
                        },
                        body: JSON.stringify({ filename: "test.jpg", url: "http://test.com/img.jpg", mimeType: "image/jpeg", size: 1024 }),
                    })
                );
                expect([400, 422]).toContain(res.status);
            });

            it("should reject empty body", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/image", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `accessToken=${user1AccessToken}`,
                        },
                        body: JSON.stringify({}),
                    })
                );
                expect([400, 422]).toContain(res.status);
            });
        });

        describe("Success", () => {
            it("should upload image to own gallery", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/image", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `accessToken=${user1AccessToken}`,
                        },
                        body: JSON.stringify({
                            galleryId: user1GalleryId,
                            filename: "beautiful-photo.jpg",
                            url: "https://example.com/beautiful-photo.jpg",
                            thumbnailUrl: "https://example.com/beautiful-photo-thumb.jpg",
                            mimeType: "image/jpeg",
                            size: 2048000,
                            width: 1920,
                            height: 1080,
                            title: "Beautiful Photo",
                            description: "A beautiful sunset",
                        }),
                    })
                );

                expect(res.status).toBe(201);
                const body = await res.json();
                expect(body.success).toBe(true);
                expect(body.data.title).toBe("Beautiful Photo");
                imageId = body.data.id;
            });

            it("should upload image with minimal data", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/image", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `accessToken=${user1AccessToken}`,
                        },
                        body: JSON.stringify({
                            galleryId: user1GalleryId,
                            filename: "minimal.jpg",
                            url: "https://example.com/minimal.jpg",
                            mimeType: "image/jpeg",
                            size: 1024,
                        }),
                    })
                );

                expect(res.status).toBe(201);
            });
        });
    });

    // ==================== UPDATE IMAGE ====================
    describe("2. Update Image", () => {
        describe("Authorization", () => {
            it("should reject update by non-owner", async () => {
                const res = await app.handle(
                    new Request(`http://localhost/api/image/${imageId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `accessToken=${user2AccessToken}`,
                        },
                        body: JSON.stringify({ title: "Hacked Title" }),
                    })
                );
                expect([403, 404]).toContain(res.status);
            });
        });

        describe("Success", () => {
            it("should update own image", async () => {
                const res = await app.handle(
                    new Request(`http://localhost/api/image/${imageId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `accessToken=${user1AccessToken}`,
                        },
                        body: JSON.stringify({ title: "Updated Title", description: "Updated desc" }),
                    })
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.data.title).toBe("Updated Title");
            });
        });
    });

    // ==================== DELETE IMAGE ====================
    describe("3. Delete Image", () => {
        describe("Authorization", () => {
            it("should reject delete by non-owner", async () => {
                const res = await app.handle(
                    new Request(`http://localhost/api/image/${imageId}`, {
                        method: "DELETE",
                        headers: { Cookie: `accessToken=${user2AccessToken}` },
                    })
                );
                expect([403, 404]).toContain(res.status);
            });
        });

        describe("Success", () => {
            it("should delete own image", async () => {
                const res = await app.handle(
                    new Request(`http://localhost/api/image/${imageId}`, {
                        method: "DELETE",
                        headers: { Cookie: `accessToken=${user1AccessToken}` },
                    })
                );
                expect(res.status).toBe(200);
            });

            it("should return 404 for deleted image", async () => {
                const res = await app.handle(
                    new Request(`http://localhost/api/image/${imageId}`, {
                        method: "DELETE",
                        headers: { Cookie: `accessToken=${user1AccessToken}` },
                    })
                );
                expect(res.status).toBe(404);
            });
        });
    });
});
