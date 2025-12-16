import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import { createTestApp, testUser, testUser2, cleanupTestData, getCookieValue } from './helper'
import { prisma } from '../src/lib/prisma'

describe('Like & Comment - Comprehensive', () => {
  const app = createTestApp()
  let user1AccessToken: string = ''
  let user2AccessToken: string = ''
  let galleryId: string = ''
  let imageId: string = ''
  let commentId: string = ''
  let replyId: string = ''

  beforeAll(async () => {
    await cleanupTestData()

    const { hashPassword } = await import('../src/lib/password')

    const user1 = await prisma.user.create({
      data: {
        email: testUser.email,
        password: await hashPassword(testUser.password),
        name: testUser.name,
      },
    })
    const user2 = await prisma.user.create({
      data: {
        email: testUser2.email,
        password: await hashPassword(testUser2.password),
        name: testUser2.name,
      },
    })

    const gallery = await prisma.gallery.create({
      data: { title: 'Test Gallery', slug: 'test-gallery', userId: user1.id, isPublic: true },
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

  // ==================== LIKE GALLERY ====================
  describe('Like Gallery', () => {
    describe('Authorization', () => {
      it('should reject like without authentication', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/like/gallery/${galleryId}`, { method: 'POST' })
        )
        expect(res.status).toBe(401)
      })
    })

    describe('Like Flow', () => {
      it('should like gallery', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/like/gallery/${galleryId}`, {
            method: 'POST',
            headers: { Cookie: `accessToken=${user1AccessToken}` },
          })
        )

        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.data.liked).toBe(true)
        expect(body.data.count).toBe(1)
      })

      it('should handle duplicate like gracefully (toggle)', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/like/gallery/${galleryId}`, {
            method: 'POST',
            headers: { Cookie: `accessToken=${user1AccessToken}` },
          })
        )

        // API uses toggle behavior - returns 200 even if already liked
        expect([200, 400]).toContain(res.status)
      })

      it('should allow different user to like same gallery', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/like/gallery/${galleryId}`, {
            method: 'POST',
            headers: { Cookie: `accessToken=${user2AccessToken}` },
          })
        )

        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.data.count).toBe(2)
      })
    })

    describe('Unlike Flow', () => {
      it('should unlike gallery', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/like/gallery/${galleryId}`, {
            method: 'DELETE',
            headers: { Cookie: `accessToken=${user1AccessToken}` },
          })
        )

        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.data.liked).toBe(false)
        expect(body.data.count).toBe(1)
      })

      it('should handle unlike gracefully when not liked', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/like/gallery/${galleryId}`, {
            method: 'DELETE',
            headers: { Cookie: `accessToken=${user1AccessToken}` },
          })
        )

        // API uses toggle behavior - returns 200 even if not liked
        expect([200, 400]).toContain(res.status)
      })
    })
  })

  // ==================== LIKE IMAGE ====================
  describe('Like Image', () => {
    it('should like image', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/like/image/${imageId}`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.liked).toBe(true)
    })

    it('should unlike image', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/like/image/${imageId}`, {
          method: 'DELETE',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.liked).toBe(false)
    })
  })

  // ==================== COMMENT ====================
  describe('Comment', () => {
    describe('Authorization', () => {
      it('should reject comment without authentication', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/comment/gallery/${galleryId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: 'Unauthorized comment' }),
          })
        )
        expect(res.status).toBe(401)
      })
    })

    describe('Validation', () => {
      it('should reject empty content', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/comment/gallery/${galleryId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `accessToken=${user1AccessToken}`,
            },
            body: JSON.stringify({ content: '' }),
          })
        )
        expect([400, 422]).toContain(res.status)
      })

      it('should reject missing content', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/comment/gallery/${galleryId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `accessToken=${user1AccessToken}`,
            },
            body: JSON.stringify({}),
          })
        )
        expect([400, 422]).toContain(res.status)
      })
    })

    describe('Add Comment', () => {
      it('should add comment to gallery', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/comment/gallery/${galleryId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `accessToken=${user1AccessToken}`,
            },
            body: JSON.stringify({ content: 'Great gallery! Love it!' }),
          })
        )

        expect(res.status).toBe(201)
        const body = await res.json()
        expect(body.data.content).toBe('Great gallery! Love it!')
        expect(body.data.user).toBeDefined()
        commentId = body.data.id
      })

      it('should add reply to comment', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/comment/gallery/${galleryId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `accessToken=${user2AccessToken}`,
            },
            body: JSON.stringify({ content: 'Thanks!', parentId: commentId }),
          })
        )

        expect(res.status).toBe(201)
        const body = await res.json()
        expect(body.data.parentId).toBe(commentId)
        replyId = body.data.id
      })
    })

    describe('List Comments', () => {
      it('should list gallery comments without auth', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/comment/gallery/${galleryId}`)
        )

        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.data.length).toBeGreaterThan(0)
      })

      it('should support pagination', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/comment/gallery/${galleryId}?page=1&limit=5`)
        )

        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.meta).toBeDefined()
      })
    })

    describe('Delete Comment', () => {
      it('should reject delete by non-owner', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/comment/${commentId}`, {
            method: 'DELETE',
            headers: { Cookie: `accessToken=${user2AccessToken}` },
          })
        )
        expect([403, 404]).toContain(res.status)
      })

      it('should delete reply (own comment)', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/comment/${replyId}`, {
            method: 'DELETE',
            headers: { Cookie: `accessToken=${user2AccessToken}` },
          })
        )
        expect(res.status).toBe(200)
      })

      it('should delete own comment', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/comment/${commentId}`, {
            method: 'DELETE',
            headers: { Cookie: `accessToken=${user1AccessToken}` },
          })
        )
        expect(res.status).toBe(200)
      })

      it('should return 404 for deleted comment', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/comment/${commentId}`, {
            method: 'DELETE',
            headers: { Cookie: `accessToken=${user1AccessToken}` },
          })
        )
        expect(res.status).toBe(404)
      })
    })
  })
})
