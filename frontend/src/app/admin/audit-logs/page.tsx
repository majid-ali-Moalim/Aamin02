'use client'

import AdminStubPage from '@/components/layout/AdminStubPage'
import { ScrollText } from 'lucide-react'

export default function AuditLogsPage() {
  return (
    <AdminStubPage 
      title="Audit Logs"
      description="Comprehensive system activity logs tracking user actions, dispatch changes, assignment history, and handover status for complete accountability."
      icon={ScrollText}
    />
  )
}
