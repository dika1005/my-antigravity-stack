import { Elysia } from "elysia";
import { feedController } from "./feed.controller";

export const feedRoutes = new Elysia()
    .use(feedController);