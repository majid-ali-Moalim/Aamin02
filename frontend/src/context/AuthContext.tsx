'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
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
      // Mock user data for development
      const mockUser = {
        id: '1',
        email: 'aamin@admin',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      }
      setUser(mockUser)
    } catch (error) {
      localStorage.removeItem('token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // Mock authentication for development
      // Available test credentials:
      // Admin: aamin@admin / 123321@admin
      // Dispatcher: dispatcher@aamin.so / dispatcher123
      // Manager: manager@aamin.so / manager123
      // Driver: driver@aamin.so / driver123
      // Patient: patient@aamin.so / patient123
      // Crew: crew@aamin.so / crew123
      
      if (email === 'aamin@admin' && password === '123321@admin') {
        const mockUser = {
          id: '1',
          email: email,
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        }
        const mockToken = 'mock-jwt-token-admin-12345'
        
        setUser(mockUser)
        setToken(mockToken)
        localStorage.setItem('token', mockToken)
        
        // Redirect based on role
        switch (mockUser.role) {
          case 'admin':
            router.push('/admin/dashboard')
            break
          case 'dispatcher':
            router.push('/dispatcher/dashboard')
            break
          case 'manager':
            router.push('/manager/dashboard')
            break
          case 'driver':
            router.push('/driver/dashboard')
            break
          case 'patient':
            router.push('/patient/dashboard')
            break
          case 'crew':
            router.push('/crew/dashboard')
            break
          default:
            router.push('/')
        }
      } else if (email === 'dispatcher@aamin.so' && password === 'dispatcher123') {
        const mockUser = {
          id: '2',
          email: email,
          role: 'dispatcher',
          firstName: 'Dispatcher',
          lastName: 'User'
        }
        const mockToken = 'mock-jwt-token-dispatcher-12345'
        
        setUser(mockUser)
        setToken(mockToken)
        localStorage.setItem('token', mockToken)
        router.push('/dispatcher/dashboard')
      } else if (email === 'manager@aamin.so' && password === 'manager123') {
        const mockUser = {
          id: '3',
          email: email,
          role: 'manager',
          firstName: 'Manager',
          lastName: 'User'
        }
        const mockToken = 'mock-jwt-token-manager-12345'
        
        setUser(mockUser)
        setToken(mockToken)
        localStorage.setItem('token', mockToken)
        router.push('/manager/dashboard')
      } else if (email === 'driver@aamin.so' && password === 'driver123') {
        const mockUser = {
          id: '4',
          email: email,
          role: 'driver',
          firstName: 'Driver',
          lastName: 'User'
        }
        const mockToken = 'mock-jwt-token-driver-12345'
        
        setUser(mockUser)
        setToken(mockToken)
        localStorage.setItem('token', mockToken)
        router.push('/driver/dashboard')
      } else if (email === 'patient@aamin.so' && password === 'patient123') {
        const mockUser = {
          id: '5',
          email: email,
          role: 'patient',
          firstName: 'Patient',
          lastName: 'User'
        }
        const mockToken = 'mock-jwt-token-patient-12345'
        
        setUser(mockUser)
        setToken(mockToken)
        localStorage.setItem('token', mockToken)
        router.push('/patient/dashboard')
      } else if (email === 'crew@aamin.so' && password === 'crew123') {
        const mockUser = {
          id: '6',
          email: email,
          role: 'crew',
          firstName: 'Crew',
          lastName: 'User'
        }
        const mockToken = 'mock-jwt-token-crew-12345'
        
        setUser(mockUser)
        setToken(mockToken)
        localStorage.setItem('token', mockToken)
        router.push('/crew/dashboard')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
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
