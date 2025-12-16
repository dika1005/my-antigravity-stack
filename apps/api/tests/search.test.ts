import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import { createTestApp, testUser, cleanupTestData, getCookieValue } from './helper'
import { prisma } from '../src/lib/prisma'

describe('Search API - Comprehensive', () => {
  const app = createTestApp()
  let userId: string = ''
  let galleryId: string = ''
  let imageId: string = ''

  beforeAll(async () => {
    await cleanupTestData()

    const { hashPassword } = await import('../src/lib/password')

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: testUser.email,
        password: await hashPassword(testUser.password),
        name: 'John Photographer',
      },
    })
    userId = user.id

    // Create test gallery
    const gallery = await prisma.gallery.create({
      data: {
        title: 'Beautiful Landscapes',
        slug: 'beautiful-landscapes',
        description: 'Amazing landscape photography collection',
        userId: user.id,
        isPublic: true,
      },
    })
    galleryId = gallery.id

    // Create test image
    const image = await prisma.image.create({
      data: {
        title: 'Mountain Sunset',
        description: 'Stunning mountain sunset view',
        galleryId: gallery.id,
        userId: user.id,
        filename: 'mountain-sunset.jpg',
        url: 'https://example.com/mountain-sunset.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
      },
    })
    imageId = image.id
  })

  afterAll(async () => {
    await cleanupTestData()
  })

  // ==================== SEARCH VALIDATION ====================
  describe('Validation', () => {
    it('should reject empty query', async () => {
      const res = await app.handle(new Request('http://localhost/api/search?q='))
      expect([400, 422]).toContain(res.status)
    })

    it('should reject query less than 2 characters', async () => {
      const res = await app.handle(new Request('http://localhost/api/search?q=a'))
      expect([400, 422]).toContain(res.status)
    })

    it('should reject missing query parameter', async () => {
      const res = await app.handle(new Request('http://localhost/api/search'))
      expect([400, 422]).toContain(res.status)
    })
  })

  // ==================== SEARCH ALL ====================
  describe('Search All Types', () => {
    it('should search and return results structure', async () => {
      const res = await app.handle(new Request('http://localhost/api/search?q=mountain'))

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)
      expect(body.data).toHaveProperty('galleries')
      expect(body.data).toHaveProperty('images')
      expect(body.data).toHaveProperty('users')
      expect(body.data).toHaveProperty('total')
    })

    it('should find image by title', async () => {
      const res = await app.handle(new Request('http://localhost/api/search?q=Mountain'))

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.images.length).toBeGreaterThan(0)
      expect(body.data.images[0].title).toContain('Mountain')
    })

    it('should find gallery by title', async () => {
      const res = await app.handle(new Request('http://localhost/api/search?q=Landscapes'))

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.galleries.length).toBeGreaterThan(0)
    })

    it('should find user by name', async () => {
      const res = await app.handle(new Request('http://localhost/api/search?q=John'))

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.users.length).toBeGreaterThan(0)
    })
  })

  // ==================== SEARCH BY TYPE ====================
  describe('Search by Type', () => {
    it('should search only galleries', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/search?q=beautiful&type=gallery')
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.galleries.length).toBeGreaterThan(0)
    })

    it('should search only images', async () => {
      const res = await app.handle(new Request('http://localhost/api/search?q=mountain&type=image'))

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.images.length).toBeGreaterThan(0)
    })

    it('should search only users', async () => {
      const res = await app.handle(new Request('http://localhost/api/search?q=john&type=user'))

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.users.length).toBeGreaterThan(0)
    })
  })

  // ==================== PAGINATION ====================
  describe('Pagination', () => {
    it('should support pagination parameters', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/search?q=mountain&page=1&limit=5')
      )

      expect(res.status).toBe(200)
    })
  })

  // ==================== NO RESULTS ====================
  describe('No Results', () => {
    it('should return empty arrays for non-matching query', async () => {
      const res = await app.handle(new Request('http://localhost/api/search?q=xyznonexistent123'))

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.total.galleries).toBe(0)
      expect(body.data.total.images).toBe(0)
      expect(body.data.total.users).toBe(0)
    })
  })
})
