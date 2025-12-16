import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { loginService } from './login.service'
import { success, error } from '@lib/response'

export const loginController = new Elysia({ prefix: '/login' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'your-super-secret-key',
      exp: '15m',
    })
  )
  .post(
    '/',
    async ({ body, jwt, set, headers, cookie }) => {
      const result = await loginService.login(
        body.email,
        body.password,
        headers['user-agent'],
        headers['x-forwarded-for'] || undefined
      )

      if (!result.success) {
        set.status = 401
        return error(result.message)
      }

      // Generate access token
      const token = await jwt.sign({
        sub: result.data!.user.id,
        email: result.data!.user.email,
        role: result.data!.user.role,
      })

      // Set access token in httpOnly cookie
      cookie.accessToken.set({
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 minutes
        path: '/',
      })

      // Set refresh token in httpOnly cookie
      cookie.refreshToken.set({
        value: result.data!.refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      })

      return success({ user: result.data!.user }, result.message)
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
      cookie: t.Cookie({
        accessToken: t.Optional(t.String()),
        refreshToken: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Auth'],
        summary: 'Login',
        description: 'Authenticates user and sets tokens in cookies',
      },
    }
  )
