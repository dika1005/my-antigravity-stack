// apps/web/hooks/useApi.ts
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'
import type { User } from '@/types'

export const useGetUsers = () => {
  // Kita set tipe data array kosong dulu
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ⬇️ BAGIAN INI DI-COMMENT DULU KARENA ENDPOINT BELUM ADA ⬇️
        /*
        const { data, error } = await api.users.get()
        if (error) throw new Error(String(error.value))
        if (data) setUsers(data as User[])
        */
       
        // Simulasi sukses dulu biar gak loading terus
        console.log("Hooks ready! Menunggu endpoint /users di backend...")
        setLoading(false)

      } catch (err) {
        setError('Error fetching data')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { users, loading, error }
}