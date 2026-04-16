'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { emergencyRequestsService, ambulancesService, reportsService, employeesService } from '@/lib/api'
import { OverviewMetrics } from '@/components/dashboard/OverviewMetrics'
import { LiveDispatchBoard } from '@/components/dashboard/LiveDispatchBoard'
import { EmergencyQueue } from '@/components/dashboard/EmergencyQueue'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { StaffAvailability } from '@/components/dashboard/StaffAvailability'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Loader2 } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dispatch' | 'analytics'>('dispatch')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetcher = async () => {
    const [statsRes, requestsRes, ambulancesRes, employeesRes] = await Promise.all([
      reportsService.getDashboardStats(),
      emergencyRequestsService.getAll(),
      ambulancesService.getAll(),
      employeesService.getAll()
    ])
    return {
      stats: statsRes.stats,
      recentActivity: statsRes.recentActivity,
      requests: requestsRes,
      ambulances: ambulancesRes,
      employees: employeesRes
    }
  }

  const { data, error, mutate } = useSWR('dashboard-data', fetcher, {
    refreshInterval: 5000
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutate()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active && over) {
      console.log('Dispatched:', active.data.current, 'to:', over.data.current)
    }
  }

  if (error) return (
    <div className="flex items-center justify-center h-full bg-gray-50 text-red-500 text-sm font-semibold">
      Failed to load dashboard data. Please check if the backend is running.
    </div>
  )

  if (!data) return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  )

  // Build chart data for analytics view
  const chartData = Array.from({ length: 12 }, (_, i) => ({
    time: `${i + 8}:00`,
    missions: Math.floor(Math.random() * 10) + 2
  }))

  const priorityData = [
    { name: 'CRITICAL', value: data.requests.filter((r: any) => r.priority === 'CRITICAL').length || 1 },
    { name: 'HIGH', value: data.requests.filter((r: any) => r.priority === 'HIGH').length || 2 },
    { name: 'MEDIUM', value: data.requests.filter((r: any) => r.priority === 'MEDIUM').length || 4 },
    { name: 'LOW', value: data.requests.filter((r: any) => r.priority === 'LOW').length || 3 },
  ]

  const dispatchContent = (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <EmergencyQueue requests={data.requests} />
        <LiveDispatchBoard ambulances={data.ambulances} />
        <StaffAvailability employees={data.employees} />
      </div>
    </DndContext>
  )

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <OverviewMetrics
        stats={data.stats}
        chartData={chartData}
        priorityData={priorityData}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dispatchContent={dispatchContent}
      />

      {/* Activity Feed - Always visible at bottom */}
      <div className="mt-6">
        <ActivityFeed activities={data.recentActivity || []} />
      </div>
    </div>
  )
}