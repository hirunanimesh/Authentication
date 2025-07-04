'use client'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/userslice'
import api from '../../constants/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    console.log('[AuthProvider] running fetchUser')
  const dispatch = useDispatch()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me', { withCredentials: true });
        
        const { username, email, role } = response.data;
        dispatch(setUser({ username, email, role }));
      } catch (error) {
        console.error('[AuthProvider] Error fetching user:', error);
        // Optionally, you can dispatch an action to set an error state
        // dispatch(setError(error.message));
      } finally {
        setHydrated(true)
      }
    }

    fetchUser()
  }, [dispatch])

  if (!hydrated) return <div>Loading...</div>

  return <>{children}</>
}
export default AuthProvider