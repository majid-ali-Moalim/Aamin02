'use client'

import AdminStubPage from '@/components/layout/AdminStubPage'
import { Activity } from 'lucide-react'

export default function EmergencyReportsPage() {
  return (
    <AdminStubPage 
      title="Emergency Operations Report" 
      description="Deep analytics into dispatch times, success rates, and emergency request trends."
      icon={Activity}
    />
  )
}
