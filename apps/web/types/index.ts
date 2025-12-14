// apps/web/types/index.ts

// Import tetap ada supaya siap dipakai nanti
import type { App } from '../../api/src/index'

// 🔴 MATIKAN DULU (Comment) karena backend belum punya endpoint '/users'
// export type User = App['users']['get']['response'][number]

// 🟢 GUNAKAN INI DULU (Manual) untuk inisialisasi biar tidak eror
export interface User {
  id: number
  name: string
  role?: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}