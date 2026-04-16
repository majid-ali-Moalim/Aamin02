'use client'

import AdminStubPage from '@/components/layout/AdminStubPage'
import { ClipboardList } from 'lucide-react'

export default function AssignmentBoardPage() {
  return (
    <AdminStubPage 
      title="Assignment Board"
      description="Live operational board for assigning ambulances, drivers, and nurses to active emergency cases. Features include smart suggestions and manual reassignment."
      icon={ClipboardList}
    />
  )
}
