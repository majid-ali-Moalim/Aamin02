'use client'

import AdminStubPage from '@/components/layout/AdminStubPage'
import { Clock } from 'lucide-react'

export default function AttendanceLogsPage() {
  return (
    <AdminStubPage 
      title="Attendance & Timesheets" 
      description="Daily punch-in/out logs, break times, and monthly attendance summaries."
      icon={Clock}
    />
  )
}
