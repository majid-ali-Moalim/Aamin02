'use client'

import { useState } from 'react'
import { Activity, Users, Truck, AlertCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react'

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
  const [stats] = useState<DashboardStats>({
    activeEmergencies: 12,
    availableAmbulances: 8,
    totalUsers: 156,
    totalDrivers: 24,
    totalPatients: 892,
    completedCases: 1234,
    pendingRequests: 5,
    referralCount: 67
  })

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'emergency',
      description: 'New emergency request from Mogadishu',
      time: '2 minutes ago',
      status: 'warning'
    },
    {
      id: '2',
      type: 'ambulance',
      description: 'Ambulance AAM-001 completed assignment',
      time: '15 minutes ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'user',
      description: 'New driver registered: Ahmed Mohamed',
      time: '1 hour ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'referral',
      description: 'Referral sent to Benadir Hospital',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: '5',
      type: 'emergency',
      description: 'Emergency request cancelled - false alarm',
      time: '3 hours ago',
      status: 'error'
    }
  ])

  const statCards = [
    {
      title: 'Active Emergencies',
      value: stats.activeEmergencies,
      change: '+2',
      icon: Activity,
      color: 'bg-blue-500'
    },
    {
      title: 'Available Ambulances',
      value: stats.availableAmbulances,
      change: '+1',
      icon: Truck,
      color: 'bg-green-500'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: '+12',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Completed Cases',
      value: stats.completedCases,
      change: '+45',
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
