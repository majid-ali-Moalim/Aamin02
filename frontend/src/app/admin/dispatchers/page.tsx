'use client'

import AdminStubPage from '@/components/layout/AdminStubPage'
import { Users } from 'lucide-react'

export default function DispatchersPage() {
  return (
    <AdminStubPage 
      title="Dispatcher Control" 
      description="Overview and management of your command center personnel."
      icon={Users}
    />
  )
}
