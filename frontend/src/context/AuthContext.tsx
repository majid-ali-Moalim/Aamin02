'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/api'
import { Role } from '@/types'

interface User {
  id: string
  username: string
  email: string
  role: Role
  employee?: {
    employeeRole: {
      name: string
    }
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      fetchUser(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (authToken: string) => {
    try {
      const userData = await authService.getMe(authToken)
      setUser(userData as any)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response: any = await authService.login(email, password)
      const { access_token, user: userData } = response
      
      setUser(userData)
      setToken(access_token)
      localStorage.setItem('token', access_token)
      
      // Redirect based on role
      if (userData.role === Role.ADMIN) {
        router.push('/admin/dashboard')
      } else if (userData.role === Role.EMPLOYEE) {
        const roleName = userData.employee?.employeeRole?.name?.toUpperCase()
        if (roleName === 'DISPATCHER') router.push('/dispatcher/dashboard')
        else if (roleName === 'DRIVER') router.push('/driver/dashboard')
        else if (roleName === 'NURSE') router.push('/nurse/dashboard')
        else router.push('/admin/dashboard') // Fallback
      } else if (userData.role === Role.PATIENT) {
        router.push('/patient/dashboard')
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('AuthContext Login Error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
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
