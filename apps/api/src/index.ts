import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
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
  .use(
    openapi({
      documentation: {
        info: {
          title: "Gallery API",
          version: "1.0.0",
          description: "API documentation for Gallery application",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Gallery", description: "Gallery management endpoints" },
          { name: "Image", description: "Image upload and management endpoints" },
          { name: "Category", description: "Category management endpoints" },
          { name: "User", description: "User profile endpoints" },
          { name: "Like", description: "Like/Unlike endpoints" },
          { name: "Comment", description: "Comment management endpoints" },
          { name: "Tag", description: "Tag management endpoints" },
        ],
      },
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