'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Bell, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  ShieldAlert, 
  Truck, 
  User, 
  MoreHorizontal,
  ChevronRight,
  Loader2,
  Trash2,
  Check,
  X,
  FileText,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { notificationsService } from '@/lib/api'
import { format } from 'date-fns'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [all, statsData] = await Promise.all([
        notificationsService.getAll(),
        notificationsService.getStats()
      ])
      setNotifications(all || [])
      setStats(statsData)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResolve = async (id: string) => {
    try {
      await notificationsService.resolve(id)
      fetchData()
    } catch (err) {
      console.error('Error resolving notification:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return
    try {
      await notificationsService.remove(id)
      fetchData()
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      const textMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.relatedId?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const typeMatch = !typeFilter || item.type === typeFilter
      const priorityMatch = !priorityFilter || item.priority === priorityFilter
      const statusMatch = !statusFilter || item.status === statusFilter

      return textMatch && typeMatch && priorityMatch && statusMatch
    })
  }, [notifications, searchTerm, typeFilter, priorityFilter, statusFilter])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'MEDIUM': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'LOW': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNREAD': return 'bg-blue-500'
      case 'READ': return 'bg-gray-300'
      case 'RESOLVED': return 'bg-green-500'
      case 'ARCHIVED': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'EMERGENCY': return <Activity className="w-5 h-5 text-red-500" />
      case 'STAFF': return <User className="w-5 h-5 text-blue-500" />
      case 'MAINTENANCE': return <Truck className="w-5 h-5 text-orange-500" />
      case 'COMPLIANCE': return <ShieldAlert className="w-5 h-5 text-purple-500" />
      case 'REFERRAL': return <FileText className="w-5 h-5 text-cyan-500" />
      case 'PATIENT_CARE': return <CheckCircle2 className="w-5 h-5 text-green-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 mt-1">Track emergency alerts, staff updates, and system warnings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl font-bold h-11 px-5 shadow-sm bg-white border-gray-200"
            onClick={() => notificationsService.markAllRead().then(fetchData)}
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total', value: stats?.total || 0, icon: Bell, color: 'blue' },
          { label: 'Unread', value: stats?.unread || 0, icon: Clock, color: 'red' },
          { label: 'Emergency', value: stats?.typeCounts?.EMERGENCY || 0, icon: Activity, color: 'orange' },
          { label: 'Staff alerts', value: stats?.typeCounts?.STAFF || 0, icon: User, color: 'purple' },
          { label: 'Compliance', value: stats?.typeCounts?.COMPLIANCE || 0, icon: ShieldAlert, color: 'cyan' },
          { label: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle2, color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl bg-${stat.color}-50`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <span className="text-2xl font-black text-gray-900 leading-none">{stat.value}</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, message, or related ID..."
              className="w-full pl-12 pr-6 h-12 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all font-medium text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              className="h-12 bg-gray-50 border-none rounded-2xl px-6 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/10 min-w-[140px]"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="STAFF">Staff</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="COMPLIANCE">Compliance</option>
              <option value="SYSTEM">System</option>
            </select>
            <select 
              className="h-12 bg-gray-50 border-none rounded-2xl px-6 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/10 min-w-[140px]"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">Priority</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select 
              className="h-12 bg-gray-50 border-none rounded-2xl px-6 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/10 min-w-[140px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Syncing Global Alerts...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-20 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No Notifications Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Notification</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Related To</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                  <th className="py-4 px-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredNotifications.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-blue-50/20 transition-colors group ${item.status === 'UNREAD' ? 'bg-blue-50/10' : ''}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm">
                          {getIcon(item.type)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-md">
                      <div className={`text-sm font-bold leading-tight ${item.status === 'UNREAD' ? 'text-blue-900' : 'text-gray-900'}`}>
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.message}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                       {item.relatedModule && (
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                             {item.relatedModule}
                           </span>
                           <span className="text-xs font-bold text-gray-700">
                             {item.relatedId || 'N/A'}
                           </span>
                         </div>
                       )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusBadge(item.status)}`} />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs font-bold text-gray-700">
                        {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {format(new Date(item.createdAt), 'hh:mm a')}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.status !== 'RESOLVED' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg hover:bg-green-50 hover:text-green-600"
                            onClick={() => handleResolve(item.id)}
                            title="Resolve"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
