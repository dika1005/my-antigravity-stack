import { prisma } from "@lib/prisma";

/**
 * Auth Repository - Shared database queries for auth module
 */
export const authRepository = {
    // ==================== USER ====================
    findUserByEmail: (email: string) =>
        prisma.user.findUnique({ where: { email } }),

    findUserById: (id: string) =>
        prisma.user.findUnique({ where: { id } }),

    createUser: (data: { email: string; password: string; name?: string }) =>
        prisma.user.create({ data }),

    // ==================== PENDING USER ====================
    findPendingByEmail: (email: string) =>
        prisma.pendingUser.findUnique({ where: { email } }),

    findPendingByToken: (token: string) =>
        prisma.pendingUser.findUnique({ where: { verificationToken: token } }),

    createPendingUser: (data: {
        email: string;
        password: string;
        name?: string;
        verificationToken: string;
        expiresAt: Date;
    }) => prisma.pendingUser.create({ data }),

    deletePendingUser: (id: string) =>
        prisma.pendingUser.delete({ where: { id } }),

    // ==================== REFRESH TOKEN ====================
    findRefreshToken: (token: string) =>
        prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        }),

    createRefreshToken: (data: {
        token: string;
        userId: string;
        expiresAt: Date;
        deviceInfo?: string;
        ipAddress?: string;
    }) => prisma.refreshToken.create({ data }),

    revokeRefreshToken: (id: string) =>
        prisma.refreshToken.update({
            where: { id },
            data: { isRevoked: true },
        }),

    revokeAllUserTokens: (userId: string) =>
        prisma.refreshToken.updateMany({
            where: { userId },
            data: { isRevoked: true },
        }),

    deleteExpiredTokens: () =>
        prisma.refreshToken.deleteMany({
            where: { expiresAt: { lt: new Date() } },
        }),

    // ==================== VERIFICATION TOKEN ====================
    findVerificationToken: (token: string) =>
        prisma.verificationToken.findUnique({
            where: { token },
            include: { user: true },
        }),

    createVerificationToken: (data: {
        token: string;
        type: "EMAIL_VERIFICATION" | "PASSWORD_RESET";
        userId: string;
        expiresAt: Date;
    }) => prisma.verificationToken.create({ data }),

    markTokenUsed: (id: string) =>
        prisma.verificationToken.update({
            where: { id },
            data: { usedAt: new Date() },
        }),
};
