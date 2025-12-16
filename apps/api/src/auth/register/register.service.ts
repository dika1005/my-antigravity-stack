import { authRepository } from '../auth.repository'
import { hashPassword, validatePasswordStrength } from '@lib/password'
import { generateToken, generateExpiry, isExpired } from '@lib/token'
import { sendVerificationEmail } from '@lib/email'

export const registerService = {
  register: async (email: string, password: string, name?: string) => {
    // Validate password strength
    const passwordCheck = validatePasswordStrength(password)
    if (!passwordCheck.valid) {
      return { success: false, message: passwordCheck.message }
    }

    // Check if email exists in User table
    const existingUser = await authRepository.findUserByEmail(email)
    if (existingUser) {
      return { success: false, message: 'Email sudah terdaftar' }
    }

    // Check if email exists in PendingUser table
    const existingPending = await authRepository.findPendingByEmail(email)
    if (existingPending) {
      if (isExpired(existingPending.expiresAt)) {
        // Delete expired pending user
        await authRepository.deletePendingUser(existingPending.id)
      } else {
        return { success: false, message: 'Email verifikasi sudah dikirim. Cek inbox Anda.' }
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate verification token
    const verificationToken = generateToken()
    const expiresAt = generateExpiry(24) // 24 hours

    // Create pending user
    await authRepository.createPendingUser({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      expiresAt,
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    return { success: true, message: 'Registrasi berhasil. Cek email untuk verifikasi.' }
  },
}
