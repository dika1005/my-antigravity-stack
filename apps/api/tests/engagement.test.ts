import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { createTestApp, testUser, cleanupTestData, getCookieValue } from "./helper";
import { prisma } from "../src/lib/prisma";

describe("Like & Comment Flow", () => {
    const app = createTestApp();
    let accessToken: string = "";
    let galleryId: string = "";
    let commentId: string = "";

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
                isPublic: true,
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

    describe("Like", () => {
        it("should like gallery", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/like/gallery/${galleryId}`, {
                    method: "POST",
                    headers: { Cookie: `accessToken=${accessToken}` },
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.data.liked).toBe(true);
            expect(body.data.count).toBe(1);
        });

        it("should unlike gallery", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/like/gallery/${galleryId}`, {
                    method: "DELETE",
                    headers: { Cookie: `accessToken=${accessToken}` },
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.data.liked).toBe(false);
            expect(body.data.count).toBe(0);
        });
    });

    describe("Comment", () => {
        it("should add comment to gallery", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/comment/gallery/${galleryId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `accessToken=${accessToken}`,
                    },
                    body: JSON.stringify({ content: "Great gallery!" }),
                })
            );

            expect(res.status).toBe(201);
            const body = await res.json();
            expect(body.data.content).toBe("Great gallery!");
            commentId = body.data.id;
        });

        it("should list gallery comments", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/comment/gallery/${galleryId}`)
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.data.length).toBeGreaterThan(0);
        });

        it("should delete own comment", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/comment/${commentId}`, {
                    method: "DELETE",
                    headers: { Cookie: `accessToken=${accessToken}` },
                })
            );

            expect(res.status).toBe(200);
        });
    });
});
