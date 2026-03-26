'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Phone, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: 'aamin@admin',
    password: '123321@admin'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Aamin Ambulance</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Don't have an account?{' '}
              <Link href="/register" className="text-red-600 hover:text-red-700 font-medium">
                Contact your administrator
              </Link>
            </p>
            
            {/* Test Credentials Info */}
            <div className="bg-gray-50 rounded-xl p-4 text-left">
              <p className="text-sm font-medium text-gray-700 mb-3">Test Credentials:</p>
              <div className="space-y-2 text-xs">
                <div><span className="font-medium">Admin:</span> aamin@admin / 123321@admin</div>
                <div><span className="font-medium">Dispatcher:</span> dispatcher@aamin.so / dispatcher123</div>
                <div><span className="font-medium">Manager:</span> manager@aamin.so / manager123</div>
                <div><span className="font-medium">Driver:</span> driver@aamin.so / driver123</div>
                <div><span className="font-medium">Patient:</span> patient@aamin.so / patient123</div>
                <div><span className="font-medium">Crew:</span> crew@aamin.so / crew123</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Quick Access</p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Back to Home
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/hire-ambulance"
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Request Ambulance
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
