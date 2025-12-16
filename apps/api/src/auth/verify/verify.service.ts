import { prisma } from '@lib/prisma'
import { authRepository } from '../auth.repository'
import { isExpired } from '@lib/token'

export const verifyService = {
  verifyEmail: async (token: string) => {
    // Find pending user by token
    const pendingUser = await authRepository.findPendingByToken(token)

    if (!pendingUser) {
      return { success: false, message: 'Token verifikasi tidak valid' }
    }

    // Check if token expired
    if (isExpired(pendingUser.expiresAt)) {
      await authRepository.deletePendingUser(pendingUser.id)
      return { success: false, message: 'Token sudah expired. Silakan daftar ulang.' }
    }

    // Move to User table using transaction
    await prisma.$transaction([
      prisma.user.create({
        data: {
          email: pendingUser.email,
          password: pendingUser.password,
          name: pendingUser.name,
        },
      }),
      prisma.pendingUser.delete({ where: { id: pendingUser.id } }),
    ])

    return { success: true, message: 'Email berhasil diverifikasi. Silakan login.' }
  },
}
