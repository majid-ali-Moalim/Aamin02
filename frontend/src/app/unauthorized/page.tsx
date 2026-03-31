'use client'

import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You do not have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex flex-col space-y-3">
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/login">
              Sign in with a different account
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
