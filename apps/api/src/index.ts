import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./auth";
import { galleryRoutes } from "./gallery";
import { imageRoutes } from "./image";
import { categoryRoutes } from "./category";
import { userRoutes } from "./user";
import { likeRoutes } from "./like";
import { commentRoutes } from "./comment";
import { tagRoutes } from "./tag";

const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    })
  )
  .get("/", () => ({ message: "Gallery API Ready", version: "1.0.0" }))
  .use(authRoutes)
  .use(galleryRoutes)
  .use(imageRoutes)
  .use(categoryRoutes)
  .use(userRoutes)
  .use(likeRoutes)
  .use(commentRoutes)
  .use(tagRoutes)
  .listen(8080);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;