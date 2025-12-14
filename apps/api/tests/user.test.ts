import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { createTestApp, testUser, cleanupTestData, getCookieValue } from "./helper";
import { prisma } from "../src/lib/prisma";

describe("User Profile Flow", () => {
    const app = createTestApp();
    let accessToken: string = "";
    let userId: string = "";

    beforeAll(async () => {
        await cleanupTestData();

        const { hashPassword } = await import("../src/lib/password");
        const user = await prisma.user.create({
            data: {
                email: testUser.email,
                password: await hashPassword(testUser.password),
                name: testUser.name,
            },
        });
        userId = user.id;

        // Create some galleries
        await prisma.gallery.create({
            data: { title: "Gallery 1", slug: "gallery-1", userId, isPublic: true },
        });

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

    describe("Profile", () => {
        it("should get own profile", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/user/me", {
                    headers: { Cookie: `accessToken=${accessToken}` },
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.data.email).toBe(testUser.email);
        });

        it("should update profile", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/user/me", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `accessToken=${accessToken}`,
                    },
                    body: JSON.stringify({ name: "Updated Name", bio: "Hello world" }),
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.data.name).toBe("Updated Name");
            expect(body.data.bio).toBe("Hello world");
        });
    });

    describe("User Galleries", () => {
        it("should list user galleries", async () => {
            const res = await app.handle(
                new Request(`http://localhost/api/user/${userId}/galleries`)
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.data.length).toBeGreaterThan(0);
        });
    });
});
