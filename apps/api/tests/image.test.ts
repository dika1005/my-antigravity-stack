import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { createTestApp, testUser, cleanupTestData, getCookieValue } from "./helper";
import { prisma } from "../src/lib/prisma";

describe("Image Flow", () => {
    const app = createTestApp();
    let accessToken: string = "";
    let galleryId: string = "";
    let imageId: string = "";

    beforeAll(async () => {
        await cleanupTestData();

        // Create user and gallery
        const { hashPassword } = await import("../src/lib/password");
        const user = await prisma.user.create({
            data: {
                email: testUser.email,
                password: await hashPassword(testUser.password),
                name: testUser.name,
            },
        });

        const gallery = await prisma.gallery.create({
            data: {
                title: "Test Gallery",
                slug: "test-gallery",
                userId: user.id,
            },
        });
        galleryId = gallery.id;

        // Login
        const res = await app.handle(
            new Request("http://localhost/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: testUser.email, password: testUser.password }),
            })
        );
        accessToken = getCookieValue(res.headers.get("set-cookie"), "accessToken") || "";
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe("1. Upload Image", () => {
        it("should upload image to gallery", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/image", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `accessToken=${accessToken}`,
                    },
                    body: JSON.stringify({
                        galleryId,
                        filename: "test.jpg",
                        url: "https://example.com/test.jpg",
                        mimeType: "image/jpeg",
                        size: 1024,
                    }),
                })
            );

            expect(res.status).toBe(201);
            const body = await res.json();
            expect(body.success).toBe(true);
            imageId = body.data.id;
        });
    });

    describe("2. Update Image", () => {
        it("should update image metadata", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/image/${imageId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `accessToken=${accessToken}`,
                    },
                    body: JSON.stringify({ title: "Updated Title" }),
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.data.title).toBe("Updated Title");
        });
    });

    describe("3. Delete Image", () => {
        it("should delete own image", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/image/${imageId}`, {
                    method: "DELETE",
                    headers: { Cookie: `accessToken=${accessToken}` },
                })
            );

            expect(res.status).toBe(200);
        });
    });
});
