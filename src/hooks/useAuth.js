// =============================================
// hooks/useAuth.js — Hook de autenticación
//
// Gestiona el estado de sesión del usuario.
// Escucha cambios de Supabase en tiempo real:
//   - LOGIN: actualiza `user` y `session`
//   - LOGOUT: limpia el estado
//   - TOKEN_REFRESHED: sesión renovada automáticamente
//
// Uso en cualquier componente:
//   const { user, session, loading } = useAuth()
// =============================================

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user,    setUser]    = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión activa al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuchar cambios de sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, session, loading }
}
