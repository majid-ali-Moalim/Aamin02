'use client'

import AdminStubPage from '@/components/layout/AdminStubPage'
import { Activity } from 'lucide-react'

export default function ActiveTripsPage() {
  return (
    <AdminStubPage 
      title="Active Mission Trips" 
      description="Live telemetry and location tracking for ongoing ambulance journeys."
      icon={Activity}
    />
  )
}
