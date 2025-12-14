import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Server Ready") // Endpoint root doang
  .listen(8080);

export type App = typeof app;