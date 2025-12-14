import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { createTestApp, testUser, cleanupTestData, getCookieValue } from "./helper";
import { prisma } from "../src/lib/prisma";

describe("Gallery Flow", () => {
    const app = createTestApp();
    let accessToken: string = "";
    let refreshToken: string = "";
    let userId: string = "";
    let galleryId: string = "";
    let gallerySlug: string = "";

    beforeAll(async () => {
        await cleanupTestData();

        // Create verified user directly
        const { hashPassword } = await import("../src/lib/password");
        const user = await prisma.user.create({
            data: {
                email: testUser.email,
                password: await hashPassword(testUser.password),
                name: testUser.name,
            },
        });
        userId = user.id;

        // Login to get tokens
        const res = await app.handle(
            new Request("http://localhost/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: testUser.email, password: testUser.password }),
            })
        );
        const setCookie = res.headers.get("set-cookie");
        accessToken = getCookieValue(setCookie, "accessToken") || "";
        refreshToken = getCookieValue(setCookie, "refreshToken") || "";
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    describe("1. Create Gallery", () => {
        it("should create gallery when authenticated", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/gallery", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `accessToken=${accessToken}`,
                    },
                    body: JSON.stringify({
                        title: "My Test Gallery",
                        description: "A test gallery",
                        isPublic: true,
                    }),
                })
            );

            expect(res.status).toBe(201);
            const body = await res.json();
            expect(body.success).toBe(true);
            expect(body.data.title).toBe("My Test Gallery");
            galleryId = body.data.id;
            gallerySlug = body.data.slug;
        });

        it("should reject without auth", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/gallery", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: "Unauthorized Gallery" }),
                })
            );

            expect(res.status).toBe(401);
        });
    });

    describe("2. List Galleries", () => {
        it("should list public galleries", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/gallery")
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.success).toBe(true);
            expect(body.data.length).toBeGreaterThan(0);
        });

        it("should support pagination", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/gallery?page=1&limit=5")
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.meta).toBeDefined();
            expect(body.meta.page).toBe(1);
        });
    });

    describe("3. Get Gallery Detail", () => {
        it("should get gallery by slug", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/gallery/${gallerySlug}`)
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.success).toBe(true);
            expect(body.data.slug).toBe(gallerySlug);
        });

        it("should return 404 for non-existent gallery", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/gallery/non-existent-slug")
            );

            expect(res.status).toBe(404);
        });
    });

    describe("4. Update Gallery", () => {
        it("should update own gallery", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/gallery/${galleryId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `accessToken=${accessToken}`,
                    },
                    body: JSON.stringify({ title: "Updated Gallery Title" }),
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.data.title).toBe("Updated Gallery Title");
        });
    });

    describe("5. Delete Gallery", () => {
        it("should delete own gallery", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/gallery/${galleryId}`, {
                    method: "DELETE",
                    headers: { Cookie: `accessToken=${accessToken}` },
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.success).toBe(true);
        });
    });
});
