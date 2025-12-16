import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import { createTestApp, testUser, testUser2, cleanupTestData, getCookieValue } from './helper'
import { prisma } from '../src/lib/prisma'

describe('Bookmark API - Comprehensive', () => {
  const app = createTestApp()
  let user1AccessToken: string = ''
  let user2AccessToken: string = ''
  let user1Id: string = ''
  let galleryId: string = ''
  let imageId: string = ''

  beforeAll(async () => {
    await cleanupTestData()

    const { hashPassword } = await import('../src/lib/password')

    // Create users
    const user1 = await prisma.user.create({
      data: {
        email: testUser.email,
        password: await hashPassword(testUser.password),
        name: testUser.name,
      },
    })
    user1Id = user1.id

    await prisma.user.create({
      data: {
        email: testUser2.email,
        password: await hashPassword(testUser2.password),
        name: testUser2.name,
      },
    })

    // Create gallery and image
    const gallery = await prisma.gallery.create({
      data: {
        title: 'Test Gallery',
        slug: 'test-gallery-bookmark',
        userId: user1.id,
        isPublic: true,
      },
    })
    galleryId = gallery.id

    const image = await prisma.image.create({
      data: {
        galleryId: gallery.id,
        userId: user1.id,
        filename: 'test.jpg',
        url: 'https://example.com/test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
      },
    })
    imageId = image.id

    // Login users
    const res1 = await app.handle(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password }),
      })
    )
    user1AccessToken = getCookieValue(res1.headers.get('set-cookie'), 'accessToken') || ''

    const res2 = await app.handle(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser2.email, password: testUser2.password }),
      })
    )
    user2AccessToken = getCookieValue(res2.headers.get('set-cookie'), 'accessToken') || ''
  })

  afterAll(async () => {
    await cleanupTestData()
  })

  // ==================== AUTHORIZATION ====================
  describe('Authorization', () => {
    it('should reject bookmark without authentication', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/bookmark/gallery/${galleryId}`, { method: 'POST' })
      )
      expect(res.status).toBe(401)
    })

    it('should reject bookmark list without authentication', async () => {
      const res = await app.handle(new Request('http://localhost/api/bookmark'))
      expect(res.status).toBe(401)
    })
  })

  // ==================== BOOKMARK GALLERY ====================
  describe('Bookmark Gallery', () => {
    it('should bookmark gallery', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/bookmark/gallery/${galleryId}`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.bookmarked).toBe(true)
    })

    it('should handle duplicate bookmark gracefully', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/bookmark/gallery/${galleryId}`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect([200, 400]).toContain(res.status)
    })

    it('should check bookmark status', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/bookmark/gallery/${galleryId}/status`, {
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.bookmarked).toBe(true)
    })

    it('should return false for non-bookmarked gallery', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/bookmark/gallery/${galleryId}/status`, {
          headers: { Cookie: `accessToken=${user2AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.bookmarked).toBe(false)
    })

    it('should remove gallery bookmark', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/bookmark/gallery/${galleryId}`, {
          method: 'DELETE',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.bookmarked).toBe(false)
    })
  })

  // ==================== BOOKMARK IMAGE ====================
  describe('Bookmark Image', () => {
    it('should bookmark image', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/bookmark/image/${imageId}`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.bookmarked).toBe(true)
    })

    it('should check image bookmark status', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/bookmark/image/${imageId}/status`, {
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.bookmarked).toBe(true)
    })

    it('should remove image bookmark', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/bookmark/image/${imageId}`, {
          method: 'DELETE',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.bookmarked).toBe(false)
    })
  })

  // ==================== LIST BOOKMARKS ====================
  describe('List Bookmarks', () => {
    beforeAll(async () => {
      // Add some bookmarks for listing
      await app.handle(
        new Request(`http://localhost/api/bookmark/gallery/${galleryId}`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )
      await app.handle(
        new Request(`http://localhost/api/bookmark/image/${imageId}`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )
    })

    it('should list user bookmarks', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/bookmark', {
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.length).toBeGreaterThan(0)
    })

    it('should support pagination', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/bookmark?page=1&limit=10', {
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.meta).toBeDefined()
    })

    it('should return empty for user with no bookmarks', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/bookmark', {
          headers: { Cookie: `accessToken=${user2AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.length).toBe(0)
    })
  })
})

// ==================== LIKE STATUS CHECK ====================
describe('Like Status Check', () => {
  const app = createTestApp()
  let userAccessToken: string = ''
  let galleryId: string = ''
  let imageId: string = ''

  beforeAll(async () => {
    await cleanupTestData()

    const { hashPassword } = await import('../src/lib/password')

    const user = await prisma.user.create({
      data: {
        email: 'likestatus@test.com',
        password: await hashPassword('Test123456'),
        name: 'Like Status Tester',
      },
    })

    const gallery = await prisma.gallery.create({
      data: {
        title: 'Like Status Gallery',
        slug: 'like-status-gallery',
        userId: user.id,
        isPublic: true,
      },
    })
    galleryId = gallery.id

    const image = await prisma.image.create({
      data: {
        galleryId: gallery.id,
        userId: user.id,
        filename: 'status.jpg',
        url: 'https://example.com/status.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
      },
    })
    imageId = image.id

    // Login
    const res = await app.handle(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'likestatus@test.com', password: 'Test123456' }),
      })
    )
    userAccessToken = getCookieValue(res.headers.get('set-cookie'), 'accessToken') || ''
  })

  afterAll(async () => {
    await cleanupTestData()
  })

  describe('Gallery Like Status', () => {
    it('should return false when not liked', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/like/gallery/${galleryId}/status`, {
          headers: { Cookie: `accessToken=${userAccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.liked).toBe(false)
      expect(body.data.count).toBe(0)
    })

    it('should return true after liking', async () => {
      // Like first
      await app.handle(
        new Request(`http://localhost/api/like/gallery/${galleryId}`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${userAccessToken}` },
        })
      )

      // Check status
      const res = await app.handle(
        new Request(`http://localhost/api/like/gallery/${galleryId}/status`, {
          headers: { Cookie: `accessToken=${userAccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.liked).toBe(true)
      expect(body.data.count).toBe(1)
    })
  })

  describe('Image Like Status', () => {
    it('should return false when not liked', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/like/image/${imageId}/status`, {
          headers: { Cookie: `accessToken=${userAccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.liked).toBe(false)
    })

    it('should return true after liking', async () => {
      // Like first
      await app.handle(
        new Request(`http://localhost/api/like/image/${imageId}`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${userAccessToken}` },
        })
      )

      // Check status
      const res = await app.handle(
        new Request(`http://localhost/api/like/image/${imageId}/status`, {
          headers: { Cookie: `accessToken=${userAccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.liked).toBe(true)
    })
  })

  describe('Authorization', () => {
    it('should reject status check without auth', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/like/gallery/${galleryId}/status`)
      )
      expect(res.status).toBe(401)
    })
  })
})
