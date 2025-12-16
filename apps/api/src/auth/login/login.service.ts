import { authRepository } from '../auth.repository'
import { verifyPassword } from '@lib/password'
import { generateToken, generateExpiry } from '@lib/token'

interface LoginResult {
  success: boolean
  message: string
  data?: {
    refreshToken: string
    user: {
      id: string
      email: string
      name: string | null
      role: string
    }
  }
}

export const loginService = {
  login: async (
    email: string,
    password: string,
    deviceInfo?: string,
    ipAddress?: string
  ): Promise<LoginResult> => {
    // Find user
    const user = await authRepository.findUserByEmail(email)

    if (!user) {
      return { success: false, message: 'Email atau password salah' }
    }

    // Check if user is active
    if (!user.isActive) {
      return { success: false, message: 'Akun dinonaktifkan' }
    }

    // Verify password
    const validPassword = await verifyPassword(password, user.password)
    if (!validPassword) {
      return { success: false, message: 'Email atau password salah' }
    }

    // Generate refresh token
    const refreshTokenValue = generateToken()
    const refreshExpiresAt = generateExpiry(24 * 7) // 7 days

    // Store refresh token
    await authRepository.createRefreshToken({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: refreshExpiresAt,
      deviceInfo,
      ipAddress,
    })

    return {
      success: true,
      message: 'Login berhasil',
      data: {
        refreshToken: refreshTokenValue,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    }
  },
}
