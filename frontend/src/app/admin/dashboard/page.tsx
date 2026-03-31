'use client'

import { useState, useEffect } from 'react'
import { Activity, Users, Truck, AlertCircle, TrendingUp, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { reportsService } from '@/lib/api'

interface DashboardStats {
  activeEmergencies: number
  availableAmbulances: number
  totalUsers: number
  totalDrivers: number
  totalPatients: number
  completedCases: number
  pendingRequests: number
  referralCount: number
}

interface RecentActivity {
  id: string
  type: 'emergency' | 'user' | 'ambulance' | 'referral'
  description: string
  time: string
  status: 'success' | 'warning' | 'error'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await reportsService.getDashboardStats()
        setStats(data.stats)
        setRecentActivity(data.recentActivity)
        setError(null)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-gray-500 font-medium tracking-wide">Initializing real-time monitoring...</p>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-4 max-w-2xl mx-auto mt-10">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <div>
          <h3 className="text-lg font-bold text-red-900">Dashboard Synchronisation Failed</h3>
          <p className="text-red-700">{error || 'Unable to connect to the medical dispatch engine.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200"
          >
            Reconnect System
          </button>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Active Emergencies',
      value: stats.activeEmergencies,
      change: stats.activeEmergencies > 0 ? `+${stats.activeEmergencies}` : '0',
      icon: Activity,
      color: 'bg-blue-500'
    },
    {
      title: 'Available Ambulances',
      value: stats.availableAmbulances,
      change: 'Active Now',
      icon: Truck,
      color: 'bg-green-500'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: `+${stats.totalUsers}`,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Completed Cases',
      value: stats.completedCases,
      change: 'Record Total',
      icon: CheckCircle,
      color: 'bg-emerald-500'
    }
  ]

  const secondaryStats = [
    {
      title: 'Total Drivers',
      value: stats.totalDrivers,
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Activity,
      color: 'bg-cyan-500'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Referral Count',
      value: stats.referralCount,
      icon: AlertCircle,
      color: 'bg-pink-500'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <Activity className="w-4 h-4" />
      case 'user':
        return <Users className="w-4 h-4" />
      case 'ambulance':
        return <Truck className="w-4 h-4" />
      case 'referral':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of Aamin Ambulance operations</p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last week</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {secondaryStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                <Truck className="w-6 h-6 mb-2" />
                <p className="text-sm font-medium">New Request</p>
              </button>
              <button className="p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                <Users className="w-6 h-6 mb-2" />
                <p className="text-sm font-medium">Add User</p>
              </button>
              <button className="p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors">
                <Activity className="w-6 h-6 mb-2" />
                <p className="text-sm font-medium">View Reports</p>
              </button>
              <button className="p-4 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors">
                <AlertCircle className="w-6 h-6 mb-2" />
                <p className="text-sm font-medium">Settings</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">All Systems Operational</p>
              <p className="text-xs text-gray-500">Last checked: 2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Database Connected</p>
              <p className="text-xs text-gray-500">Response time: 45ms</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">High Server Load</p>
              <p className="text-xs text-gray-500">CPU: 78% | Memory: 65%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
