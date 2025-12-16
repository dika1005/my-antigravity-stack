import { randomBytes } from 'crypto'

/** Generate random hex token */
export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex')
}

/** Generate URL-safe base64 token */
export function generateUrlSafeToken(length: number = 32): string {
  return randomBytes(length).toString('base64url')
}

/** Generate expiry date from now */
export function generateExpiry(hours: number): Date {
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + hours)
  return expiry
}

/** Check if date has expired */
export function isExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate
}

/** Generate slug from text */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Generate unique slug with random suffix */
export function generateUniqueSlug(text: string): string {
  return `${generateSlug(text)}-${randomBytes(4).toString('hex')}`
}
