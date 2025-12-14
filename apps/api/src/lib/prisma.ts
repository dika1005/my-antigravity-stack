import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Validate required environment variables
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    throw new Error("Missing required database environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME");
}

// Create Prisma adapter with config from environment
const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Singleton pattern untuk Prisma Client
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
