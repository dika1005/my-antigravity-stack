import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

/** Hash password */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/** Verify password */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/** Validate password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number) */
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) return { valid: false, message: 'Password minimal 8 karakter' }
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password harus ada huruf besar' }
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password harus ada huruf kecil' }
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password harus ada angka' }
  return { valid: true }
}
