import { authRepository } from '../auth.repository'

export const logoutService = {
  logout: async (refreshToken: string) => {
    // Find refresh token
    const storedToken = await authRepository.findRefreshToken(refreshToken)

    if (!storedToken) {
      return { success: false, message: 'Refresh token tidak valid' }
    }

    // Revoke token
    await authRepository.revokeRefreshToken(storedToken.id)

    return { success: true, message: 'Logout berhasil' }
  },

  logoutAll: async (userId: string) => {
    // Revoke all user's refresh tokens
    await authRepository.revokeAllUserTokens(userId)

    return { success: true, message: 'Logout dari semua device berhasil' }
  },
}
