import { Elysia } from "elysia";
import { registerController } from "./register/register.controller";
import { verifyController } from "./verify/verify.controller";
import { loginController } from "./login/login.controller";
import { refreshController } from "./refresh/refresh.controller";
import { logoutController } from "./logout/logout.controller";

/**
 * Auth Routes Aggregator
 * Combines all auth-related routes under /auth prefix
 */
export const authRoutes = new Elysia({ prefix: "api/auth" })
    .use(registerController)  // POST /api/auth/register
    .use(verifyController)    // POST /api/auth/verify
    .use(loginController)     // POST /api/auth/login
    .use(refreshController)   // POST /api/auth/refresh
    .use(logoutController);   // POST /api/auth/logout
