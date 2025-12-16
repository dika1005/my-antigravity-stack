import { authRepository } from '../auth.repository'
import { isExpired } from '@lib/token'

interface RefreshResult {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      email: string
      role: string
    }
  }
}

export const refreshService = {
  refresh: async (refreshToken: string): Promise<RefreshResult> => {
    // Find refresh token
    const storedToken = await authRepository.findRefreshToken(refreshToken)

    if (!storedToken) {
      return { success: false, message: 'Refresh token tidak valid' }
    }

    // Check if revoked
    if (storedToken.isRevoked) {
      return { success: false, message: 'Refresh token sudah di-revoke' }
    }

    // Check if expired
    if (isExpired(storedToken.expiresAt)) {
      return { success: false, message: 'Refresh token sudah expired' }
    }

    return {
      success: true,
      message: 'Token berhasil di-refresh',
      data: {
        user: {
          id: storedToken.user.id,
          email: storedToken.user.email,
          role: storedToken.user.role,
        },
      },
    }
  },
}
