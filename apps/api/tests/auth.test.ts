import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { createTestApp, testUser, cleanupTestData, getCookieValue } from "./helper";

describe("Auth Flow - Comprehensive", () => {
    const app = createTestApp();
    let accessToken: string | null = null;
    let refreshToken: string | null = null;
    let verificationToken: string | null = null;

    beforeAll(async () => {
        await cleanupTestData();
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    // ==================== REGISTER ====================
    describe("1. Register", () => {
        describe("Validation Errors", () => {
            it("should reject empty body", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({}),
                    })
                );
                // Elysia returns 400 for validation errors
                expect([400, 422]).toContain(res.status);
            });

            it("should reject missing email", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ password: "Test123456" }),
                    })
                );
                expect([400, 422]).toContain(res.status);
            });

            it("should reject missing password", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: "test@test.com" }),
                    })
                );
                expect([400, 422]).toContain(res.status);
            });
        });

        describe("Success Cases", () => {
            it("should register new user successfully", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(testUser),
                    })
                );

                expect(res.status).toBe(201);
                const body = await res.json();
                expect(body.success).toBe(true);
            });

            it("should register user with optional name", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: "withname@test.com",
                            password: "Test123456",
                            name: "John Doe",
                        }),
                    })
                );
                expect(res.status).toBe(201);
            });
        });

        describe("Duplicate Check", () => {
            it("should reject duplicate email", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(testUser),
                    })
                );

                expect(res.status).toBe(400);
                const body = await res.json();
                expect(body.success).toBe(false);
            });
        });
    });

    // ==================== VERIFY EMAIL ====================
    describe("2. Verify Email", () => {
        describe("Invalid Token", () => {
            it("should reject empty token", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: "" }),
                    })
                );
                expect(res.status).toBe(400);
            });

            it("should reject invalid token format", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: "invalid-token-12345" }),
                    })
                );
                expect(res.status).toBe(400);
            });

            it("should reject random UUID token", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: "550e8400-e29b-41d4-a716-446655440000" }),
                    })
                );
                expect(res.status).toBe(400);
            });
        });

        describe("Valid Token", () => {
            it("should get verification token from database", async () => {
                const { prisma } = await import("../src/lib/prisma");
                const pending = await prisma.pendingUser.findUnique({
                    where: { email: testUser.email },
                });
                expect(pending).not.toBeNull();
                verificationToken = pending!.verificationToken;
            });

            it("should verify email with valid token", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: verificationToken }),
                    })
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.success).toBe(true);
            });

            it("should reject already used token", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: verificationToken }),
                    })
                );
                expect(res.status).toBe(400);
            });
        });
    });

    // ==================== LOGIN ====================
    describe("3. Login", () => {
        describe("Validation Errors", () => {
            it("should reject empty body", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({}),
                    })
                );
                expect([400, 422]).toContain(res.status);
            });

            it("should reject missing email", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ password: "Test123456" }),
                    })
                );
                expect([400, 422]).toContain(res.status);
            });

            it("should reject missing password", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: testUser.email }),
                    })
                );
                expect([400, 422]).toContain(res.status);
            });
        });

        describe("Authentication Errors", () => {
            it("should reject wrong password", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: testUser.email, password: "wrongpassword123" }),
                    })
                );

                expect(res.status).toBe(401);
                const body = await res.json();
                expect(body.success).toBe(false);
            });

            it("should reject non-existent email", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: "notexist@test.com", password: "Test123456" }),
                    })
                );

                expect(res.status).toBe(401);
            });
        });

        describe("Success Cases", () => {
            it("should login successfully and set cookies", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: testUser.email, password: testUser.password }),
                    })
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.success).toBe(true);
                expect(body.data.user.email).toBe(testUser.email);

                // Get cookies - may be in different formats
                const setCookie = res.headers.get("set-cookie");
                accessToken = getCookieValue(setCookie, "accessToken");
                refreshToken = getCookieValue(setCookie, "refreshToken");

                // Tokens might be in body instead of cookies
                if (!accessToken && body.data.accessToken) {
                    accessToken = body.data.accessToken;
                }
                if (!refreshToken && body.data.refreshToken) {
                    refreshToken = body.data.refreshToken;
                }
            });

            it("should return user data without password", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: testUser.email, password: testUser.password }),
                    })
                );

                const body = await res.json();
                expect(body.data.user.password).toBeUndefined();
                expect(body.data.user.id).toBeDefined();
            });
        });
    });

    // ==================== REFRESH TOKEN ====================
    describe("4. Refresh Token", () => {
        describe("Error Cases", () => {
            it("should reject without refresh token cookie", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/refresh", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                    })
                );

                expect(res.status).toBe(401);
            });

            it("should reject invalid refresh token", async () => {
                const res = await app.handle(
                    new Request("http://localhost/api/auth/refresh", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: "refreshToken=invalid-token-12345",
                        },
                    })
                );

                expect(res.status).toBe(401);
            });
        });

        describe("Success Cases", () => {
            it("should refresh access token with valid refresh token", async () => {
                if (!refreshToken) return;

                const res = await app.handle(
                    new Request("http://localhost/api/auth/refresh", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: `refreshToken=${refreshToken}`,
                        },
                    })
                );

                expect(res.status).toBe(200);
                const body = await res.json();
                expect(body.success).toBe(true);

                // Should set new access token cookie
                const setCookie = res.headers.get("set-cookie");
                const newAccessToken = getCookieValue(setCookie, "accessToken");
                expect(newAccessToken).not.toBeNull();
            });
        });
    });

    // ==================== LOGOUT ====================
    describe("5. Logout", () => {
        it("should logout and clear cookies", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/auth/logout", {
                    method: "POST",
                    headers: {
                        Cookie: `refreshToken=${refreshToken}`,
                    },
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.success).toBe(true);
        });

        it("should still work without refresh token", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/auth/logout", {
                    method: "POST",
                })
            );

            expect(res.status).toBe(200);
        });
    });
});
