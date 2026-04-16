'use client'

import AdminStubPage from '@/components/layout/AdminStubPage'
import { BarChart2 } from 'lucide-react'

export default function PerformanceReportsPage() {
  return (
    <AdminStubPage 
      title="Performance & Efficiency Metrics" 
      description="Scorecards and KPI tracking for all departments, employees, and vehicles."
      icon={BarChart2}
    />
  )
}
