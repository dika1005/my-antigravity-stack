// apps/web/app/page.tsx
'use client'

import { useGetUsers } from '@/hooks/useApi'
import { api } from '@/lib/api' // Kita tes koneksi root juga

export default function Home() {
  const { users, loading } = useGetUsers()

  return (
    <main className="min-h-screen bg-black text-white p-24 font-mono">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">
        Antigravity Stack 🪐
      </h1>

      <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50">
        <h2 className="text-xl font-bold mb-2">Status Inisialisasi:</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li>
            Folder <code>types</code>: <span className="text-green-400">Ready</span> (Placeholder)
          </li>
          <li>
            Folder <code>hooks</code>: <span className="text-green-400">Ready</span> (Waiting for backend)
          </li>
          <li>
            Backend: <span className="text-yellow-400">Empty (Clean Slate)</span>
          </li>
        </ul>
      </div>

      {/* Area untuk menampilkan data user nanti */}
      <div className="mt-8">
        <p className="text-sm text-gray-500">
          {loading ? "Loading..." : `Jumlah User: ${users?.length || 0}`}
        </p>
      </div>
    </main>
  )
}