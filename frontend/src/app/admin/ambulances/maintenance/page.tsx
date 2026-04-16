'use client'

import AdminStubPage from '@/components/layout/AdminStubPage'
import { FileText } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <AdminStubPage 
      title="Maintenance Records" 
      description="Historical service logs, preventative maintenance schedules, and mechanical repairs."
      icon={FileText}
    />
  )
}
