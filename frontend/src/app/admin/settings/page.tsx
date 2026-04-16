'use client'

import AdminStubPage from '@/components/layout/AdminStubPage'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <AdminStubPage 
      title="System Settings"
      description="Configure global system parameters, dispatch protocols, notification preferences, security settings, and backup schedules."
      icon={Settings}
    />
  )
}
