s# 🖼️ Gallery API

A modern, high-performance REST API for image gallery management built with cutting-edge technologies.

![Bun](https://img.shields.io/badge/Bun-1.x-black?logo=bun)
![Elysia](https://img.shields.io/badge/Elysia-1.4-purple)
![Prisma](https://img.shields.io/badge/Prisma-7.1-2D3748?logo=prisma)
![MariaDB](https://img.shields.io/badge/MariaDB-10.x-003545?logo=mariadb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **[Bun](https://bun.sh)** | Ultra-fast JavaScript runtime & package manager |
| **[Elysia](https://elysiajs.com)** | Type-safe, ergonomic web framework |
| **[Prisma](https://prisma.io)** | Next-generation ORM for database access |
| **[MariaDB](https://mariadb.org)** | Reliable relational database |
| **[Swagger](https://swagger.io)** | Interactive API documentation |

---

## 📁 Project Structure

```
apps/api/
├── src/
│   ├── auth/           # Authentication (register, login, verify, refresh, logout)
│   ├── gallery/        # Gallery CRUD operations
│   ├── image/          # Image upload, update, delete
│   ├── category/       # Category management
│   ├── user/           # User profile management
│   ├── like/           # Like/Unlike system
│   ├── comment/        # Comment system with replies
│   ├── tag/            # Tag management
│   ├── lib/            # Shared utilities (prisma, response helpers, etc.)
│   ├── middleware/     # Auth middleware with JWT
│   └── index.ts        # Application entry point
├── prisma/
│   └── schema.prisma   # Database schema
└── tests/              # Test files
```

---

## ✨ Features

### 🔐 Authentication
- **Email verification** - Secure registration with email confirmation
- **JWT tokens** - Access + Refresh token strategy
- **HttpOnly cookies** - Secure token storage
- **Role-based access** - USER and ADMIN roles

### 🖼️ Gallery Management
- Create, read, update, delete galleries
- Public/private visibility
- Category organization
- Cover image support
- View count tracking

### 📸 Image Handling
- Upload images to galleries
- Metadata support (title, description, dimensions)
- Thumbnail generation ready
- Owner-only modifications

### 💬 Social Features
- **Comments** - Nested replies support
- **Likes** - For both galleries and images
- **Tags** - Organize content with tags

---

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.x
- [MariaDB](https://mariadb.org) or MySQL

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd my-antigravity-stack/apps/api

# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials
```

### Environment Variables

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/gallery_db"

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-key-change-in-production"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
```

### Database Setup

```bash
# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate dev

# (Optional) Seed the database
bunx prisma db seed
```

### Running the Server

```bash
# Development mode (with hot reload)
bun run dev

# Run tests
bun test
```

---

## 📚 API Documentation

Once the server is running, access the interactive Swagger documentation:

| Endpoint | Description |
|----------|-------------|
| `http://localhost:8080/api/swagger` | Swagger UI - Interactive playground |
| `http://localhost:8080/api/swagger/json` | OpenAPI specification (JSON) |

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/verify` | Verify email with token |
| POST | `/api/auth/login` | Login and get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout and revoke tokens |

### Galleries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gallery` | List public galleries |
| GET | `/api/gallery/:slug` | Get gallery detail |
| POST | `/api/gallery` | Create gallery 🔒 |
| PATCH | `/api/gallery/:id` | Update gallery 🔒 |
| DELETE | `/api/gallery/:id` | Delete gallery 🔒 |

### Images
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/image` | Upload image 🔒 |
| PATCH | `/api/image/:id` | Update image 🔒 |
| DELETE | `/api/image/:id` | Delete image 🔒 |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/category` | List categories |
| POST | `/api/category` | Create category 👑 |
| PATCH | `/api/category/:id` | Update category 👑 |
| DELETE | `/api/category/:id` | Delete category 👑 |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/me` | Get my profile 🔒 |
| PATCH | `/api/user/me` | Update my profile 🔒 |
| GET | `/api/user/:id/galleries` | Get user's galleries |

### Likes & Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/like/gallery/:id` | Like gallery 🔒 |
| DELETE | `/api/like/gallery/:id` | Unlike gallery 🔒 |
| POST | `/api/like/image/:id` | Like image 🔒 |
| DELETE | `/api/like/image/:id` | Unlike image 🔒 |
| GET | `/api/comment/gallery/:id` | Get gallery comments |
| POST | `/api/comment/gallery/:id` | Add comment 🔒 |
| DELETE | `/api/comment/:id` | Delete comment 🔒 |

### Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tag` | List all tags |
| POST | `/api/tag` | Create tag 🔒 |

> 🔒 = Requires authentication  
> 👑 = Requires admin role

---

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Elysia    │────▶│   Prisma    │────▶ MariaDB
│  (Browser)  │◀────│   Server    │◀────│    ORM      │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
              ┌─────▼─────┐ ┌─────▼─────┐
              │    JWT    │ │  Swagger  │
              │   Auth    │ │   Docs    │
              └───────────┘ └───────────┘
```

### Design Patterns

- **Repository Pattern** - Database queries abstracted into repositories
- **Service Layer** - Business logic separated from controllers
- **Plugin Architecture** - Elysia plugins for middleware reuse
- **Type-safe Validation** - Request/response validation with TypeBox

---

## 🧪 Testing

```bash
# Run all tests
bun test

# Run with watch mode
bun test --watch

# Run specific test file
bun test tests/auth.test.ts
```

---

## 📖 Learning Resources

- [Elysia Documentation](https://elysiajs.com/introduction.html)
- [Prisma Guide](https://www.prisma.io/docs/getting-started)
- [Bun Documentation](https://bun.sh/docs)
- [JWT Best Practices](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ using Bun + Elysia + Prisma**

</div>
