import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import { createTestApp, testUser, testUser2, cleanupTestData, getCookieValue } from './helper'
import { prisma } from '../src/lib/prisma'

describe('Gallery Flow - Comprehensive', () => {
  const app = createTestApp()
  let user1AccessToken: string = ''
  let user2AccessToken: string = ''
  let user1Id: string = ''
  let galleryId: string = ''
  let gallerySlug: string = ''
  let privateGalleryId: string = ''

  beforeAll(async () => {
    await cleanupTestData()

    const { hashPassword } = await import('../src/lib/password')

    // Create user 1
    const user1 = await prisma.user.create({
      data: {
        email: testUser.email,
        password: await hashPassword(testUser.password),
        name: testUser.name,
      },
    })
    user1Id = user1.id

    // Create user 2
    await prisma.user.create({
      data: {
        email: testUser2.email,
        password: await hashPassword(testUser2.password),
        name: testUser2.name,
      },
    })

    // Login user 1
    const res1 = await app.handle(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password }),
      })
    )
    user1AccessToken = getCookieValue(res1.headers.get('set-cookie'), 'accessToken') || ''

    // Login user 2
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

  // ==================== CREATE GALLERY ====================
  describe('1. Create Gallery', () => {
    describe('Authorization', () => {
      it('should reject without authentication', async () => {
        const res = await app.handle(
          new Request('http://localhost/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Unauthorized Gallery' }),
          })
        )
        expect(res.status).toBe(401)
      })

      it('should reject with invalid token', async () => {
        const res = await app.handle(
          new Request('http://localhost/api/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: 'accessToken=invalid-token',
            },
            body: JSON.stringify({ title: 'Invalid Token Gallery' }),
          })
        )
        expect(res.status).toBe(401)
      })
    })

    describe('Validation', () => {
      it('should reject empty title', async () => {
        const res = await app.handle(
          new Request('http://localhost/api/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `accessToken=${user1AccessToken}`,
            },
            body: JSON.stringify({ title: '' }),
          })
        )
        expect([400, 422]).toContain(res.status)
      })

      it('should reject missing title', async () => {
        const res = await app.handle(
          new Request('http://localhost/api/gallery', {
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

    describe('Success', () => {
      it('should create public gallery', async () => {
        const res = await app.handle(
          new Request('http://localhost/api/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `accessToken=${user1AccessToken}`,
            },
            body: JSON.stringify({
              title: 'My Public Gallery',
              description: 'A test gallery',
              isPublic: true,
            }),
          })
        )

        expect(res.status).toBe(201)
        const body = await res.json()
        expect(body.success).toBe(true)
        expect(body.data.title).toBe('My Public Gallery')
        expect(body.data.slug).toBeDefined()
        galleryId = body.data.id
        gallerySlug = body.data.slug
      })

      it('should create private gallery', async () => {
        const res = await app.handle(
          new Request('http://localhost/api/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `accessToken=${user1AccessToken}`,
            },
            body: JSON.stringify({
              title: 'My Private Gallery',
              isPublic: false,
            }),
          })
        )

        expect(res.status).toBe(201)
        const body = await res.json()
        expect(body.data.isPublic).toBe(false)
        privateGalleryId = body.data.id
      })

      it('should auto-generate unique slug for duplicate titles', async () => {
        const res = await app.handle(
          new Request('http://localhost/api/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `accessToken=${user1AccessToken}`,
            },
            body: JSON.stringify({ title: 'My Public Gallery' }),
          })
        )

        expect(res.status).toBe(201)
        const body = await res.json()
        expect(body.data.slug).not.toBe(gallerySlug)
      })
    })
  })

  // ==================== LIST GALLERIES ====================
  describe('2. List Galleries', () => {
    it('should list only public galleries', async () => {
      const res = await app.handle(new Request('http://localhost/api/gallery'))

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.success).toBe(true)

      // All returned galleries should be public
      body.data.forEach((gallery: any) => {
        expect(gallery.isPublic).toBe(true)
      })
    })

    it('should support pagination', async () => {
      const res = await app.handle(new Request('http://localhost/api/gallery?page=1&limit=2'))

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.meta).toBeDefined()
      expect(body.meta.page).toBe(1)
      expect(body.meta.limit).toBe(2)
    })

    it('should handle page out of range', async () => {
      const res = await app.handle(new Request('http://localhost/api/gallery?page=999'))

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.length).toBe(0)
    })

    it('should support search by title', async () => {
      const res = await app.handle(new Request('http://localhost/api/gallery?search=Public'))

      expect(res.status).toBe(200)
    })
  })

  // ==================== GET GALLERY DETAIL ====================
  describe('3. Get Gallery Detail', () => {
    it('should get public gallery by slug', async () => {
      const res = await app.handle(new Request(`http://localhost/api/gallery/${gallerySlug}`))

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.slug).toBe(gallerySlug)
    })

    it('should return 404 for non-existent gallery', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/gallery/non-existent-slug-12345')
      )
      expect(res.status).toBe(404)
    })

    it('should increment view count on access', async () => {
      const before = await prisma.gallery.findFirst({ where: { slug: gallerySlug } })
      const beforeCount = before?.viewCount || 0

      await app.handle(new Request(`http://localhost/api/gallery/${gallerySlug}`))

      const after = await prisma.gallery.findFirst({ where: { slug: gallerySlug } })
      expect(after?.viewCount).toBe(beforeCount + 1)
    })
  })

  // ==================== UPDATE GALLERY ====================
  describe('4. Update Gallery', () => {
    describe('Authorization', () => {
      it('should reject without authentication', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/gallery/${galleryId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Hacked' }),
          })
        )
        expect(res.status).toBe(401)
      })

      it('should reject update by non-owner', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/gallery/${galleryId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `accessToken=${user2AccessToken}`,
            },
            body: JSON.stringify({ title: 'Hacked by User 2' }),
          })
        )
        expect([403, 404]).toContain(res.status)
      })
    })

    describe('Success', () => {
      it('should update own gallery', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/gallery/${galleryId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `accessToken=${user1AccessToken}`,
            },
            body: JSON.stringify({ title: 'Updated Gallery Title' }),
          })
        )

        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.data.title).toBe('Updated Gallery Title')
      })

      it('should update slug when title changes', async () => {
        const oldSlug = gallerySlug
        const res = await app.handle(
          new Request(`http://localhost/api/gallery/${galleryId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Cookie: `accessToken=${user1AccessToken}`,
            },
            body: JSON.stringify({ title: 'Brand New Title' }),
          })
        )

        const body = await res.json()
        expect(body.data.slug).not.toBe(oldSlug)
        gallerySlug = body.data.slug
      })
    })
  })

  // ==================== DELETE GALLERY ====================
  describe('5. Delete Gallery', () => {
    describe('Authorization', () => {
      it('should reject without authentication', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/gallery/${galleryId}`, {
            method: 'DELETE',
          })
        )
        expect(res.status).toBe(401)
      })

      it('should reject delete by non-owner', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/gallery/${galleryId}`, {
            method: 'DELETE',
            headers: { Cookie: `accessToken=${user2AccessToken}` },
          })
        )
        expect([403, 404]).toContain(res.status)
      })
    })

    describe('Success', () => {
      it('should delete own gallery', async () => {
        const res = await app.handle(
          new Request(`http://localhost/api/gallery/${galleryId}`, {
            method: 'DELETE',
            headers: { Cookie: `accessToken=${user1AccessToken}` },
          })
        )

        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.success).toBe(true)
      })

      it('should return 404 for deleted gallery', async () => {
        const res = await app.handle(new Request(`http://localhost/api/gallery/${gallerySlug}`))
        expect(res.status).toBe(404)
      })
    })
  })
})
