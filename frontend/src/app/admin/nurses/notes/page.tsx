'use client'

import AdminStubPage from '@/components/layout/AdminStubPage'
import { ClipboardList } from 'lucide-react'

export default function MedicalNotesPage() {
  return (
    <AdminStubPage 
      title="Medical Notes & Care Journals" 
      description="Clinical observations, patient vital logs, and treatment documentation from paramedic staff."
      icon={ClipboardList}
    />
  )
}
