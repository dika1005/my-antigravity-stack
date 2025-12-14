import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { createTestApp, testUser, cleanupTestData, getCookieValue } from "./helper";

describe("Auth Flow", () => {
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

    describe("1. Register", () => {
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
            expect(body.message).toContain("Registrasi berhasil");
        });

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

        it("should reject weak password", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...testUser, email: "weak@test.com", password: "123" }),
                })
            );

            expect(res.status).toBe(400);
        });
    });

    describe("2. Verify Email", () => {
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

        it("should reject invalid token", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/auth/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: "invalid-token" }),
                })
            );

            expect(res.status).toBe(400);
        });
    });

    describe("3. Login", () => {
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

            // Get cookies from response
            const setCookie = res.headers.get("set-cookie");
            accessToken = getCookieValue(setCookie, "accessToken");
            refreshToken = getCookieValue(setCookie, "refreshToken");
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();
        });

        it("should reject wrong password", async () => {
            const res = await app.handle(
                new Request("http://localhost/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: testUser.email, password: "wrongpassword" }),
                })
            );

            expect(res.status).toBe(401);
        });
    });

    describe("4. Refresh Token", () => {
        it("should refresh access token", async () => {
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
        });
    });

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
    });
});
