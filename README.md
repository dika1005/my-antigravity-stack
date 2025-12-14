# 🚀 My Antigravity Stack

A modern full-stack monorepo powered by **Turborepo** with blazing-fast performance.

![Bun](https://img.shields.io/badge/Bun-1.x-black?logo=bun)
![Elysia](https://img.shields.io/badge/Elysia-1.4-purple)
![Prisma](https://img.shields.io/badge/Prisma-7.1-2D3748?logo=prisma)
![MariaDB](https://img.shields.io/badge/MariaDB-10.x-003545?logo=mariadb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?logo=turborepo)

---

## 📦 What's Inside?

This monorepo includes the following apps:

| App | Description | Tech |
|-----|-------------|------|
| **[API](./apps/api)** | RESTful API for gallery management | Elysia + Prisma + MariaDB |

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────┐
│                    TURBOREPO                        │
│              (Monorepo Orchestrator)                │
├─────────────────────────────────────────────────────┤
│  apps/                                              │
│  └── api/          → Elysia + Bun + Prisma         │
│                                                     │
│  packages/         → Shared code (coming soon)      │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.x
- [MariaDB](https://mariadb.org) or MySQL

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/my-antigravity-stack.git
cd my-antigravity-stack

# Install dependencies
bun install

# Setup environment variables
cp apps/api/.env.example apps/api/.env
# Edit the .env file with your database credentials
```

### Development

```bash
# Run all apps in development mode
bun run dev

# Or run specific app
cd apps/api && bun run dev
```

### Database Setup

```bash
cd apps/api

# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate dev
```

---

## 📚 API Documentation

When the API server is running:

| URL | Description |
|-----|-------------|
| `http://localhost:8080/api` | API Base URL |
| `http://localhost:8080/api/swagger` | 📖 Swagger UI Documentation |

---

## 🏗️ Project Structure

```
my-antigravity-stack/
├── apps/
│   └── api/                 # Backend API
│       ├── src/
│       │   ├── auth/        # Authentication
│       │   ├── gallery/     # Gallery CRUD
│       │   ├── image/       # Image management
│       │   ├── category/    # Categories
│       │   ├── user/        # User profiles
│       │   ├── like/        # Like system
│       │   ├── comment/     # Comments
│       │   ├── tag/         # Tags
│       │   └── lib/         # Shared utilities
│       ├── prisma/          # Database schema
│       └── tests/           # Test files
├── packages/                # Shared packages (future)
├── turbo.json               # Turborepo config
└── package.json             # Root package.json
```

---

## ✨ Features

- 🔐 **JWT Authentication** - Secure access & refresh tokens
- 🖼️ **Gallery Management** - Full CRUD with categories
- 📸 **Image Handling** - Upload with metadata
- 💬 **Social Features** - Comments & likes
- 🏷️ **Tagging System** - Organize content
- 📖 **Swagger Docs** - Interactive API documentation
- ⚡ **Ultra Fast** - Powered by Bun runtime

---

## 🧪 Testing

```bash
cd apps/api
bun test
```

---

## 📄 License

MIT License

---

<div align="center">

**Built with ❤️ using Bun + Elysia + Turborepo**

[API Docs](./apps/api/README.md)

</div>
