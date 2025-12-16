import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// Slug generator
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ==========================================
// SEED DATA
// ==========================================

const categories = [
  { name: 'Nature', description: 'Beautiful landscapes and nature photography' },
  { name: 'Architecture', description: 'Buildings, structures, and urban landscapes' },
  { name: 'People', description: 'Portraits and candid photography' },
  { name: 'Animals', description: 'Wildlife and pet photography' },
  { name: 'Food', description: 'Culinary art and food photography' },
  { name: 'Abstract', description: 'Abstract and creative photography' },
  { name: 'Travel', description: 'Travel destinations and adventures' },
  { name: 'Technology', description: 'Tech, gadgets, and innovation' },
]

const tags = [
  'sunset',
  'sunrise',
  'mountain',
  'ocean',
  'forest',
  'city',
  'street',
  'portrait',
  'landscape',
  'macro',
  'night',
  'black-and-white',
  'colorful',
  'minimal',
  'vintage',
  'modern',
  'dramatic',
  'peaceful',
  'vibrant',
  'moody',
]

const users = [
  { email: 'admin@example.com', password: 'Admin123!', name: 'Admin User', role: 'ADMIN' as const },
  { email: 'john@example.com', password: 'John1234!', name: 'John Doe', role: 'USER' as const },
  { email: 'jane@example.com', password: 'Jane1234!', name: 'Jane Smith', role: 'USER' as const },
  { email: 'demo@example.com', password: 'Demo1234!', name: 'Demo User', role: 'USER' as const },
]

// Sample galleries with images (using Picsum for placeholder images)
const sampleGalleries = [
  {
    title: 'Mountain Adventures',
    description: 'Breathtaking mountain landscapes from around the world',
    categorySlug: 'nature',
    isPublic: true,
    images: [
      { title: 'Alpine Sunrise', width: 1920, height: 1280 },
      { title: 'Misty Peaks', width: 1920, height: 1080 },
      { title: 'Snow Summit', width: 1600, height: 1200 },
      { title: 'Valley View', width: 1920, height: 1280 },
    ],
  },
  {
    title: 'Urban Exploration',
    description: 'Modern architecture and city life',
    categorySlug: 'architecture',
    isPublic: true,
    images: [
      { title: 'Skyscraper', width: 1080, height: 1920 },
      { title: 'City Lights', width: 1920, height: 1080 },
      { title: 'Modern Bridge', width: 1920, height: 1280 },
    ],
  },
  {
    title: 'Portrait Collection',
    description: 'Beautiful portrait photography',
    categorySlug: 'people',
    isPublic: true,
    images: [
      { title: 'Natural Light Portrait', width: 1200, height: 1600 },
      { title: 'Street Portrait', width: 1080, height: 1350 },
      { title: 'Studio Shot', width: 1200, height: 1500 },
    ],
  },
  {
    title: 'Wildlife Wonders',
    description: 'Amazing animals in their natural habitat',
    categorySlug: 'animals',
    isPublic: true,
    images: [
      { title: 'Lion King', width: 1920, height: 1280 },
      { title: 'Eagle Flight', width: 1920, height: 1080 },
      { title: 'Ocean Dolphin', width: 1600, height: 1200 },
      { title: 'Forest Deer', width: 1920, height: 1280 },
      { title: 'Colorful Parrot', width: 1280, height: 1920 },
    ],
  },
  {
    title: 'Culinary Delights',
    description: 'Delicious food photography',
    categorySlug: 'food',
    isPublic: true,
    images: [
      { title: 'Gourmet Dish', width: 1920, height: 1280 },
      { title: 'Fresh Fruits', width: 1600, height: 1200 },
      { title: 'Coffee Art', width: 1080, height: 1080 },
    ],
  },
  {
    title: 'Abstract Dreams',
    description: 'Creative and abstract photography',
    categorySlug: 'abstract',
    isPublic: true,
    images: [
      { title: 'Color Splash', width: 1920, height: 1080 },
      { title: 'Light Trails', width: 1920, height: 1280 },
      { title: 'Geometric Shapes', width: 1080, height: 1080 },
    ],
  },
  {
    title: 'World Travels',
    description: 'Adventures around the globe',
    categorySlug: 'travel',
    isPublic: true,
    images: [
      { title: 'Tropical Beach', width: 1920, height: 1280 },
      { title: 'Ancient Temple', width: 1600, height: 1200 },
      { title: 'European Street', width: 1080, height: 1920 },
      { title: 'Desert Dunes', width: 1920, height: 1080 },
    ],
  },
  {
    title: 'Tech & Gadgets',
    description: 'Modern technology and innovation',
    categorySlug: 'technology',
    isPublic: true,
    images: [
      { title: 'Smartphone', width: 1200, height: 1600 },
      { title: 'Computer Setup', width: 1920, height: 1080 },
      { title: 'Circuit Board', width: 1920, height: 1280 },
    ],
  },
]

// ==========================================
// MAIN SEED FUNCTION
// ==========================================

async function main() {
  console.log('🌱 Starting database seed...\n')

  // 1. Seed Categories
  console.log('📁 Seeding categories...')
  const createdCategories: Record<string, string> = {}
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(cat.name) },
      update: {},
      create: {
        name: cat.name,
        slug: slugify(cat.name),
        description: cat.description,
      },
    })
    createdCategories[category.slug] = category.id
    console.log(`   ✓ ${category.name}`)
  }

  // 2. Seed Tags
  console.log('\n🏷️  Seeding tags...')
  const createdTags: Record<string, string> = {}
  for (const tagName of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: slugify(tagName) },
      update: {},
      create: {
        name: tagName,
        slug: slugify(tagName),
      },
    })
    createdTags[tag.slug] = tag.id
  }
  console.log(`   ✓ Created ${tags.length} tags`)

  // 3. Seed Users
  console.log('\n👤 Seeding users...')
  const createdUsers: Record<string, string> = {}
  for (const userData of users) {
    const hashedPassword = await hashPassword(userData.password)
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      },
    })
    createdUsers[userData.email] = user.id
    console.log(`   ✓ ${userData.name} (${userData.role})`)
  }

  // 4. Seed Galleries & Images
  console.log('\n🖼️  Seeding galleries and images...')
  let imageIdCounter = 1
  const userEmails = Object.keys(createdUsers)

  for (const galleryData of sampleGalleries) {
    // Assign to random user (not admin)
    const randomUserEmail = userEmails[
      Math.floor(Math.random() * (userEmails.length - 1)) + 1
    ] as string
    const userId = createdUsers[randomUserEmail] as string
    const categoryId = createdCategories[galleryData.categorySlug] as string

    // Create gallery
    const gallery = await prisma.gallery.upsert({
      where: { slug: slugify(galleryData.title) },
      update: {},
      create: {
        title: galleryData.title,
        slug: slugify(galleryData.title),
        description: galleryData.description,
        isPublic: galleryData.isPublic,
        userId,
        categoryId,
        coverImage: `https://picsum.photos/seed/${slugify(galleryData.title)}/800/600`,
      },
    })

    // Create images for gallery
    for (const imageData of galleryData.images) {
      const imageUrl = `https://picsum.photos/seed/img${imageIdCounter}/${imageData.width}/${imageData.height}`
      const thumbnailUrl = `https://picsum.photos/seed/img${imageIdCounter}/400/300`

      await prisma.image.upsert({
        where: {
          id: `seed-image-${imageIdCounter}`,
        },
        update: {},
        create: {
          id: `seed-image-${imageIdCounter}`,
          title: imageData.title,
          description: `Beautiful ${imageData.title.toLowerCase()} photography`,
          filename: `${slugify(imageData.title)}.jpg`,
          url: imageUrl,
          thumbnailUrl,
          mimeType: 'image/jpeg',
          size: Math.floor(Math.random() * 5000000) + 500000, // 500KB - 5MB
          width: imageData.width,
          height: imageData.height,
          galleryId: gallery.id,
          userId,
        },
      })

      imageIdCounter++
    }

    console.log(`   ✓ ${galleryData.title} (${galleryData.images.length} images)`)
  }

  // 5. Add some likes
  console.log('\n❤️  Adding sample likes...')
  const allImages = await prisma.image.findMany({ take: 10 })
  const allUserIds = Object.values(createdUsers)

  for (const image of allImages) {
    // Each user likes each image (no duplicates)
    const shuffledUsers = [...allUserIds].sort(() => Math.random() - 0.5)
    const usersToLike = shuffledUsers.slice(0, Math.floor(Math.random() * 3) + 1)

    for (const userId of usersToLike) {
      await prisma.like.upsert({
        where: {
          userId_imageId: {
            userId: userId,
            imageId: image.id,
          },
        },
        update: {},
        create: {
          userId: userId,
          imageId: image.id,
        },
      })
    }
  }
  console.log('   ✓ Added random likes to images')

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('🎉 Seed completed successfully!\n')
  console.log('Summary:')
  console.log(`   - ${categories.length} categories`)
  console.log(`   - ${tags.length} tags`)
  console.log(`   - ${users.length} users`)
  console.log(`   - ${sampleGalleries.length} galleries`)
  console.log(`   - ${imageIdCounter - 1} images`)
  console.log('\nTest accounts:')
  console.log('   Admin: admin@example.com / Admin123!')
  console.log('   Demo:  demo@example.com / Demo1234!')
  console.log('='.repeat(50))
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    prisma.$disconnect()
    process.exit(1)
  })
