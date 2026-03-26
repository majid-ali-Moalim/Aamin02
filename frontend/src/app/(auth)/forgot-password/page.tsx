'use client'

import { useState } from 'react'
import Link from 'next/link'
import { authService } from '@/lib/api'
import { Phone, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.forgotPassword(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Sent</h1>
            <p className="text-gray-600 mb-8">
              We've sent password reset instructions to your email address. 
              Please check your inbox and follow the link to reset your password.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    )
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

        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
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
