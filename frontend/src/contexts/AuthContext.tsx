import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type User = {
  id: string
  username: string
  hasTeam: boolean
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => boolean
  signup: (username: string, password: string) => boolean
  logout: () => void
  setUserTeam: (hasTeam: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('fbl-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    // Simple validation - in real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('fbl-users') || '{}')
    if (users[username] && users[username].password === password) {
      const userData: User = {
        id: users[username].id,
        username,
        hasTeam: users[username].hasTeam || false,
      }
      setUser(userData)
      localStorage.setItem('fbl-user', JSON.stringify(userData))
      return true
    }
    return false
  }

  const signup = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('fbl-users') || '{}')

    if (users[username]) {
      return false // Username taken
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      hasTeam: false,
    }

    users[username] = newUser
    localStorage.setItem('fbl-users', JSON.stringify(users))

    const userData: User = {
      id: newUser.id,
      username,
      hasTeam: false,
    }

    setUser(userData)
    localStorage.setItem('fbl-user', JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fbl-user')
  }

  const setUserTeam = (hasTeam: boolean) => {
    if (user) {
      const updatedUser = { ...user, hasTeam }
      setUser(updatedUser)
      localStorage.setItem('fbl-user', JSON.stringify(updatedUser))

      // Also update in users database
      const users = JSON.parse(localStorage.getItem('fbl-users') || '{}')
      if (users[user.username]) {
        users[user.username].hasTeam = hasTeam
        localStorage.setItem('fbl-users', JSON.stringify(users))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, setUserTeam }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
