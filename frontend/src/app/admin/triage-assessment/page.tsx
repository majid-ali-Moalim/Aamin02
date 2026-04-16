'use client'

import AdminStubPage from '@/components/layout/AdminStubPage'
import { Activity } from 'lucide-react'

export default function TriageAssessmentPage() {
  return (
    <AdminStubPage 
      title="Triage & Assessment"
      description="Advanced clinical triage system for emergency case prioritization. This module will handle priority classification, condition review, and urgency flagging."
      icon={Activity}
    />
  )
}
