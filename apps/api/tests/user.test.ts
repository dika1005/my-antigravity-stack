import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { createTestApp, testUser, testUser2, cleanupTestData, getCookieValue } from "./helper";
import { prisma } from "../src/lib/prisma";

describe("User Profile - Comprehensive", () => {
    const app = createTestApp();
    let user1AccessToken: string = "";
    let user2AccessToken: string = "";
    let user1Id: string = "";
    let user2Id: string = "";

    beforeAll(async () => {
        await cleanupTestData();

        const { hashPassword } = await import("../src/lib/password");

        const user1 = await prisma.user.create({
            data: { email: testUser.email, password: await hashPassword(testUser.password), name: testUser.name },
        });
        user1Id = user1.id;

        const user2 = await prisma.user.create({
            data: { email: testUser2.email, password: await hashPassword(testUser2.password), name: testUser2.name },
        });
        user2Id = user2.id;

        // Create galleries for user 1
        await prisma.gallery.createMany({
            data: [
                { title: "Gallery 1", slug: "gallery-1", userId: user1Id, isPublic: true },
                { title: "Gallery 2", slug: "gallery-2", userId: user1Id, isPublic: true },
                { title: "Private Gallery", slug: "private-gallery", userId: user1Id, isPublic: false },
            ],
        });

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

    // ==================== GET PROFILE ====================
    describe("1. Get Profile (/me)", () => {
        describe("Authorization", () => {
            it("should reject without authentication", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/user/me")
                );
                expect(res.status).toBe(401);
            });

            it("should reject with invalid token", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/user/me", {
                        headers: { Cookie: "accessToken=invalid-token" },
                    })
                );
                expect(res.status).toBe(401);
            });
        });

        describe("Success", () => {
            it("should get own profile", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/user/me", {
                        headers: { Cookie: `accessToken=${user1AccessToken}` },
                    })
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.data.email).toBe(testUser.email);
                expect(body.data.name).toBe(testUser.name);
            });

            it("should not expose password in response", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/user/me", {
                        headers: { Cookie: `accessToken=${user1AccessToken}` },
                    })
                );

                const body = await res.json();
                expect(body.data.password).toBeUndefined();
            });

            it("should return correct user for each token", async () => {
                const res2 = await app.handle(
                    new Request("http://localhost/api/user/me", {
                        headers: { Cookie: `accessToken=${user2AccessToken}` },
                    })
                );

                const body2 = await res2.json();
                expect(body2.data.email).toBe(testUser2.email);
            });
        });
    });

    // ==================== UPDATE PROFILE ====================
    describe("2. Update Profile", () => {
        describe("Authorization", () => {
            it("should reject without authentication", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/user/me", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: "Hacked Name" }),
                    })
                );
                expect(res.status).toBe(401);
            });
        });

        describe("Success", () => {
            it("should update name", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/user/me", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `accessToken=${user1AccessToken}`,
                        },
                        body: JSON.stringify({ name: "Updated Name" }),
                    })
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.data.name).toBe("Updated Name");
            });

            it("should update bio", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/user/me", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `accessToken=${user1AccessToken}`,
                        },
                        body: JSON.stringify({ bio: "Hello, I'm a photographer!" }),
                    })
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.data.bio).toBe("Hello, I'm a photographer!");
            });

            it("should update avatar", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/user/me", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `accessToken=${user1AccessToken}`,
                        },
                        body: JSON.stringify({ avatar: "https://example.com/avatar.jpg" }),
                    })
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.data.avatar).toBe("https://example.com/avatar.jpg");
            });

            it("should update multiple fields at once", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/user/me", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `accessToken=${user1AccessToken}`,
                        },
                        body: JSON.stringify({ name: "Final Name", bio: "Final bio" }),
                    })
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.data.name).toBe("Final Name");
                expect(body.data.bio).toBe("Final bio");
            });
        });
    });

    // ==================== GET USER GALLERIES ====================
    describe("3. Get User Galleries", () => {
        describe("Public Access", () => {
            it("should list public galleries without auth", async () => {
                const res = await app.handle(
                    new Request(`http://localhost/api/user/${user1Id}/galleries`)
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.data.length).toBe(2); // Only public galleries
            });

            it("should list only public galleries for other users", async () => {
                const res = await app.handle(
                    new Request(`http://localhost/api/user/${user1Id}/galleries`, {
                        headers: { Cookie: `accessToken=${user2AccessToken}` },
                    })
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                body.data.forEach((gallery: any) => {
                    expect(gallery.isPublic).toBe(true);
                });
            });
        });

        describe("Owner Access", () => {
            it("should list all galleries including private for owner", async () => {
                const res = await app.handle(
                    new Request(`http://localhost/api/user/${user1Id}/galleries`, {
                        headers: { Cookie: `accessToken=${user1AccessToken}` },
                    })
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.data.length).toBe(3); // All 3 galleries including private
            });
        });

        describe("Pagination", () => {
            it("should support pagination", async () => {
                const res = await app.handle(
                    new Request(`http://localhost/api/user/${user1Id}/galleries?page=1&limit=2`)
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.meta.page).toBe(1);
                expect(body.meta.limit).toBe(2);
                expect(body.data.length).toBeLessThanOrEqual(2);
            });
        });

        describe("Non-existent User", () => {
            it("should return empty array for non-existent user", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/user/non-existent-user-id/galleries")
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.data.length).toBe(0);
            });
        });
    });
});
