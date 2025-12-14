import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./auth";

const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true, // Allow cookies
    })
  )
  .get("/", () => ({ message: "Gallery API Ready", version: "1.0.0" }))
  .use(authRoutes)
  .listen(8080);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;