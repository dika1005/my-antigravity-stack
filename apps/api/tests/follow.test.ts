import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import { createTestApp, testUser, testUser2, cleanupTestData, getCookieValue } from './helper'
import { prisma } from '../src/lib/prisma'

describe('Follow API - Comprehensive', () => {
  const app = createTestApp()
  let user1AccessToken: string = ''
  let user2AccessToken: string = ''
  let user1Id: string = ''
  let user2Id: string = ''

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

    const user2 = await prisma.user.create({
      data: {
        email: testUser2.email,
        password: await hashPassword(testUser2.password),
        name: testUser2.name,
      },
    })
    user2Id = user2.id

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
    it('should reject follow without authentication', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/follow`, { method: 'POST' })
      )
      expect(res.status).toBe(401)
    })

    it('should reject unfollow without authentication', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/follow`, { method: 'DELETE' })
      )
      expect(res.status).toBe(401)
    })

    it('should reject follow status check without authentication', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/follow/status`)
      )
      expect(res.status).toBe(401)
    })
  })

  // ==================== FOLLOW USER ====================
  describe('Follow User', () => {
    it('should follow a user', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/follow`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.following).toBe(true)
      expect(body.data.count).toBe(1)
    })

    it('should not follow self', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user1Id}/follow`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(400)
    })

    it('should handle duplicate follow gracefully', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/follow`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect([200, 400]).toContain(res.status)
    })
  })

  // ==================== FOLLOW STATUS ====================
  describe('Follow Status', () => {
    it('should check follow status', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/follow/status`, {
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.following).toBe(true)
      expect(body.data.followersCount).toBeDefined()
      expect(body.data.followingCount).toBeDefined()
    })

    it('should return false for non-followed user', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user1Id}/follow/status`, {
          headers: { Cookie: `accessToken=${user2AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.following).toBe(false)
    })
  })

  // ==================== FOLLOWERS LIST ====================
  describe('Followers List', () => {
    it('should list user followers', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/followers`)
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.length).toBeGreaterThan(0)
      expect(body.data[0].id).toBe(user1Id)
      expect(body.data[0].name).toBe(testUser.name)
    })

    it('should support pagination', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/followers?page=1&limit=10`)
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.meta).toBeDefined()
      expect(body.meta.page).toBe(1)
      expect(body.meta.limit).toBe(10)
    })

    it('should return empty for user with no followers', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user1Id}/followers`)
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.length).toBe(0)
    })
  })

  // ==================== FOLLOWING LIST ====================
  describe('Following List', () => {
    it('should list users being followed', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user1Id}/following`)
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.length).toBeGreaterThan(0)
      expect(body.data[0].id).toBe(user2Id)
      expect(body.data[0].name).toBe(testUser2.name)
    })

    it('should support pagination', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user1Id}/following?page=1&limit=10`)
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.meta).toBeDefined()
    })

    it('should return empty for user following no one', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/following`)
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.length).toBe(0)
    })
  })

  // ==================== UNFOLLOW USER ====================
  describe('Unfollow User', () => {
    it('should unfollow a user', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/follow`, {
          method: 'DELETE',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.following).toBe(false)
      expect(body.data.count).toBe(0)
    })

    it('should handle unfollow when not following', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/follow`, {
          method: 'DELETE',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      expect([200, 400]).toContain(res.status)
    })

    it('should verify follower count after unfollow', async () => {
      const res = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/followers`)
      )

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data.length).toBe(0)
    })
  })

  // ==================== MUTUAL FOLLOW ====================
  describe('Mutual Follow', () => {
    beforeAll(async () => {
      // Clean follow data
      await prisma.follow.deleteMany({})
    })

    it('should allow mutual following', async () => {
      // User1 follows User2
      const res1 = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/follow`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )
      expect(res1.status).toBe(200)

      // User2 follows User1
      const res2 = await app.handle(
        new Request(`http://localhost/api/user/${user1Id}/follow`, {
          method: 'POST',
          headers: { Cookie: `accessToken=${user2AccessToken}` },
        })
      )
      expect(res2.status).toBe(200)
    })

    it('should show correct counts for mutual friends', async () => {
      // Check User1's status (should have 1 follower and 1 following)
      const res1 = await app.handle(
        new Request(`http://localhost/api/user/${user1Id}/follow/status`, {
          headers: { Cookie: `accessToken=${user2AccessToken}` },
        })
      )

      const body1 = await res1.json()
      expect(body1.data.followersCount).toBe(1)
      expect(body1.data.followingCount).toBe(1)

      // Check User2's status
      const res2 = await app.handle(
        new Request(`http://localhost/api/user/${user2Id}/follow/status`, {
          headers: { Cookie: `accessToken=${user1AccessToken}` },
        })
      )

      const body2 = await res2.json()
      expect(body2.data.followersCount).toBe(1)
      expect(body2.data.followingCount).toBe(1)
    })
  })
})
