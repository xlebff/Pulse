import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/api'

const SESSION_KEY = 'pulse_current_user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  }, [user])

  async function register({ name, email, password }) {
    try {
      const data = await api.register({ name, email, password })
      setUser(data)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  async function login({ email, password }) {
    try {
      const data = await api.login({ email, password })
      setUser(data)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider')
  return context
}